
import { Component, Input} from '@angular/core';
import{NavController, NavParams, AlertController} from 'ionic-angular';
import {Calendar} from 'ionic-native';

// Providers
import { NotificationsLocalesService } from '../../providers/notifications-locales-service';
import {MoisService} from '../../providers/mois-service';
import { ApiBddService } from '../../providers/api-bdd-service';
import { ConnectivityService } from '../../providers/connectivity-service';

//models
import {Mois} from '../../models/mois';
import {Semaine} from '../../models/semaine';
import {Horaire} from '../../models/horaire';
import {Jour} from '../../models/jour';
import {CalendrierEvent} from '../../models/calendrierEvent';
import {Etablissement} from '../../models/etablissement';

/*
  Generated class for the Meshoraires page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-meshoraires',
  templateUrl: 'meshoraires.html'
})
export class MeshorairesPage {
  
  moisListe: Mois[];
  moisSelectionne : Mois;
  semaines : Semaine[]
  semaine : Semaine;
  jours : any[] = [];
  joursMoisPrecedent : any[] = [];
  jour : Jour;
  selJour : any = [];
  annee : any = []; 
  affichageH : Boolean;
  horairesFuturs : Horaire[]; // JULIANA :  Voici le tableau qui contient les horaires futurs, il est chargé par this.gethorairesFuturs(), appellé dans le constructeur
  horaireDuJour : Horaire[]; // Tableau qui contient les horaires du jour selectionné
  inputDisabled : Boolean;    
  dateCourrante = new Date();
  annneeCourrante = new Date().getFullYear(); // Année courrante
  anneeSelectionne : number; 
  moisCourant = new Date().getMonth();
  pasHeure : boolean;
  isDisabledDay : boolean;
  isHorsLigne : boolean;
  autoImport = true;
  calendrierEvents : CalendrierEvent[];
  calendrierEventsUpdate : CalendrierEvent[]
  etablissement : Etablissement;
  nomCalendrierEvent = "Travail";

   constructor(public navCtrl: NavController, public navParams: NavParams, public notificationsLocalesCtrl : NotificationsLocalesService, 
    public moisService : MoisService, public alertCtrl: AlertController, private abiBddCtrl: ApiBddService, private connectivityService: ConnectivityService) {   
     //this.notificationsLocalesCtrl.scheduleNotificationFinDeService(new Date(2017,2,15,17,0),"12h00","17h00",1);
    // window.localStorage.removeItem('autoImportNomEvent');
    // window.localStorage.removeItem('calendrierEvents');
     // Instanciation des valeurs par défaut
     this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1' ||connectivityService.isOffline();
     this.moisService.getSemaine().then(semaines => this.semaines = semaines);
     this.moisService.getMois().then(moisListe => this.moisListe = moisListe).then(result => this.selectionnerMois());
     this.affichageH = false;
     this.pasHeure = true;
     this.anneeSelectionne = this.annneeCourrante; // Par défaut : l'année sélectionnée est l'année courante    
     this.autoImport = this.setAutoImport();

     this.notificationsLocalesCtrl.resetNotificationFinDeService();//Remise à zéro des notifications de fin de service : elles vont être re-crées
     // Méthodes à lancer au chargement de la page
     this.supprimerAnciennesSauvegares(); //Supprime les sauvegardes locales trop ancienne pour éviter de surcharger la mémoire du téléphone    
     this.gererCalendrierSmartphone();    //Prépare les éléments nécéssaires pour la gestion du calendrier smartphone   
     this.gethorairesFuturs(); // On charge et on gère les horaires futurs : gère en même temps les notifications de fin de service et les events du calendrier
    }//constructor

    ionViewDidLoad() {
      console.log('Hello MesHoraires Page');      
    }//ionViewDidLoad

   saveAutoImportChange(){
     window.localStorage.setItem('autoImport', this.autoImport.toString());  // Création de la sauvegarde locale de ces horaires (mois et annee) 
     if(this.autoImport){ // Si on a coché "oui"
      if(window.localStorage.getItem('autoImportNomEvent') != "undefined" && window.localStorage.getItem('autoImportNomEvent') != null){
          this.nomCalendrierEvent = window.localStorage.getItem('autoImportNomEvent');
      }
      let alert = this.alertCtrl.create({
          title: "Nom de l'évenement",
          message: "Entrez le nom par lequel vous souhaitez appeller vos heures de travail dans votre calendrier : ",
          inputs: [
            {
              name: 'nomEvent',         
              value : this.nomCalendrierEvent,
            }          
          ],
          buttons: [   
            {
              text: 'OK',
              handler: data => {
                 this.nomCalendrierEvent = data.nomEvent;//On defini ce nom comme nom pour les event
                 window.localStorage.setItem('autoImportNomEvent', data.nomEvent);//On enregsitre
                 this.gethorairesFuturs();//On relance le chargement des horaires futurs pour qu'ils se synchronisent
              }
            }
          ]
        });
        alert.present();
     }
   }//saveAutoImportChange

    setAutoImport(){
      if(window.localStorage.getItem('autoImport') == "true"){ return true;}
      return false;
    }//setAutoImport

    selectionnerMois(){
        this.moisSelectionne = this.moisListe[this.moisCourant]; 
        console.log("this.moisSelectionne " + this.moisSelectionne.nom);
        this.afficherMois();
    }//selectionnerMois

    afficherMois(){          
     this.affichageH = false; // On désactive le détail du jour
     this.jours.length = 0;
     this.joursMoisPrecedent.length = 0;
     let premierJoursMois = new Date(this.anneeSelectionne, this.moisSelectionne.moisId, 0).getDay(); // On défini quel est le 1er jours du mois (code de 0 à 6 qui défini quel est le jour de la semaine)
    
     // On regarder quel est le mois précédent (par rapport au moisId), si on est en janvier, c'est décembre (ID 11)
     let idMoisPrecedent = this.moisSelectionne.moisId - 1;
     if(idMoisPrecedent === -1) { idMoisPrecedent = 11};

     // On récupére le mois précédent depuis la liste, et on calcul son nombre de jours
     let moisPrecedent = this.moisListe[idMoisPrecedent];
     let nbJoursMoisPrecedent= moisPrecedent.nbJour;
     if(moisPrecedent.moisId == 1 && this.isAnneeBissextile(this.anneeSelectionne)) { nbJoursMoisPrecedent++; } // Si c'est le mois de février et que l'année est bissextile, on ajoute 1 jours
     // Défini quel est le 1er jours du mois d'avant à afficher pour que le mois courrant commance au bon jours 
     let permierJourMoisPrecedentAafficher = nbJoursMoisPrecedent - premierJoursMois + 1; // On met le "+1" car les jours sont déclalés de 1 : 0 = lundi, 1 = mardi...
     
     // On remplis "des jours du mois d'avant" les permiers jours de la semaine qui ne sont pas de ce mois
     // DOIT ETRE DANS UN TABLEAU SEPARÉ DE jours : c'est très important pour la gestion des indexes
     for(let i = 0; i < premierJoursMois; i++){
        //this.jours.push(permierJourMoisPrecedentAafficher);
        this.joursMoisPrecedent.push(new Jour(permierJourMoisPrecedentAafficher));
        permierJourMoisPrecedentAafficher++; 
     }

     let nbJoursMois = this.moisSelectionne.nbJour; // On fixe le nombre de jours en fonction du mois
     if(this.moisSelectionne.moisId == 1 && this.isAnneeBissextile(this.anneeSelectionne)) { nbJoursMois++; } // Si c'est le mois de février et que l'année est bissextile, on ajoute 1 jours
     // On remplis les jours du mois 
     for(let i = 1; i <= nbJoursMois; i++){
        this.jour = new Jour(i);
        this.jours.push(this.jour);
     }
     this.getHorairesMensuels(this.anneeSelectionne, this.moisSelectionne.moisId+1);
    }//afficherMois
     
    //Récupère la liste des horaires pour l'année et le mois passés en paramètre
    getHorairesMensuels(annee, mois){
      if(!this.isHorsLigne){ // Si on a internet
        this.abiBddCtrl.getHorairesMensuels(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), annee, mois).subscribe(
          data => {  
            if(data) { // Si les données sont bien chargées 
                let dataToString = JSON.stringify(data);           
                let isNewData =   dataToString != window.localStorage.getItem('getHorairesMensuels'+mois+'_'+annee); // On compare les horaires stockés aux horaires chargés
                if(isNewData){ // Si il y a des changement, on enregsitre les horaires chargés en mémoire
                    window.localStorage.setItem('getHorairesMensuels'+mois+'_'+annee, dataToString);  // Création de la sauvegarde locale de ces horaires (mois et annee)           
                }                     
                this.traiterHorairesMensuels(data, annee, mois); // Traitement des horaires avec indicateur de nouvelles données
              } else { // Erreur
                  console.log("Aucun horaire pour cette periode");
              }              
          }); 
      } else { // Mode hors ligne
          // Traitement des horaires à partir des données sauvegardés
          this.traiterHorairesMensuels(JSON.parse(window.localStorage.getItem('getHorairesMensuels'+mois+'_'+annee)), annee, mois);      
      }      
    }//getHorairesMensuels

  // Traitement des horaires avec indicateur de nouvelles données 
  traiterHorairesMensuels(data, mois, annee){    
      for(let i = 0; i < data.length; i++){ //Remplissage du tableau horaires avec les données des horaires formatées
        let dateHoraire = new Date(data[i].date);
        let horaire =  new Horaire(data[i].id, 
          dateHoraire,         
          new Date(dateHoraire.getFullYear(), dateHoraire.getMonth(), dateHoraire.getDate(), data[i].heureDebut, data[i].minuteDebut),
          new Date(dateHoraire.getFullYear(), dateHoraire.getMonth(), dateHoraire.getDate(), data[i].heureFin, data[i].minuteFin)
        );                    
        this.jours[dateHoraire.getDate()-1].addHoraire(horaire);  // On ajoute l'horaire au jour auquel il y lieu
      }
    }//traiterHorairesMensuels

  gethorairesFuturs(){
      if(!this.isHorsLigne){ // Si on a internet
              this.abiBddCtrl.getHorairesFuturs(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD')).subscribe(
                data => {  
                  if(data) { // Si les données sont bien chargées 
                      console.log("PAs d'erreur");
                      let dataToString = JSON.stringify(data); //On passe les données en string de JSON pour pouvoir les comparer avec la sauvegarde      
                      let isNewData =   dataToString != window.localStorage.getItem('getHorairesFuturs'); // On compare les horaires stockés avec les nouveaux horaires chargés
                       console.log("isNewData : " + isNewData);
                      if(isNewData){ // Si il y a des changement, on enregsitre les horaires chargés en mémoire

                          //Récupèration des données de l'établissement de l'utilisateur pour pouvoir l'indiquer dans les nouveau envents calendrier 
                           this.abiBddCtrl.getEtablissement(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD')).subscribe(etablissement => {
                              if(etablissement) { // OK  
                                  this.etablissement = <Etablissement>etablissement[0];  // On enregsitre l'établissement
                              } 
                              this.traiterHorairesFuturs(data, true); // On peut maintenant traiter les horaires avec l'indicateur de nouvelles données
                          }); 
                      } else {                  
                          this.traiterHorairesFuturs(data, false); // On peut traiter directement les horaires disant qu'il n'y a pas de nouvelles données
                      }
                      // Dans tous les cas: on  programme une notification locale pour la validation mensuelle
                      this.enregistrerNotificationMensuelle();         
                    } else { 
                        console.log("Erreur");
                    }              
                }); 
        } else { // Mode hors ligne
            // Traitement des horaires à partir des données sauvegardés
            this.traiterHorairesFuturs(JSON.parse(window.localStorage.getItem('getHorairesFuturs')), false);      
        }
    }//gethorairesFuturs

    traiterHorairesFuturs(data, isNewData){
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

        // Si les horaires ont été modifiés par rapport à la copie locale, on enregsitre les notif locales pour l'horaire et on enregsitre l'horaire dans le calendrier du smartphone si besoin
        // -> inutile de fair toute cela si ls horaires n'ont pas changé car la notificaion et l'event dans le calendrier pour cet horaire auront forcément déja été crées
        if(isNewData){
          console.log("Les horaires ont changés");
          this.enregistrerNotification(horaire);
          if(this.autoImport){ //Si l'auto-import est activé                
               this.enregsitrerDansCalendrierSmartphone(horaire); // On enregsitrer dans le calendrier du smartphone
               verifierCalendrierEvents = true;
          }
        } else {
           console.log("Aucune modification des horaires - pas besoin de vérifier les notifications ou les events");
        } 
      } //For

      if(verifierCalendrierEvents){ // A l fin e la boucle: si on est dans un cas où le calendrier à pu être modifié
          this.updateCalendrierEvents(); // Vérifie si certains anciens events ont disparus et sauve la liste actuallisée 
      }
    }//traiterHorairesFuturs

    // Compare la liste des events mise à jour avec l'ancienne liste, et effectue les suppressions nécéssaires dans le calendrier du smartphone
    updateCalendrierEvents(){
      for(let i = 0; i < this.calendrierEvents.length; i++){ //On boucle sur les anciens events
         if(this.eventStateInList(this.calendrierEvents[i], this.calendrierEventsUpdate) === -2){  // Si l'ancien even n'est pas dans la liste mise à jour
          console.log("On supprime : " + this.calendrierEvents[i].id + " : " + this.calendrierEvents[i].startDate+ " : " + this.calendrierEvents[i].endDate);  
           Calendar.deleteEvent( // On supprime l'event du calendrier
              this.calendrierEvents[i].title,
              this.calendrierEvents[i].location,
              this.calendrierEvents[i].notes,
              this.calendrierEvents[i].startDate,
              this.calendrierEvents[i].endDate);
         }
      }//for    
      console.log(this.calendrierEvents);  
      console.log(this.calendrierEventsUpdate);  
      this.calendrierEvents = this.calendrierEventsUpdate; // On replace a liste par celle mise à jour 
      this.calendrierEventsUpdate = []; // On vide la liste des uptate events
      window.localStorage.setItem('calendrierEvents', JSON.stringify(this.calendrierEvents));// On enregsitre la liste en local storage  
    }//updateCalendrierEvents

    enregsitrerDansCalendrierSmartphone(horaire: Horaire){
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
       console.log("Event  : "+ event.id + " -> "+ eventState);
       if(eventState === -2 || eventState >= 0){ // L'event n'existe pas, ou qu'il a changé: on le créer           
          if(eventState >= 0){//Si l'event existe déja, mais à une date différente : on supprime celui qui est enregsitré
            console.log("On supprime l'event : " + event.startDate);
            Calendar.deleteEvent( // On supprime l'event du calendrier
              this.calendrierEvents[eventState].title,
              this.calendrierEvents[eventState].location,
              this.calendrierEvents[eventState].notes,
              this.calendrierEvents[eventState].startDate,
              this.calendrierEvents[eventState].endDate).then(
                (msg) => { // Une fois que l'event a bien été supprimé : on va le re-créer
                  console.log("Delete OK " ) ;
                  Calendar.createEvent(event.title, event.location, event.notes, event.startDate, event.endDate).then(  // On enregsitre l'évenement dans le calendrier
                    (msg) => { console.log("Création OK"); }, // On enregsitre l'évenement dans le calendrier
                    (err) => { console.log("Creation erreur " +err); }
                  );   
              }, // On enregsitre l'évenement dans le calendrier
                (err) => { console.log("Delete erreur " + err) }   
              );
          } else {//Sinon
              // On créer / re-créer l'event
              console.log("On créer l'event : " + event.startDate);
              Calendar.createEvent(event.title, event.location, event.notes, event.startDate, event.endDate).then(  // On enregsitre l'évenement dans le calendrier
                    (msg) => { console.log("Création OK"); },
                    (err) => { console.log("Creation erreur " +err); }
              );    
          }    
       }   
      this.calendrierEventsUpdate.push(event); // Dans tous les cas:  on enregsitre l'event dans la liste mise à jour
    }//enregsitrerDansCalendrierSmartphone

    // Prépare les éléments nécéssaires pour la gestion du calendrier smartphone
     gererCalendrierSmartphone(){             
        this.calendrierEvents = []; // Instanciation de l'array qui contient les events déja enregsitrés
        this.calendrierEventsUpdate = []; // Instanciation de l'array qui stock les nouveau events
        try{
              let data = JSON.parse(window.localStorage.getItem('calendrierEvents')); // On récupère les events précédement crées depuis la mémoire locale
              console.log(data);
              for(let i = 0; i < data.length; i++){
                  let event = new CalendrierEvent(data[i].title, data[i].location, data[i].notes, new Date(data[i].startDate), new Date(data[i].endDate), data[i].id);
                  if(event.startDate >= this.dateCourrante){ // Si l'event à lieux aujourd'hui ou dans le futur
                      this.calendrierEvents.push(event)//On le prend dans la liste d'events
                  }
              }
        } catch(Exception){}           
        if(window.localStorage.getItem('autoImportNomEvent') != "undefined" && window.localStorage.getItem('autoImportNomEvent') != null){
          this.nomCalendrierEvent = window.localStorage.getItem('autoImportNomEvent');
      }
    }//gererCalendrier

    eventStateInList(event : CalendrierEvent, liste : CalendrierEvent[]) : number{
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

    // Supprime les sauvegardes locales trop anciennes pour ne pas surcharger le téléphone
    supprimerAnciennesSauvegares(){
      let dateMax = new Date();
      dateMax.setMonth(dateMax.getMonth()-6); // On enlève 6 mois
      for(let a = (dateMax.getFullYear()-1); a < (dateMax.getFullYear()); a++){
        for(let m = 1; m <=12; m++){
             window.localStorage.removeItem('getHoraires_'+m+'_'+a);
        }
      }     
    }//supprimerAnciennesSauvegares   

    // Enregsitre la notification locale pour l'horaire passé en paramètre
    enregistrerNotification(horaire : Horaire){
        if(horaire.heureFin > new Date()){ // Si l'horaire est dans le futur (on ne va pas enregistrer des notif pour un horaire passé !)          
          this.notificationsLocalesCtrl.scheduleNotificationFinDeService(horaire.heureFin, horaire.affichageHeureDebut, horaire.affichageHeureFin, horaire.id); // On enregsitre la notification locale
        } else {
          console.log("On enregsitre pas de notification pour cet horaire : " + horaire.heureFin);
        }
    }//enregistrerNotification

    // Enregsitre la notification locale mensuelle pour la date passée en paramètre
    enregistrerNotificationMensuelle(){
        this.notificationsLocalesCtrl.scheduleNotificationValidationMensuelle(); // On enregsitre la notification locale de fin de mois        
    }//enregistrerNotification

    
    detailHoraire(jour : Jour){
      console.log(jour);
      this.horaireDuJour = jour.tbHoraire;  
      console.log(this.horaireDuJour);
      this.pasHeure = this.horaireDuJour.length <= 0; //Contient false si on a pas d'horaire pour ce jour
      this.affichageH = true;
      this.selJour = jour.jour;      
   }//DetailHoraire


    goToMoisPrecedent(){
      console.log("mois d'avant");
      // On regarde quel est le mois précédent (par rapport au moisId)
      let idMois = this.moisSelectionne.moisId - 1;
      // Si on est en janvier, c'est décembre (ID 11), et on change également d'année (décrément)
      if(idMois === -1) { 
        idMois = 11;
        this.anneeSelectionne--;
      };
      // On défini ce mois comme moisSelectionne, et on appelle l'affichage.
      this.moisSelectionne = this.moisListe[idMois];
      this.afficherMois();
    }//goToMoisPrecedent

    goToMoisSuivant(){
      console.log("mois d'après");
      // On regarde quel est le mois suivante (par rapport au moisId)
      let idMois = this.moisSelectionne.moisId +1;
      // Si on est en décembre, c'est janvier (ID 0), et on change également d'année (incrément)
      if(idMois === 12) { 
        idMois = 0;
        this.anneeSelectionne++;
      };
      // On définicele mois comme moisSelectionne, et on appelle l'affichage.
      this.moisSelectionne = this.moisListe[idMois];
      this.afficherMois();
    }//goToMoisSuivant

    changerMois(e){
      console.log("changerMois");
      if (e.direction == 2) { // Vers la gauche
          console.log("gauche");
          this.goToMoisSuivant();          
      } else if (e.direction == 4) { // Vers la droite
        console.log("droite");
        this.goToMoisPrecedent();
      }
    }//changerMois


   isAnneeBissextile(annee){
      return new Date(annee, 2, 0).getDate() == 29
    }//isAnneeBissextile

  
}//MeshorairesPage

