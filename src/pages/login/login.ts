// Modules ionic
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams , AlertController, Nav, Platform} from 'ionic-angular';
import { LocalNotifications, Push, Splashscreen, StatusBar } from 'ionic-native';

// Pages
import { AccueilPage } from '../accueil/accueil';
import {MeshorairesPage} from "../meshoraires/meshoraires";
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
   @ViewChild(Nav) nav: Nav;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public platform : Platform) {      
    //TODO : vérifier si l'utilisateur est connecté, si ce n'est pas le cas, on lui demande de se connecter, puis, une fois la connexion
    // effectuée, on affiche la notification
    LocalNotifications.on("click", (notification, state) => {this.afficherNotificationLocale(notification.id, notification.title, notification.text);});     
  }

   ionViewDidLoad() {
    console.log('Hello Login Page');
  }//ionViewDidLoad

  connexion() {
    this.navCtrl.push(AccueilPage, {utilisateur: "utilisateur"});


    //Push et récupération du divice-token
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      let push = Push.init({
        android: {
          senderID: "913174956690"
        },
        ios: {
          alert: "true",
          badge: false,
          sound: "true"
        },
        windows: {}
      });

      push.on('registration', (data) => {
        console.log("device token ->", data.registrationId);
        //TODO - send device token to server
      });
      push.on('notification', (data) => {
        console.log('message', data.message);
        let self = this;
        //if user using app and push notification comes
        if (data.additionalData.foreground) {
          // if application open, show popup
          let confirmAlert = this.alertCtrl.create({
            title: 'New Notification',
            message: data.message,
            buttons: [{
              text: 'Ignore',
              role: 'cancel'
            }, {
              text: 'View',
              handler: () => {
                //TODO: Your logic here
                self.nav.push(MeshorairesPage, {message: data.message});
                alert(data.message)
              }
            }]
          });
          confirmAlert.present();
        } else {
          //if user NOT using app and push notification comes
          //TODO: Your logic on click of push notification directly
          self.nav.push(MeshorairesPage, {message: data.message});
          alert(data.message)
          console.log("Push notification clicked");
        }
      });
      push.on('error', (e) => {
        console.log(e.message);
      });
    }); 
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
