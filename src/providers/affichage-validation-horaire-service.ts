import { Injectable, Component, ViewChild } from '@angular/core';
import { AlertController, NavController, Platform} from 'ionic-angular';
import { LocalNotifications, Push, Splashscreen, StatusBar } from 'ionic-native';
import 'rxjs/add/operator/map';


// Providers
import { ApiBddService } from '../providers/api-bdd-service';
import { ConnectivityService } from '../providers/connectivity-service';
import { ApiPdfService } from '../providers/api-pdf-service';

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

  constructor( private alertCtrl: AlertController, public platform : Platform, private abiBddCtrl: ApiBddService, public pdfCtrl : ApiPdfService, private connectivityService: ConnectivityService) {
    this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1' || connectivityService.isOffline();
    this.affichageToday =  new Date().getFullYear() + '-' + ('0' + ( new Date().getMonth() + 1)).slice(-2) + '-' + ('0' +  new Date().getDate()).slice(-2)

  }//constructor

afficherNotificationFinDeService(horaireToString){
        let dataHoraire = <Horaire>JSON.parse(horaireToString); // On récupère l'horaire passé en data
        // Et on en fait un joli horaire avec des dates correctement formatées
        let horaire = new Horaire(dataHoraire.id, new Date(dataHoraire.heureDebut), new Date(dataHoraire.heureDebut), new Date(dataHoraire.heureFin));
        console.log(horaire);
        this.afficherAlertFinDeService(horaire);
}//afficherNotificationFinDeService

// JULIANA : c'est cette fonction qui est appellée au lieu de afficherNotificationFinDeService, et passe lui l'horaire en paramètre
afficherAlertFinDeService(horaire : Horaire){
     let alert = this.alertCtrl.create({
        title: "Validation des heures de service",
        message: "Avez-vous bien travailler  le "+ horaire.affichageDate + " de "+ horaire.affichageHeureDebut + " à " + horaire.affichageHeureFin + "? ",
        buttons: [
          {
            text: 'Non',            
            handler: () => {
              console.log('Non clicked');
              this.modificationHoraires(horaire);
            }
          },
          {
            text: 'Oui',
            handler: () => {
               console.log('Oui clicked'); 
               this.validationHoraire(horaire.id, '', '','oui'); // On enregsitre l'absence dans la BDD 
            }
          },
          {
            text: 'Annuler',
            role: 'cancel'           
          }
        ]
      });
      alert.present();
   }//afficherAlertFinDeService
   

   modificationHoraires(horaire){            
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
              horaire.heureFin.getFullYear()+"-"+horaire.heureFin.getMonth()+"-"+horaire.heureFin.getDate()+" "+horaire.heureFin.getHours()+":"+horaire.heureFin.getMinutes(), 'mod'); 
            }
          },
           {
             text: 'Absent',
             handler: () =>{
               console.log("Absent click")   
               this.validationHoraire(horaire.id, '', '','absent');  // On enregsitre l'absence dans la BDD        
            }
          },
          {
            text: 'Maladie / Accident (avec CM)',
             handler: () =>{
               console.log("maladieAccident click")
               this.faireChoixMaladieAccident(horaire);
            } 
          },         
          {
            text: 'Annuler',
            role: 'cancel'           
          }
        ]
      });
      alert.present();
   }//modificationHoraires

   faireChoixMaladieAccident(horaire){
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
        console.log("HEY!!!! Je suis CONFIRMER!!!!");
        console.log("radioResult" + this.radioResult);
        if (data === "maladie"){ 
          this.afficherDateMaladie(horaire);
        }else if(data === 'accident'){
          this.afficherDateAccident(horaire)
        }
        else{
          console.log("RIEN!!!!!");
        }
      }
    });
    alert.present(); 
   }//faireChoixMaladieAccident

afficherDateMaladie(horaire){
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
            role: 'cancel'           
          },
          {
            text: 'Valider',
            handler: data => {
               console.log('Oui clicked');
               if(data.dateDebut >= data.dateFin){
                    this.afficherAlertPasValide();
               }else{
                  if(!this.isHorsLigne){//Si on est pas hors ligne -> OK
                      this.validationHoraire(horaire.id, '', '','maladie');
                      this.abiBddCtrl.setMaladieAccident(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), data.dateDebut, data.dateFin, "0", horaire.id).subscribe(
                            data => {
                              if(data) { // OK     
                                console.log("OK");
                              } else { // Erreur
                                console.log("Pas ok");
                        }
                      });
                  } else {
                    this.afficherMessageHorsLigne();
                  }
               }
            }
          }           
        ]
      });
      alert.present();
}//afficherDateMaladie

afficherAlertPasValide(){
  let alert = this.alertCtrl.create({
      title: "Dates non valide",
      message: "Vos dates ne sont pas valides ! Veuillez mettre une date de debut antérieur à la date de fin",
        buttons: ['OK']
      });
      alert.present();
}//afficherAlertPasValide

afficherDateAccident(horaire){
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
            role: 'cancel'           
          },{
            text: 'Valider',
            handler: data => {
               console.log('Oui clicked');
               console.log(data.dateDebut +" "+ data.dateFin);
               if(data.dateDebut >= data.dateFin){
                 console.log(data.dateDebut +" "+ data.dateFin);
                    this.afficherAlertPasValide();
               }else{
                    if(!this.isHorsLigne){//Si on est pas hors ligne -> OK
                        this.validationHoraire(horaire.id, '', '','accident');
                        this.abiBddCtrl.setMaladieAccident(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), data.dateDebut, data.dateFin, "1", horaire.id).subscribe(
                            data => {
                              if(data) { // OK     
                                console.log("OK");
                              } else { // Erreur
                                console.log("Pas ok");
                        }
                      });
                  }else {
                    this.afficherMessageHorsLigne();
                  }
               }
            }
          }          
        ]
      });
      alert.present();
}//afficherDateAccident


validationHoraire(hopId, hDebut, hFin, traValid){ 
   if(!this.isHorsLigne){//Si on est pas hors ligne -> OK 
      this.abiBddCtrl.setModHoraire(window.localStorage.getItem('id'),window.localStorage.getItem('tokenBDD'),hopId, hDebut, hFin, traValid).subscribe(        
        data => {
            if(data) {  // OK         
                console.log("Enregistrer");
              } else { // Erreur
                  console.log("Connexion échouée : mauvais mot de passe, token ou ID");
              }
          });
    }else {
        this.afficherMessageHorsLigne();
    }
  }//modificationHoraire

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
      alert.present();
    }//afficherValidationMensuelle

    afficherAlertAttenteValidation(titreNotification, messageNotification) {
        let alert = this.alertCtrl.create({
        title: titreNotification,
        message: messageNotification,
        buttons: [         
          {
            text: 'Valider mes horaires en attente',
            handler: () => {
              //this.navCtrl.push(ValidationPage);
            }
          }
        ]
      });
      alert.present();
    }

  afficherMessageHorsLigne(){
        let alert = this.alertCtrl.create({
          title: 'Mode hors ligne',
          message: "Vous êtes actuellement en mode hors ligne : l'enregsitrement de données est désactivé.",
              buttons: ['OK']
          });
      alert.present();
    }//afficherMessageHorsLigne
    
}//AffichageValidationHoraireService
