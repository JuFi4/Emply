//SyncHorairesService

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Calendar} from 'ionic-native';

//models
import {Horaire} from '../models/horaire';
import {CalendrierEvent} from '../models/calendrierEvent';
import {Etablissement} from '../models/etablissement';

// Providers
import { NotificationsLocalesService } from './notifications-locales-service';
import { ApiBddService } from './api-bdd-service';
import { ConnectivityService } from './connectivity-service';

@Injectable()
export class SyncHorairesService {
  horairesFuturs : Horaire[];
  autoImport = false;
  isHorsLigne : boolean;
  calendrierEvents : CalendrierEvent[];
  calendrierEventsUpdate : CalendrierEvent[]
  etablissement : Etablissement;
  nomCalendrierEvent : string;
  dateCourrante = new Date();

  constructor(private notificationsLocalesCtrl : NotificationsLocalesService, private abiBddCtrl: ApiBddService, private connectivityService: ConnectivityService) {  
    // On fixe les heures, minutes et secondes de la date actuelle à 0
     this.dateCourrante.setHours(0);
     this.dateCourrante.setMinutes(0);
     this.dateCourrante.setSeconds(0);
  }//constructor

  manangeSync(){
     return new Promise((resolve, reject) => {            
        this.setAutoImport();//On instancie l'autoImport par rapport à la valeur sauvegardée
        this.gererCalendrierSmartphone();//Prépare les éléments nécéssaires pour la gestion du calendrier smartphone   
        this.gethorairesFuturs();//On charge et on gère les horaires futurs : gère en même temps les notifications de fin de service et les events du calendrier 
        resolve("Fini");
      });
  }//manangeSync

  private setAutoImport(){ // Si on a coché la case dans "paramètre"
      if(window.localStorage.getItem('autoImport') == "true"){ 
        this.autoImport = true;         
      }
    }//setAutoImport

 
 // Paramètre forceCalendarSync, par défaut à false : on on appelle la fonction en mettant true, les horaires seront synchronisés dans le calendrier même s'ils n'ont pas changé
 // -> Permet de forcer la synchronication lorsqu'on a coché la case "synchronication" dans la page paramètres
  public gethorairesFuturs(forceCalendarSync = false){             
     return new Promise((resolve, reject) => {   
      this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1' || this.connectivityService.isOffline();       
      if(!this.isHorsLigne){ // Si on a internet
                this.abiBddCtrl.getHorairesFuturs(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD')).subscribe(
                  data => {  
                    if(data) { // Si les données sont bien chargées 
                        let dataToString = JSON.stringify(data); //On passe les données en string de JSON pour pouvoir les comparer avec la sauvegarde      
                        let isNewData =   dataToString != window.localStorage.getItem('getHorairesFuturs'); // On compare les horaires stockés avec les nouveaux horaires chargés
                        if(isNewData){ // Si il y a des changement
                           window.localStorage.setItem('getHorairesFuturs', dataToString);//On sauvegarde les nouveaux horaires en local              
                           this.enregsitrerReceptionHoraire();// On lance l'enregsitrement de l'accusé de récéption                       

                          //Récupèration des données de l'établissement de l'utilisateur pour pouvoir l'indiquer dans les nouveau envents calendrier
                          // Puis traitement des horaires avec indicateurs de nouvelles données
                          this.getEtablissement().then(result => this.traiterHorairesFuturs(data, true)).then(result => resolve("Fini"));  
                        } else { // On peut traiter directement les horaires en disant qu'il n'y a pas de nouvelles données          
                            this.traiterHorairesFuturs(data, forceCalendarSync).then(result => resolve("Fini"));  
                        }
                        // Dans tous les cas: on  programme une notification locale pour les horaires en attente de validation
                        this.enregistrerNotificationAttenteValidation();
                        // Dans tous les cas: on  programme une notification locale pour la validation mensuelle
                        this.enregistrerNotificationMensuelle();         
                      } else { 
                          return;
                      }              
                  }); 
          } else { // Mode hors ligne 
              //Si l'établissement est défini en local storage                      
              if(window.localStorage.getItem('etablissement') != null && window.localStorage.getItem('etablissement')  != 'undefined'){
                  this.etablissement = <Etablissement>JSON.parse(window.localStorage.getItem('etablissement'));//On récupère l'établissement
              }
              // Traitement des horaires à partir des données sauvegardés : mode hors-ligne, ou synchronisation du calendrier au cas ou les horaires n'ont pas changés
              if(window.localStorage.getItem('getHorairesFuturs') != null && window.localStorage.getItem('getHorairesFuturs')  != 'undefined'){
                this.traiterHorairesFuturs(JSON.parse(window.localStorage.getItem('getHorairesFuturs')), forceCalendarSync).then(result => resolve("Fini"));  
              }    
          }          
      }); 
    }//gethorairesFuturs

