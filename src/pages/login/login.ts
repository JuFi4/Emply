// Modules ionic
import { Component } from '@angular/core';
import { NavController, NavParams , AlertController} from 'ionic-angular';
import { LocalNotifications } from 'ionic-native';

// Pages
import { AccueilPage } from '../accueil/accueil';
/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {      
    //TODO : vérifier si l'utilisateur est connecté, si ce n'est pas le cas, on lui demande de se connecter, puis, une fois la connexion
    // effectuée, on affiche la notification
    LocalNotifications.on("click", (notification, state) => {this.afficherNotificationLocale(notification.id, notification.title, notification.text);});     
  }

   ionViewDidLoad() {
    console.log('Hello Login Page');
  }//ionViewDidLoad

  connexion() {
    this.navCtrl.push(AccueilPage, {utilisateur: "utilisateur"});
    
  }//connexion

  afficherNotificationLocale(idNotification, titreNotification, messageNotification) {
    if(idNotification == 1){
      this.afficherNotificationFinDeService(titreNotification, messageNotification);
    } else  {
      this.afficherValidationMensuelle(titreNotification, messageNotification);
    }    
  }//afficherNotificationLocale  

    afficherNotificationFinDeService(titreNotification, messageNotification){
        let alert = this.alertCtrl.create({
        title: titreNotification,
        message: messageNotification,
        buttons: [
          {
            text: 'Non',
            role: 'cancel',
            handler: () => {
              console.log('Non clicked'); // TODO:  envoyer sur une page pour modifier les heures, qui enregsitrera dans la BDD via API
            }
          },
          {
            text: 'Oui',
            handler: () => {
               console.log('Oui clicked'); // TODO: enregsitrer que c'est OK dans la BDD via API
            }
          }
        ]
      });
      alert.present();
    }//afficherNotificationFinDeService

    afficherValidationMensuelle(titreNotification, messageNotification){
        let alert = this.alertCtrl.create({
        title: titreNotification,
        message: messageNotification,
        buttons: [         
          {
            text: 'OK',
            handler: () => {
               console.log('OK clicked'); // TODO: envoyer sur une page pour vérifier les heures mensuelles, qui aura un bouton valider, qui enregsitrera dans la BDD via API
            }
          }
        ]
      });
      alert.present();
    }//afficherValidationMensuelle

}//LoginPage
