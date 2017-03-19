
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
  horaires : Horaire[]; // Tableau qui contient les horaires de la periode affichée
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
  calendrierNewEvents : CalendrierEvent[]
  calendrierUpadateEvents : CalendrierEvent[]
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
    }//constructor

    ionViewDidLoad() {
      console.log('Hello MesHoraires Page');      
    }//ionViewDidLoad

    ionViewDidLeave(){
        console.log("T'en vas pas, si tu m'aimes t'en vas pas...");        
    }//ionViewDidLeave

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
                window.localStorage.setItem('autoImportNomEvent', data.nomEvent);//On enregsitre
                 this.getHoraires(this.anneeSelectionne, this.moisSelectionne.moisId+1);//On relance le chargement des horaires pour qu'ils se synchronisent
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
     console.log(this.calendrierEvents);     
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
     this.getHoraires(this.anneeSelectionne, this.moisSelectionne.moisId+1);
    }//afficherMois
     
    //Récupère la liste des horaires pour l'année et le mois passés en paramètre
    getHoraires(annee, mois){
      if(!this.isHorsLigne){ // Si on a internet
        this.abiBddCtrl.getHoraires(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), annee, mois).subscribe(
          data => {  
            if(data) { // Si les données sont bien chargées 
                window.localStorage.setItem('getHoraires_'+mois+'_'+annee, JSON.stringify(data));  // Création de la sauvegarde locale de ces horaires (mois et annee)                
                this.traiterHoraires(data, annee, mois); // Traitement des horaires
                this.enregistrerNotificationMensuelle(); // On a internet et on a des horaires chargés, on peut donc programmer une notification locale pour la validation mensuelle              
              } else { // Erreur
                  console.log("Aucun horaire pour cette periode");
              }
          }); 
      } else { // Mode hors ligne
          // Traitement des horaires à partir des données sauvegardés
          this.traiterHoraires(JSON.parse(window.localStorage.getItem('getHoraires_'+mois+'_'+annee)), annee, mois);      
      }
    }//getHoraires

    traiterHoraires(data, mois, annee){    
      let verifierCalendrierEvents = false  
      for(let i = 0; i < data.length; i++){ //Remplissage du tableau horaires avec les données des horaires formatées
        let horaire =  new Horaire(data[i].id, 
          new Date(data[i].annee, data[i].mois-1, data[i].jour),
          new Date(data[i].annee, data[i].mois-1, data[i].jour, data[i].heureDebut, data[i].minuteDebut),
          new Date(data[i].annee, data[i].mois-1, data[i].jour, data[i].heureFin, data[i].minuteFin)
        );                    
        this.jours[data[i].jour-1].addHoraire(horaire);  // On ajoute l'horaire au jour auquel il y lieu

        // Si on a internet on enregsitre les notif locales pour l'horaire et on enregsitre l'horaire dans le calendrier du smartphone si besoin
        // -> inutile si on a pas internet car la notification et l'event dans le calendrier pour cet horaire auront forcément déja été crées
        if(!this.isHorsLigne){
          this.enregistrerNotification(horaire);
          if(this.autoImport && horaire.heureDebut >= this.dateCourrante){ //Si l'auto-import est activé et que l'évenement est dans le futur                
               this.enregsitrerDansCalendrierSmartphone(horaire); // On enregsitrer dans le calendrier du smartphone
               verifierCalendrierEvents = true;
          }
        } 
      }      
      if(verifierCalendrierEvents){ // Si on est dans un cas où le calendrier à pu être modifié
          this.gererSauvegardeCalendrierEvents(); // Vérifie si certains anciens events ont disparus et sauve la liste actuallisée 
      }
    }//traiterHoraires

    gererSauvegardeCalendrierEvents(){
      for(let i = 0; i < this.calendrierEvents.length; i++){ //On boucle sur les anciens events
         if(this.calendrierEventStateInList(this.calendrierEvents[i], this.calendrierUpadateEvents) == -2){  // Si l'ancien even n'est pas dans la liste mise à jour
          console.log("On supprime : " + this.calendrierEvents[i].id + " : " + this.calendrierEvents[i].startDate);  
           Calendar.deleteEvent( // On supprime l'event du calendrier
              this.calendrierEvents[i].title,
              this.calendrierEvents[i].location,
              this.calendrierEvents[i].notes,
              this.calendrierEvents[i].startDate,
              this.calendrierEvents[i].endDate);
              this.calendrierEvents.splice(i); //On supprime l'event de la liste
         }
      }
      for(let i = 0; i < this.calendrierNewEvents.length; i++){ this.calendrierEvents.push(this.calendrierNewEvents[i]);} // On ajoute les nouveaux events à la liste 
      this.calendrierNewEvents = []; // On vide la liste des new events
      console.log("gererSauvegardeCalendrierEvents - this.calendrierEvents");     
      console.log(this.calendrierEvents);   
      window.localStorage.setItem('calendrierEvents', JSON.stringify(this.calendrierEvents));// On enregsitre la liste en local storage  
    }//gererSauvegardeCalendrierEvents

    enregsitrerDansCalendrierSmartphone(horaire: Horaire){
       let event = new CalendrierEvent(this.nomCalendrierEvent, 
          (this.etablissement.nom+", "+this.etablissement.adresse + (this.etablissement.adresseInfo != null ? ", "+this.etablissement.adresseInfo : "") 
          + ", " + this.etablissement.codePostal+", "+this.etablissement.localite),
           "Téléphone direction: "+this.etablissement.telDirection + "\nEmail: "+this.etablissement.email,
           horaire.heureDebut, 
           horaire.heureFin, 
           horaire.id
       );       
       let state = this.calendrierEventStateInList(event, this.calendrierEvents); // On regarde l'état de cet event dans l'ancienne liste
       console.log("event : " + event.startDate +" --- Sate : " + state);
       if(state === -1){
          //L'event existe et il est similaire : on se barre
        } else if(state === -2){// L'event n'existe pas : on le créer
          console.log("On créer l'event : " + event.startDate);
          Calendar.createEvent(event.title, event.location, event.notes, event.startDate, event.endDate).then(
                (msg) => { }, // On enregsitre l'évenement dans le calendrier
                (err) => { }
          );        
          this.calendrierNewEvents.push(event); // On enregsitre l'event dans la liste des nouveaux
       }  else if(state >= 0){ // L'event existe, mais à des dates différentes, dans ce cas, state correspond à son index (cas le moins probable, donc testé en dernier)
        Calendar.modifyEvent( // On modifie l'event du calendrier
          this.calendrierEvents[state].title,
          this.calendrierEvents[state].location,
          this.calendrierEvents[state].notes,
          this.calendrierEvents[state].startDate,
          this.calendrierEvents[state].endDate,
          event.title,
          event.title,
          event.notes,
          event.startDate,
          event.endDate);
       }   
      this.calendrierUpadateEvents.push(event); // Dans tous les cas:  enregsitre l'event dans la liste mise à jour
    }//enregsitrerDansCalendrierSmartphone

    // Prépare les éléments nécéssaires pour la gestion du calendrier smartphone
     gererCalendrierSmartphone(){     
        this.calendrierEvents = []; // Instanciation de l'array qui contient les events déja enregsitrés
        this.calendrierNewEvents = []; // Instanciation de l'array qui stock les nouveau events
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
         this.getEtablissement();//Récupère les données de l'établissement de l'utilisateur pour pouvoir l'indiquer dans le calendrier     
    }//gererCalendrier

    calendrierEventStateInList(event : CalendrierEvent, liste : CalendrierEvent[]){
      for(let i = 0; i < liste.length; i++){
          if(liste[i].id === event.id){
              if(liste[i].startDate.getTime() === event.startDate.getTime() 
                  && liste[i].endDate.getTime() === event.endDate.getTime()){
                return -1; // L'event existe, avec les mêmes dates
              } else {
                return i; // L'event existe, à des dates différents : on retourne son index
              }
          }
      }
      return -2; // L'event n'existe pas
    }//CalendrierEventStateInList

    // Récupère les infomations de l'établissement dans lequel travail la personne
    getEtablissement(){
      if(!this.isHorsLigne){ // Mode normal : vérification de la connexion en ligne
          this.abiBddCtrl.getEtablissement(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD')).subscribe(
            etablissement => {
              if(etablissement) { // OK                     
                  this.etablissement = <Etablissement>etablissement[0];  
                  window.localStorage.setItem('getEtablissement', JSON.stringify(this.etablissement));  // Création de la sauvegarde locale
                } else { console.log("Erreur");} // On ne fait rien
            }); 
      } else { // Mode hors ligne
          this.etablissement = JSON.parse(window.localStorage.getItem('getEtablissement'));
      }
      
    }//getEtablissement

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

