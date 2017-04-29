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

  downloadPdfHoraires(userId:string, token:string){
      const fileTransfer: TransferObject = new Transfer().create();
      let url = this.baseUrl+"type=horaires&userId="+encodeURI(userId)+"&token="+encodeURI(token);
      let dest = cordova.file.externalRootDirectory + 'horaires.pdf';
      //let dest = cordova.file.externalApplicationStorageDirectory  + 'horaires.pdf';
      console.log(url);
      fileTransfer.download(url, dest).then((entry) => {
          console.log('download complete: ' + entry.toURL()); 
          this.afficherMessageOK("Le ficher PDF de vos horaires a bien été téléchargé dans le dossier de stockage de votre téléphone", entry.toURL());        
        }, (error) => {
          console.log(error);
          this.afficherErreur();
        });    
   } //downloadPdfHoraires

   getPdfValMensuelle(userId:string, token:string, annee:string, mois:string){
    this.checkPermission().then(result => this.downloadPdfValMensuelle(userId, token, annee, mois));
  }//getPdfValMensuelle

  downloadPdfValMensuelle(userId:string, token:string, annee:string, mois:string){
    const fileTransfer: TransferObject = new Transfer().create();
    let url = this.baseUrl+"type=valMensuelle&userId="+encodeURI(userId)+"&token="+encodeURI(token)+"&annee="+encodeURI(annee)+"&mois="+encodeURI(mois);
    let dest = cordova.file.externalRootDirectory + 'validationMensuelle_'+mois+'-'+annee+'.pdf';
    console.log(url);
    fileTransfer.download(url, dest).then((entry) => {
        console.log('download complete: ' + entry.toURL()); 
        this.afficherMessageOK("Le ficher PDF de vos heures mensuelles à bien été téléchargé dans le dossier de stockage de votre téléphone", entry.toURL());        
      }, (error) => {
        console.log(error);
        this.afficherErreur();
      });
  }//downloadPdfValMensuelle

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
          console.log("ouvrir " + adresse);
          //cordova.InAppBrowser.open(adresse, '_system', 'location=yes');
          //window.open(adresse, '_system');
          cordova.plugins.disusered.open(adresse, function(){ console.log("Ouverture PDF :  OK")}, 
            function(code){ 
                if (code === 1) {
                    console.log('Ouverture PDF : No file handler found');
                  } else {
                    console.log('Ouverture PDF : Undefined error');
                  }
            });
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