    private getEtablissement(){
       return new Promise((resolve, reject) => {
          this.abiBddCtrl.getEtablissement(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD')).subscribe(etablissement => {
            if(etablissement) { // OK  
                  this.etablissement = <Etablissement>etablissement[0];  // On enregsitre l'établissement
                  window.localStorage.setItem('etablissement', JSON.stringify(this.etablissement));//On sauvegarde l'établissement en local
                  resolve("OK");
              }  else {
                 resolve("Pas établissement");
              }
          });   
        }); 
    }//getEtablissement

    private enregsitrerReceptionHoraire(){
       // On laisse le subscribe vide car on ne traite pas le cas ou la requête ne fonctionne pas
      this.abiBddCtrl.setValVueHoraire(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD')).subscribe(); 
    }//enregsitrerReceptionHoraire

    public traiterHorairesFuturs(data, isNewData){
      return new Promise((resolve, reject) => {      
          if(isNewData){ // Si on les données ont changées les notifications : on remet tout à zéro (on va les refaire)
            this.notificationsLocalesCtrl.resetNotification();//Remise à zéro des notifications de fin de service : elles vont être re-crées    
          }
          this.horairesFuturs = [] // On instancie le tableau des horaires futures
          let verifierCalendrierEvents = (data.length > 0) ? false : true; // On instancie la vérification des horaire futurs à false, SAUF si le tableau des nouveaux horaires est vide
          for(let i = 0; i < data.length; i++){ //Remplissage du tableau horaires avec les données des horaires formatées
            let dateHoraire = new Date(data[i].date);
            let horaire =  new Horaire(data[i].id, 
              dateHoraire,         
              new Date(dateHoraire.getFullYear(), dateHoraire.getMonth(), dateHoraire.getDate(), data[i].heureDebut, data[i].minuteDebut),
              new Date(dateHoraire.getFullYear(), dateHoraire.getMonth(), dateHoraire.getDate(), data[i].heureFin, data[i].minuteFin)
            );            
            this.horairesFuturs.push(horaire);  // On ajoute l'horaire dans le tableau

            if(isNewData) { // Si les données sont nouvelles 
              this.enregistrerNotification(horaire);// On enregsitre la notification
            }
            // Si les horaires ont été modifiés par rapport à la copie locale, on enregsitre l'horaire dans le calendrier du smartphone si besoin
            // -> inutile de fair toute cela si ls horaires n'ont pas changé car  et l'event dans le calendrier pour cet horaire aura forcément déja été crée
            if(isNewData && this.autoImport){       
                  this.enregsitrerDansCalendrierSmartphone(horaire); // On enregsitrer dans le calendrier du smartphone
                  verifierCalendrierEvents = true;          
            } else {
              console.log("Aucune modification des horaires ou sync désactivée - pas besoin de vérifier  les events");
            } 
          } //For

          if(verifierCalendrierEvents){ // A l fin e la boucle: si on est dans un cas où le calendrier à pu être modifié
              this.updateCalendrierEvents(); // Vérifie si certains anciens events ont disparus et sauve la liste actuallisée 
          }
          resolve("Fini");
      }); 
    }//traiterHorairesFuturs

    // Compare la liste des events mise à jour avec l'ancienne liste, et effectue les suppressions nécéssaires dans le calendrier du smartphone
    private updateCalendrierEvents(){
      for(let i = 0; i < this.calendrierEvents.length; i++){ //On boucle sur les anciens events
         if(this.eventStateInList(this.calendrierEvents[i], this.calendrierEventsUpdate) === -2){  // Si l'ancien even n'est pas dans la liste mise à jour
           Calendar.deleteEvent( // On supprime l'event du calendrier
              this.calendrierEvents[i].title,
              this.calendrierEvents[i].location,
              this.calendrierEvents[i].notes,
              this.calendrierEvents[i].startDate,
              this.calendrierEvents[i].endDate);
         }
      }   
      this.calendrierEvents = this.calendrierEventsUpdate; // On replace a liste par celle mise à jour 
      this.calendrierEventsUpdate = []; // On vide la liste des uptate events
      window.localStorage.setItem('calendrierEvents', JSON.stringify(this.calendrierEvents));// On enregsitre la liste en local storage  
    }//updateCalendrierEvents

    private enregsitrerDansCalendrierSmartphone(horaire: Horaire){
        let location ="";
        let note = "";
        if(this.etablissement != null){ //Si on a bien un établissement
            location = this.etablissement.nom+", "+this.etablissement.adresse + (this.etablissement.adresseInfo != null ? ", "+this.etablissement.adresseInfo : "")  + ", " + this.etablissement.codePostal+", "+this.etablissement.localite;
            note =  "Téléphone direction: "+this.etablissement.telDirection + "\nEmail: "+this.etablissement.email;
        } 
        // On formate un CalendrierEvent pour cet horaire 
       let event = new CalendrierEvent(this.nomCalendrierEvent, 
           location,
           note,
           horaire.heureDebut, 
           horaire.heureFin, 
           horaire.id
       );       
       let eventState  = this.eventStateInList(event, this.calendrierEvents);
       if(eventState === -2 || eventState >= 0){ // L'event n'existe pas, ou qu'il a changé: on le créer           
          if(eventState >= 0){//Si l'event existe déja, mais à une date différente : on supprime celui qui est enregsitré
            Calendar.deleteEvent( // On supprime l'event du calendrier
              this.calendrierEvents[eventState].title,
              this.calendrierEvents[eventState].location,
              this.calendrierEvents[eventState].notes,
              this.calendrierEvents[eventState].startDate,
              this.calendrierEvents[eventState].endDate).then(
                (msg) => { // Une fois que l'event a bien été supprimé : on va le re-créer
                  Calendar.createEvent(event.title, event.location, event.notes, event.startDate, event.endDate).then(  // On enregsitre l'évenement dans le calendrier
                    (msg) => { console.log("Création OK"); }, // On enregsitre l'évenement dans le calendrier
                    (err) => { console.log("Creation erreur " + err); }
                  );   
              }, // On enregsitre l'évenement dans le calendrier
                (err) => { console.log("Delete erreur " + err) }   
              );
          } else {//Sinon
              // On créer / re-créer l'event
              Calendar.createEvent(event.title, event.location, event.notes, event.startDate, event.endDate).then(  // On enregsitre l'évenement dans le calendrier
                    (msg) => { console.log("Création OK"); },
                    (err) => { console.log("Creation erreur " + err); }
              );    
          }    
       }   
      this.calendrierEventsUpdate.push(event); // Dans tous les cas:  on enregsitre l'event dans la liste mise à jour
    }//enregsitrerDansCalendrierSmartphone

    // Prépare les éléments nécéssaires pour la gestion du calendrier smartphone
    public gererCalendrierSmartphone(){             
        this.calendrierEvents = []; // Instanciation de l'array qui contient les events déja enregsitrés
        this.calendrierEventsUpdate = []; // Instanciation de l'array qui stock les nouveau events
        try{
              let data = JSON.parse(window.localStorage.getItem('calendrierEvents')); // On récupère les events précédement crées depuis la mémoire locale
              console.log(data);
              for(let i = 0; i < data.length; i++){
                  let event = new CalendrierEvent(data[i].title, data[i].location, data[i].notes, new Date(data[i].startDate), new Date(data[i].endDate), data[i].id);
                  if(event.endDate >= this.dateCourrante){ // Si l'event à lieux aujourd'hui ou dans le futur
                      this.calendrierEvents.push(event)//On le prend dans la liste d'events
                  }
              }
        } catch(Exception){}           
        if(window.localStorage.getItem('autoImportNomEvent') != "undefined" && window.localStorage.getItem('autoImportNomEvent') != null){
          this.nomCalendrierEvent = window.localStorage.getItem('autoImportNomEvent');//On récupère le nom par leqeul on veut sauver les events
      }
    }//gererCalendrierSmartphone

   private eventStateInList(event : CalendrierEvent, liste : CalendrierEvent[]) : number{
      for(let i = 0; i < liste.length; i++){
          if(liste[i].id === event.id){
              if(liste[i].startDate.getTime() === event.startDate.getTime() 
                  && liste[i].endDate.getTime() === event.endDate.getTime()){
                return -1; // L'event existe, avec les mêmes dates : retourne -1
              } else {
                return i; // L'event existe, mais à des dates différents on retourne son index
              }
          }
      }
      return -2; // L'event n'existe pas : retourne -2
    }//eventStateInList

    // Enregsitre la notification locale pour l'horaire passé en paramètre
    private enregistrerNotification(horaire : Horaire){
        if(horaire.heureFin > new Date()){ // Si l'horaire est dans le futur (on ne va pas enregistrer des notif pour un horaire passé !)          
          this.notificationsLocalesCtrl.scheduleNotificationFinDeService(horaire); // On enregsitre la notification locale
        } else {
          console.log("On enregsitre pas de notification pour cet horaire : " + horaire.heureFin);
        }
    }//enregistrerNotification

    // Enregsitre la notification locale mensuelle
    private enregistrerNotificationMensuelle(){
        this.notificationsLocalesCtrl.scheduleNotificationValidationMensuelle(); // On enregsitre la notification locale de fin de mois        
    }//enregistrerNotificationMensuelle

    private enregistrerNotificationAttenteValidation() {
        this.notificationsLocalesCtrl.scheduleNotificationAttenteValidation(); //On enregistre la notification locale alertant que ç'est bientôt la fin de mois et qu'il faut valider les horaires en attente de validation
  }//enregistrerNotificationAttenteValidation

}//SyncHorairesService
