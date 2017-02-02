// Modules ionic
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams , AlertController, Nav, Platform, LoadingController} from 'ionic-angular';
import { LocalNotifications, Push, Splashscreen, StatusBar } from 'ionic-native';


// Pages
import { AccueilPage } from '../accueil/accueil';
import {MeshorairesPage} from "../meshoraires/meshoraires";

// Providers
import { ApiBddService } from '../../providers/api-bdd-service';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
   @ViewChild(Nav) nav: Nav;
   utilisateur = "";
   motDePasse = "";
   token = "12345678";
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public platform : Platform, private abiBddCtrl: ApiBddService, private loadingCtrl: LoadingController) {      
    if((window.localStorage.getItem('utilisateur') === "undefined" || window.localStorage.getItem('utilisateur') === null) && 
       (window.localStorage.getItem('motDePasse') === "undefined" || window.localStorage.getItem('motDePasse') === null)) {
      console.log('Pas de données sauvegardées.');
      this.navCtrl.setRoot(LoginPage);
      this.navCtrl.popToRoot();
    } else {
      this.navCtrl.push(AccueilPage, {utilisateur: this.utilisateur});
      console.log(window.localStorage.getItem('utilisateur'));
      console.log(window.localStorage.getItem('motDePasse'));
    }
    
    //TODO : vérifier si l'utilisateur est connecté, si ce n'est pas le cas, on lui demande de se connecter, puis, une fois la connexion
    // effectuée, on affiche la notification
    LocalNotifications.on("click", (notification, state) => {this.afficherNotificationLocale(notification.id, notification.title, notification.text);});    
  }

   ionViewDidLoad() {
    console.log('Hello Login Page');
  }//ionViewDidLoad

demanderNouveauMotDePasse() {
    console.log('Bah bravo!');
    let alert = this.alertCtrl.create({
    title: 'Bah bravo!',
    subTitle: 'Tu as une mémoire de moineau...',
    buttons: ['Désolé']
    });
    alert.present();
  }//demanderNouveauMotDePasse

  nouveauMotDePasse(){
        /* TODO JULIANA : intégration de l'api nouveau mot de passe :
      -1) Remplacer les données de test dans l'api par la variable dans laquelle tu aura demandé le mail de l'utilisateur
      -2) Traiter le résultat de l'API : 
          - ai OK  (le " if(data)" dans le code) => message pour dire que le nouveau mdp a été envoyé par email
          - sinon (le "else" dans le code) = l'email indiqué n'existe pas dans le BDD -> afficher un message d'erreur, ou ce que tu veux     
    */
    let alert = this.alertCtrl.create({
    title: 'Demande de nouveau mot de passe',
    inputs: [
      {
        name: 'mail',
        placeholder: 'mail'
      }
    ],
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Envoyer',
        handler: data => {
          this.abiBddCtrl.setNewPassword(data.mail).subscribe(
                data2 => {        
                    if(data2) { // OK    
                      console.log('Mail existant');
                    } else { // Erreur
                      console.log("Mail inexistant");
                      let alert2 = this.alertCtrl.create({
                      title: 'Désolé',
                      subTitle: 'Le mail saisi ne correspond à aucun utilisateur',
                      buttons: ['Retour']
                      });
                      alert2.present();
                    }
                }
            );
          
        }
      }
    ]
  });
  alert.present();
    // Format de la fonction: setNewPassword(email : string)
          

  }//nouveauMotDePasse

  connecter() {
      /* TODO JULIANA : traiter les données pour la connexion :
      -1) Remplacer les données de test dans l'api de connexion par les varaibles isssues du formulaire
      -2) Traiter le résultat de l'API : 
          - si connexion OK (le " if(data)" dans le code), sauver les données + charger la page suivante
          - sinon (le "else" dans le code) afficher un message d'erreur, ou ce que tu veux

        Note : j'ai mis le code en commentaire juste pour pas que ça me change mon token à chaque fois !!!
        Tu peux enlever les commentaire et mettre les données de ton user  
    */
    // Format de la fonction: connexion(login : string, password: string, deviceToken: string)
    this.abiBddCtrl.connexion(this.utilisateur, this.motDePasse, this.token).subscribe(
                data => {        
                    if(data) {  // OK      
                      console.log("ID : " + data.id);
                      console.log("Token : " + data.token);
                      window.localStorage.setItem('id', data.id);
                      window.localStorage.setItem('tokenBDD', data.token);
                      window.localStorage.setItem('utilisateur', this.utilisateur);
                      window.localStorage.setItem('motDePasse', this.motDePasse);
                      this.navCtrl.push(AccueilPage, {utilisateur: this.utilisateur});
                    } else { // Erreur
                      console.log("Connexion échouée : mauvais mail ou mdp");
                      let alert = this.alertCtrl.create({
                      title: 'Erreur',
                      subTitle: 'Utilisateur et/ou mot de passe incorrect(s).',
                      buttons: ['Retour']
                      });
                      alert.present();
                    }
                }
            );  


    // TODO VANESSA: Ranger ce code dans une fonction séparée, il ne doit pas être ici !!! 
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
        // TODO VANESSA / JULIANA : Enregsitrer le deviceToken afin de l'envoyer à l'API Lors du login : Id est dans data.registrationId
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
  }//connecter


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
