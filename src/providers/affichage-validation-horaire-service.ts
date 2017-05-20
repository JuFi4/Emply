//AffichageValidationHoraireService

import { Injectable, Component, ViewChild } from '@angular/core';
import { AlertController, NavController, Platform} from 'ionic-angular';
import { LocalNotifications, Push, Splashscreen, StatusBar } from 'ionic-native';
import 'rxjs/add/operator/map';


// Providers
import { ApiBddService } from '../providers/api-bdd-service';
import { ConnectivityService } from '../providers/connectivity-service';
import { ApiPdfService } from '../providers/api-pdf-service';
import { AlertsToasts } from '../providers/alerts-toasts';

//Models
import {Horaire} from '../models/horaire';

//pagesimport 
import {ValidationPage} from '../pages/validation/validation';

@Injectable()
export class AffichageValidationHoraireService {  
   radioOpen: boolean;
   radioResult;  
   isHorsLigne = false;
   affichageToday : string;

  constructor( private alertCtrl: AlertController, public platform : Platform, private abiBddCtrl: ApiBddService, 
               public pdfCtrl : ApiPdfService, private connectivityService: ConnectivityService, private AlertsToasts: AlertsToasts) {
    this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1' || connectivityService.isOffline();
    this.affichageToday =  new Date().getFullYear() + '-' + ('0' + ( new Date().getMonth() + 1)).slice(-2) + '-' + ('0' +  new Date().getDate()).slice(-2)

  }//constructor

afficherNotificationFinDeService(horaireToString){   
    let dataHoraire = <Horaire>JSON.parse(horaireToString); // On récupère l'horaire passé en data
    // Et on en fait un joli horaire avec des dates correctement formatées
    let horaire = new Horaire(dataHoraire.id, new Date(dataHoraire.heureDebut), new Date(dataHoraire.heureDebut), new Date(dataHoraire.heureFin));
    this.afficherAlertFinDeService(horaire);       
}//afficherNotificationFinDeService

afficherAlertFinDeService(horaire : Horaire){
  return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create({
          title: "Validation des heures de service",
          message: "Avez-vous bien travaillé  le "+ horaire.affichageDate + " de "+ horaire.affichageHeureDebut + " à " + horaire.affichageHeureFin + "? ",
          buttons: [
            {
              text: 'Non',            
              handler: () => {
                this.modificationHoraires(horaire).then(result => resolve("fini"));   
              }
            },
            {
              text: 'Oui',
              handler: () => {
                this.validationHoraire(horaire.id, '', '','oui').then(result => resolve("fini"));    // On enregsitre l'absence dans la BDD 
              }
            },
            {
              text: 'Annuler',
              role: 'cancel',
              handler: () => {resolve("Fini");}           
            }
          ]
        });
        alert.present();       
      });
   }//afficherAlertFinDeService
   
   modificationHoraires(horaire){  
      return new Promise((resolve, reject) => {         
          let alert = this.alertCtrl.create({
          title: "Modification des heures de services",
          message: "Veuillez entrer les horaires réellement effectués",
          inputs: [
          {
            id: 'heureDebut',
            type: 'time',
            name: 'heureDebut',
            value: horaire.affichageHeureDebut,
            placeholder: 'Heure de début de service'
          },
          {
            id: 'heureFin',
            type: 'time',
            name: 'heureFin',
            value: horaire.affichageHeureFin,
            placeholder: 'Heure de fin de service'
          }       
        ],
          buttons: [
            {
              text: 'Valdier les modifications',
              handler: data => {               
                if(data.heureFin < data.heureDebut){ // Si l'heure de fin est plus petite que l'heure de début = on a travaillé
                  horaire.heureFin.setDate(horaire.heureFin.getDate() + 1); // On ajoute un jour à la date de fin
                }
                horaire.heureDebut.setHours(data.heureDebut.split(":")[0]);   // On fixe les heures de débuts entrés à la date de début
                horaire.heureDebut.setMinutes(data.heureDebut.split(":")[1]);  // On fixe les minutes de débuts entrés à la date de début
                horaire.heureFin.setHours(data.heureFin.split(":")[0]);  // On fixe les heures de fins entrés à la date de fin
                horaire.heureFin.setMinutes(data.heureFin.split(":")[1]);  // On fixe les minutes de fins entrés à la date de fin

                // On appelle la fonction d'enregistrement en formatant les dates pour qu'elles passent
                this.validationHoraire(horaire.id, 
                horaire.heureDebut.getFullYear()+"-"+horaire.heureDebut.getMonth()+"-"+horaire.heureDebut.getDate()+" "+horaire.heureDebut.getHours()+":"+horaire.heureDebut.getMinutes(), 
                horaire.heureFin.getFullYear()+"-"+horaire.heureFin.getMonth()+"-"+horaire.heureFin.getDate()+" "+horaire.heureFin.getHours()+":"+horaire.heureFin.getMinutes(), 'mod').then(result => resolve("fini")); 
              }
            },
            {
              text: 'Absent',
              handler: () =>{
                this.validationHoraire(horaire.id, '', '','absent').then(result => resolve("fini")); // On enregsitre l'absence dans la BDD 
                ;  
              }
            },
            {
              text: 'Maladie / Accident (avec CM)',
              handler: () =>{
                this.faireChoixMaladieAccident(horaire).then(result => resolve("fini"));    
              } 
            },         
            {
              text: 'Annuler',
              role: 'cancel',
              handler: () => {  resolve("Fini"); }           
            }
          ]
        });
        alert.present();
      });
   }//modificationHoraires

   faireChoixMaladieAccident(horaire){
      return new Promise((resolve, reject) => {         
          let alert = this.alertCtrl.create();
          alert.setTitle('Maladie ou accident');
          alert.addInput({
            type: 'radio',
            label: 'Maladie',
            id : '1',
            value: 'maladie',
            name:'maladie',
            checked: true
          });
          alert.addInput({
            type: 'radio',
            label: 'Accident',
            id : '2',
            value: 'accident',
            name:'accident',
            checked: false
          });
          alert.addButton({
            text: 'Confirmer',
            handler: data => {
              this.radioOpen = false;
              this.radioResult = data;        
              if (data === "maladie"){ 
                this.afficherDateMaladie(horaire).then(result => resolve("fini"));    
              }else if(data === 'accident'){
                this.afficherDateAccident(horaire).then(result => resolve("fini"));    
              }
              else{
                resolve("fini");
              }
            }
          });
          alert.present(); 
       });
   }//faireChoixMaladieAccident

