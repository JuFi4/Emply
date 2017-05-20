//ApiPdfService

import { Injectable } from '@angular/core';
import { ToastController, AlertController } from 'ionic-angular';
import { Transfer, TransferObject } from '@ionic-native/transfer';

declare var cordova: any;

@Injectable()
export class ApiPdfService {

  baseUrl = 'https://ctrl-ccnt.ch/assets/php/api/apiPdfService.php?'; // URL du service web
  constructor(public toastCtrl : ToastController, public alertCtrl: AlertController) { }//constructor

 checkPermission() {
       return new Promise((resolve, reject) => {
          let permissions = cordova.plugins.permissions;
          permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, function(status ){
            if (status.hasPermission) {
                resolve("Permission is now granted");
            } else {
                permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, 
                function(status) { // Si pas d'erreur
                  if (status.hasPermission) { resolve("Permission is now granted");} // Si accès autorisé
                  else {reject('Permission is not turned on')}//Sinon
                } , 
                function(){ reject('Permission is not turned on')})  // Si erreur
            }
          })
       }); 
    }//checkPermission

  getPdfHoraires(userId:string, token:string){
    this.checkPermission().then(result => this.downloadPdfHoraires(userId, token));
  }//getPdfHoraires

   getPdfCalendrier(userId:string, token:string, annee, mois){
    this.checkPermission().then(result => this.downloadPdfCalendrier(userId, token, annee, mois));
  }//getPdfHoraires
  
   getPdfValMensuelle(userId:string, token:string, annee:string, mois:string){
    this.checkPermission().then(result => this.downloadPdfValMensuelle(userId, token, annee, mois));
  }//getPdfValMensuelle

  downloadPdfHoraires(userId:string, token:string){
      const fileTransfer: TransferObject = new Transfer().create();
      let url = this.baseUrl+"type=horaires&userId="+encodeURI(userId)+"&token="+encodeURI(token);
      let dest = cordova.file.externalRootDirectory + 'horaires.pdf';
      console.log(url);
      fileTransfer.download(url, dest).then((entry) => {
          this.afficherMessageOK("Le ficher PDF de vos horaires a bien été téléchargé dans le dossier de stockage de votre téléphone", entry.toURL());        
        }, (error) => {
          this.afficherErreur();
        });    
   } //downloadPdfHoraires

  downloadPdfValMensuelle(userId:string, token:string, annee:string, mois:string){
    const fileTransfer: TransferObject = new Transfer().create();
    let url = this.baseUrl+"type=valMensuelle&userId="+encodeURI(userId)+"&token="+encodeURI(token)+"&annee="+encodeURI(annee)+"&mois="+encodeURI(mois);
    let dest = cordova.file.externalRootDirectory + 'validationMensuelle_'+mois+'-'+annee+'.pdf';
    fileTransfer.download(url, dest).then((entry) => {
        this.afficherMessageOK("Le ficher PDF de vos heures mensuelles à bien été téléchargé dans le dossier de stockage de votre téléphone", entry.toURL());        
      }, (error) => {
        this.afficherErreur();
      });
  }//downloadPdfValMensuelle

   downloadPdfCalendrier(userId:string, token:string, annee:string, mois:string){
    const fileTransfer: TransferObject = new Transfer().create();
    let url = this.baseUrl+"type=calendrier&userId="+encodeURI(userId)+"&token="+encodeURI(token)+"&annee="+encodeURI(annee)+"&mois="+encodeURI(mois);
    let dest = cordova.file.externalRootDirectory + 'calendrier_'+mois+'-'+annee+'.pdf';
    fileTransfer.download(url, dest).then((entry) => {
        this.afficherMessageOK("Le ficher PDF de calendrier mensuel à bien été téléchargé dans le dossier de stockage de votre téléphone", entry.toURL());        
      }, (error) => {
        this.afficherErreur();
      });
  }//downloadPdfCalendrier

  afficherMessageOK(monMessage, adresse){
     let prompt = this.alertCtrl.create({
        title: "Téléchargement terminé",
        message: monMessage,
        buttons: [
      {
        text: 'Fermer',
        role: 'cancel',
        handler: () => {}//Ne fais rien du tout
      },
      {
        text: 'Afficher',
        handler: () => {      
          cordova.plugins.fileOpener2.open( adresse,  'application/pdf', 
                  { 
                    error : function(e) { 
                    },
                    success : function () {		
                    }
                }
            );
        }
      }
    ]

     });
     prompt.present();
  }//afficherMessageOK

  afficherErreur(){
    let prompt = this.alertCtrl.create({
        title: 'Erreur de téléchargement',
        message: "Impossible de télécharger le fichier PDF de vos horaires",
         buttons:["ok"]
     });
     prompt.present();
  }//afficherErreur
}//ApiPdfService
