import { Injectable } from '@angular/core';
import { ToastController, AlertController } from 'ionic-angular';
import { Transfer, TransferObject } from '@ionic-native/transfer';


/*
  Generated class for the ApiPdfService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
declare var cordova: any;

@Injectable()
export class ApiPdfService {
  

  baseUrl = 'https://ctrl-ccnt.ch/assets/php/api/apiPdfService.php?'; // URL du service web
  constructor(public toastCtrl : ToastController, public alertCtrl: AlertController) { 
  }//constructor


  getPdfHoraires(userId:string, token:string){
    const fileTransfer: TransferObject = new Transfer().create();
    let url = this.baseUrl+"type=horaires&userId="+encodeURI(userId)+"&token="+encodeURI(token);
    let dest = cordova.file.externalRootDirectory + 'horaires.pdf';
    console.log(url);
    fileTransfer.download(url, cordova.file.externalRootDirectory + 'horaires.pdf').then((entry) => {
        console.log('download complete: ' + entry.toURL()); 
        this.afficherMessageOK("Le ficher PDF de vos horaires à bien été téléchargé dans le dossier de stockage de votre téléphone", entry.toURL());        
      }, (error) => {
        console.log(error);
        this.afficherErreur();
      });
  }//getPdfHoraires

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
        text: 'Afficher maintenant',
        handler: () => {
          console.log("ouvrir " + adresse);
          cordova.InAppBrowser.open(encodeURI(adresse), '_blank', 'location=yes');
        }
      }
    ]

     });
     prompt.present();
  }//afficherToast

  afficherErreur(){
    let prompt = this.alertCtrl.create({
        title: 'Erreur de téléchargement',
        message: "Impossible de télécharger le fichier PDF de vos horaires",
         buttons:["ok"]
     });
     prompt.present();
  }
}//ApiPdfService