afficherDateMaladie(horaire){
  return new Promise((resolve, reject) => {     
    let alert = this.alertCtrl.create({
        title: "Entrer absence maladie",
        message: "Veuillez indiquer les dates de début et de fin votre certificat médical",
          inputs: [
          {
            id: 'dateDebut',
            type: 'date',
            name: 'dateDebut',
            value: this.affichageToday,
            placeholder: 'Date de début'
          },
          {
            id: 'dateFin',
            type: 'date',
            name: 'dateFin',
            value: this.affichageToday,
            placeholder: 'Date de fin'
          },
        ],
          buttons: [
            {
              text: 'Annuler',
              role: 'cancel' ,
              handler: () => {  resolve("Fini"); }          
            },
            {
              text: 'Valider',
              handler: data => {
                if(data.dateDebut <= data.dateFin){ //Si la date de début est plus petite ou égale à la date de fin => OK  
                        if(!this.isHorsLigne){//Si on est pas hors ligne => OK
                            this.validationHoraire(horaire.id, '', '','maladie')
                            .then(result => this.enregsitrementMaladieAccident(data.dateDebut,  data.dateFin, 0, horaire.id))
                            .then(result => resolve("Fini"));
                        } else {
                            this.afficherMessageHorsLigne().then(result => resolve("fini"));                          
                        }
                }else{
                    this.AlertsToasts.afficherAlertPasValide();
                     resolve("fini")
                }
              }
            }           
          ]
        });
        alert.present();
       });
}//afficherDateMaladie

