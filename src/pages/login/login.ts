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
   deviceToken : string;
   resteConnecte = false;
   rootPage : any; // Permet de définir une autre page d'accueil (pour les notifications)
   isNotificationEnAttente = false;
   notificationEnAttente =  {id: '', titre: '', message:'' };  

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public platform : Platform, private abiBddCtrl: ApiBddService, private loadingCtrl: LoadingController) {      
     // Définition de la d'accueil par défaut
     this.rootPage = AccueilPage; 
    
    // Instanciation des notifications push
     this.instancierNotificationsPush();    

      // Instanciation des notifications locales
     this.instancierNotificationsLocales();  
    
    if((window.localStorage.getItem('utilisateur') === "undefined" || window.localStorage.getItem('utilisateur') === null) && 
       (window.localStorage.getItem('motDePasse') === "undefined" || window.localStorage.getItem('motDePasse') === null)) {
      console.log('Pas de données sauvegardées.');
      this.navCtrl.setRoot(LoginPage);
      this.navCtrl.popToRoot();
    } else { // Connexion automatique
      this.navCtrl.push(AccueilPage, {utilisateur: this.utilisateur});
      console.log(window.localStorage.getItem('utilisateur'));
      console.log(window.localStorage.getItem('motDePasse'));
      console.log(window.localStorage.getItem('deviceToken'));
      this.abiBddCtrl.connexion(window.localStorage.getItem('utilisateur'), window.localStorage.getItem('motDePasse'), window.localStorage.getItem('deviceToken')).subscribe();
    } 
  }//constructor

   ionViewDidLoad() {
    console.log('Hello Login Page');
  }//ionViewDidLoad

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
                      this.confirmerDemandeNouveauMotDePasse();
                    } else { // Erreur
                      console.log("Mail inexistant");
                      this.alerterMailInexistant();
                    }
                }
            ); 
        }
      }
    ]
  });
  alert.present();
 }//nouveauMotDePasse

confirmerDemandeNouveauMotDePasse(){
      let alert = this.alertCtrl.create({
      title: 'Demande exécutée',
      subTitle: 'Votre nouveau mot de passe a été envoyé sur votre boîte mail.',
      buttons: ['Retour']
    });
    alert.present();
  }//confirmerDemandeNouveauMotDePasse

 alerterMailInexistant(){
      let alert = this.alertCtrl.create({
      title: 'Le mail saisi ne correspond à aucun utilisateur',
      buttons: ['Retour']
    });
    alert.present();
  }//alerterMailInexistant

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
    this.abiBddCtrl.connexion(this.utilisateur, this.motDePasse, this.deviceToken).subscribe(
                data => {        
                    if(data) {  // OK      
                      console.log("ID : " + data.id);
                      console.log("Token : " + data.token);
                      if (this.resteConnecte) {
                        console.log("Checkbox cochée");
                        window.localStorage.setItem('id', data.id);
                        window.localStorage.setItem('tokenBDD', data.token);
                        window.localStorage.setItem('utilisateur', this.utilisateur);
                        window.localStorage.setItem('motDePasse', this.motDePasse);
                        window.localStorage.setItem('deviceToken', this.deviceToken);
                        window.localStorage.setItem('utilisateurConnecte', "1");
                        console.log("login " + window.localStorage.getItem('utilisateurConnecte'))
                        if(this.isNotificationEnAttente) {
                          this.afficherNotificationLocale(this.notificationEnAttente.id, this.notificationEnAttente.titre, this.notificationEnAttente.message);
                        }
                      } else {
                        console.log("Checkbox pas cochée");
                        window.sessionStorage.setItem('id', data.id);
                        window.sessionStorage.setItem('tokenBDD', data.token);
                        window.sessionStorage.setItem('utilisateur', this.utilisateur);
                        window.sessionStorage.setItem('motDePasse', this.motDePasse);
                        window.sessionStorage.setItem('deviceToken', this.deviceToken);
                      }
                      
                      
                      this.navCtrl.push(this.rootPage, {utilisateur: this.utilisateur});
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
  }//connecter

  instancierNotificationsPush(){
   this.platform.ready().then(() => {
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

      // Récupération du deviceToken
      push.on('registration', (data) => {
       this.deviceToken = data.registrationId;
        console.log("device token ->", this.deviceToken);
      });

      // Action en cas de récéption de Push
      push.on('notification', (data) => {
        this.afficherNotificationPush(data.title, data.message, data.additionalData.foreground);      
      });

      // Gestion des erreurs
      push.on('error', (e) => {
        console.log(e.message);
      });
    }); 
  }//instancierNotificationsPush

  afficherNotificationPush(titreNotification, messageNotification, isApplicationOpen){
       let confirmAlert = this.alertCtrl.create({ // Création d'une alerte "confirm"
            title: titreNotification,
            message: messageNotification,
            buttons: [{
              text: 'Ignorer',
              role: 'cancel'
            }, {
              text: 'Afficher',
              handler: () => { // Si la personne est connectée ça ouvre la page des horaires
                console.log("login " + window.localStorage.getItem('utilisateurConnecte'))
                if(window.localStorage.getItem('utilisateurConnecte') === "1"){  
                    this.navCtrl.push(MeshorairesPage);
                } else { // Sinon : on lui demande de se connecter, et on affiche la page seulement après
                    this.rootPage = MeshorairesPage; //On enregsitre la page à afficher après la connexion
                    let alert = this.alertCtrl.create({ // On affiche une alert pour dire qu'il doit se connecter
                      title: "Veuillez d'abord vous connecter !",
                      buttons: ['OK']
                    });
                    alert.present();
                }
              }
            }]
          });
          confirmAlert.present();
  }//afficherNotificationPush

  instancierNotificationsLocales(){
    LocalNotifications.on("click", (notification, state) => {
        console.log('notification' + notification.id);
        if(window.localStorage.getItem('utilisateurConnecte') === "1"){  
          this.afficherNotificationLocale(notification.id, notification.title, notification.text);
        } else {
            this.isNotificationEnAttente = true;
            this.notificationEnAttente.id = notification.id;
            this.notificationEnAttente.titre = notification.title;
            this.notificationEnAttente.message = notification.text;   
        }
    }); 
  }//instancierNotificationsLocales

  afficherNotificationLocale(idNotification, titreNotification, messageNotification) {
    console.log('notification' + idNotification);
    if(idNotification == 1){  // Si l'id est 1 = c'est la notification mensuelle de validation des heures
      this.afficherValidationMensuelle(titreNotification, messageNotification);
    } else  {
      this.afficherNotificationFinDeService(titreNotification, messageNotification);
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