afficherDateAccident(horaire){
   return new Promise((resolve, reject) => {     
    let alert = this.alertCtrl.create({
        title: "Entrer absence accident",
        message: "Veuillez indiquer les dates de début et de fin votre certificat médical",
          inputs: [
          {
            id: 'dateDebut',
            type: 'date',
            name: 'dateDebut',
            value: this.affichageToday,
            placeholder: 'Date de début'
          },
          {
            id: 'dateFin',
            type: 'date',
            name: 'dateFin',
            value: this.affichageToday,
            placeholder: 'Date de fin'
          },
        ],
          buttons: [
            {
              text: 'Annuler',
              role: 'cancel',
              handler: () => {  resolve("Fini"); }           
            },{
              text: 'Valider',
              handler: data => {
                if(data.dateDebut >= data.dateFin){
                  this.AlertsToasts.afficherAlertPasValide();
                  resolve("Fini")
                }else{
                      if(!this.isHorsLigne){//Si on est pas hors ligne -> OK
                          this.validationHoraire(horaire.id, '', '','accident')
                          .then(result => this.enregsitrementMaladieAccident(data.dateDebut,  data.dateFin, 1, horaire.id))
                          .then(result => resolve("fini"));
                    } else {
                      this.afficherMessageHorsLigne().then(result =>  resolve("Fini"));
                    }
                }
              }
            }          
          ]
        });
        alert.present();
     });
}//afficherDateAccident

enregsitrementMaladieAccident(dateDebut, dateFin,isAccident, id){
  return new Promise((resolve, reject) => { 
      if(!this.isHorsLigne){//Si on est pas hors ligne -> OK     
          this.abiBddCtrl.setMaladieAccident(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), dateDebut, dateFin, isAccident, id).subscribe(
                data => {
                  if(data) { // OK     
                      resolve("Fini");
                  } else { // Erreur
                      resolve("Fini");
                }
            });
      } else {
          this.afficherMessageHorsLigne();
          resolve("Fini");          
      }
    });
}//enregsitrementMaladieAccident

validationHoraire(hopId, hDebut, hFin, traValid){ 
   return new Promise((resolve, reject) => {     
        if(!this.isHorsLigne){//Si on est pas hors ligne -> OK 
            this.abiBddCtrl.setModHoraire(window.localStorage.getItem('id'),window.localStorage.getItem('tokenBDD'),hopId, hDebut, hFin, traValid).subscribe(        
              data => {
                  if(data) {  // OK         
                      this.AlertsToasts.faireToastModificationEnregistree();
                    } else { // Erreur
                        this.AlertsToasts.faireAlertConnexionEchouee();
                    }
                    resolve("Fini");
                });
          }else {
              this.afficherMessageHorsLigne();
              resolve("Fini");
          }
      });
  }//validationHoraire

   afficherValidationMensuelle(titreNotification, messageNotification, date){
      let splitDate = date.split("-");
      let annee = splitDate[0]
      let mois = splitDate[1];
      let alert = this.alertCtrl.create({
      title: titreNotification,
      message: messageNotification,
           buttons: [         
           {
             text: 'Télécharger ma feuille',
             handler: () => {
              if(!this.isHorsLigne){//Si on est pas hors ligne -> OK
                this.abiBddCtrl.setValMensuelle(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), annee, mois).subscribe();
                this.pdfCtrl.getPdfValMensuelle(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), annee, mois);
              }else {
                    this.afficherMessageHorsLigne();
              }
            }
          }
        ]
      });
   }//afficherValidationMensuelle

    afficherAlertAttenteValidation(titreNotification, messageNotification) {
        let alert = this.alertCtrl.create({
        title: titreNotification,
        message: messageNotification,
        buttons: [         
           {
             text: 'Valider mes horaires en attente',
             handler: () => {
            }
          }
        ]
      });
      alert.present();
    }//afficherAlertAttenteValidation

  afficherMessageHorsLigne(){    
     return new Promise((resolve, reject) => {     
            let alert = this.alertCtrl.create({
              title: 'Mode hors ligne',
              message: "Vous êtes actuellement en mode hors ligne : l'enregsitrement de données est désactivé.",
               buttons: [         
                  {
                    text: 'OK',
                    handler: () => {  resolve("Fini"); }
                  }
                ]
            });
          alert.present();
      });
    }//afficherMessageHorsLigne
    
}//AffichageValidationHoraireService
