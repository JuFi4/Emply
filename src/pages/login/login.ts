//Login Page

// Modules ionic
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams , AlertController, Nav, Platform, LoadingController} from 'ionic-angular';
import { LocalNotifications, Push, Splashscreen, StatusBar } from 'ionic-native';


// Pages
import { AccueilPage } from '../accueil/accueil';
import {MeshorairesPage} from "../meshoraires/meshoraires";
import {DemandesPage} from "../demandes/demandes";
import {ControlePage} from "../controle/controle";
import {ParametresPage} from "../parametres/parametres";

// Providers
import { ApiBddService } from '../../providers/api-bdd-service';
import { ConnectivityService } from '../../providers/connectivity-service';
import { ApiPdfService } from '../../providers/api-pdf-service';
import { AffichageValidationHoraireService } from '../../providers/affichage-validation-horaire-service';
import { AlertsToasts } from '../../providers/alerts-toasts';

//Models
import {Horaire} from '../../models/horaire';

// Sert à vérifier la connexion
declare var navigator: any;
declare var Connection: any;

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
   notificationEnAttente =  {id: '', titre: '', message:'', data:'' };  
   radioOpen: boolean;
   radioResult;  


  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public platform : Platform, 
        private validationCtrl : AffichageValidationHoraireService, private abiBddCtrl: ApiBddService, private loadingCtrl: LoadingController, 
        private connectivityService: ConnectivityService, public pdfCtrl : ApiPdfService, private AlertsToasts: AlertsToasts) {        
      
     // Définition de la d'accueil par défaut
     this.rootPage = AccueilPage; 
    
     // Instanciation des notifications push
     this.instancierNotificationsPush();    

     // Instanciation des notifications locales
     this.instancierNotificationsLocales();  
    
     // Vérification des données réseau
     this.checkNetwork();

    this.resteConnecte = (window.localStorage.getItem('resteConnecte') === '1');

    if(this.resteConnecte && window.localStorage.getItem('utilisateur') !== "undefined" && window.localStorage.getItem('motDePasse') !== "undefined" && 
       window.localStorage.getItem('utilisateur') !== null && window.localStorage.getItem('motDePasse') !== null){ // Connexion automatique
      
      // On définit le nom d'utilisateur et mot de passer avec les données du localStorage
      this.utilisateur = window.localStorage.getItem('utilisateur');
      this.motDePasse = window.localStorage.getItem('motDePasse');
      this.connecter(); // On appelle directement la fonction de connexion pour obtenir un nouveau token de BDD
   } else { // Affichage de la page connexion normale
     return;
  }
 }//constructor

  changeResteConnecte(){
    this.resteConnecte = !this.resteConnecte;
    console.log(this.resteConnecte);
  }//changeResteConnece

  // Vérification des données mobiles pour pouvoir traiter le mode hors ligne
  checkNetwork() {   
    if(this.connectivityService.isOffline()){
       window.localStorage.setItem('noNetwork', '1');
       this.AlertsToasts.faireAlertModeHorsLigne();
    } else {
      window.localStorage.setItem('noNetwork', '0');
    }
  }//checkNetwork

   ionViewDidLoad() {
    console.log('Hello Login Page');
  }//ionViewDidLoad

  nouveauMotDePasse(){
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
          this.abiBddCtrl.setNewPassword(data.mail.trim()).subscribe(
                data => {        
                    if(data) { // OK    
                      this.AlertsToasts.confirmerDemandeNouveauMotDePasse();
                    } else { // Erreur
                      this.AlertsToasts.alerterMailInexistant();
                    }
                }
            ); 
        }
      }
    ]
  });
  alert.present();
 }//nouveauMotDePasse

  connecter() {
    // On passe trim() sur utilisateur et mot de passe pour enlever les éventuels espaces blancs
    this.utilisateur = this.utilisateur.trim();
    this.motDePasse = this.motDePasse.trim();
    if(window.localStorage.getItem('noNetwork') === '0'){ // Mode normal : vérification de la connexion en ligne
      this.abiBddCtrl.connexion(this.utilisateur, this.motDePasse, (this.deviceToken != null) ? this.deviceToken : "").subscribe(
                  data => {        
                      if(data) {  // OK   

                        // On sauvegarde les données de l'utilisateur pour la session actuelle
                        window.localStorage.setItem('id', data.id);
                        window.localStorage.setItem('tokenBDD', data.token);                        

                        //On sauvegarde le nom d'utilisateur et le mot de passe pour pouvoir faire le login hors connexion
                        window.localStorage.setItem('dernierUtilisateur', this.utilisateur);
                        window.localStorage.setItem('dernierMotDePasse', this.motDePasse);                          
                        
                        this.connexionOk();
                      } else { // Erreur
                        this.AlertsToasts.afficherErreurDeCOnnexion();                        
                      }
                  }
              ); 
    } else { // Mode hors connexion
        if(window.localStorage.getItem('dernierUtilisateur') === this.utilisateur && window.localStorage.getItem('dernierMotDePasse') === this.motDePasse){
          this.connexionOk();
        } else {
          this.AlertsToasts.afficherErreurDeCOnnexion();      
        }
    }
  }//connecter

  // Actions a faire quel que soit le mode de connexion
  connexionOk(){
    // Sauvegade des données de connexion et du statut connecté
     window.localStorage.setItem('utilisateur', this.utilisateur.trim());
     window.localStorage.setItem('motDePasse', this.motDePasse.trim());
     window.localStorage.setItem('deviceToken', this.deviceToken);
     window.localStorage.setItem('utilisateurConnecte', "1");
      if (this.resteConnecte) { 
         window.localStorage.setItem('resteConnecte', '1'); // On sauvegarde le fait qu'on veut rester connecter                                        
     } else {
        window.localStorage.setItem('resteConnecte', '0'); // On sauvegarde le fait qu'on ne veut pas rester connecter
     }
      // Si on a une notification en attente, on l'affiche
      if(this.isNotificationEnAttente) {
          this.afficherNotificationLocale(this.notificationEnAttente.id, this.notificationEnAttente.titre, this.notificationEnAttente.message, this.notificationEnAttente.data);
      }                                      
     // On redirige vers la bonne page
     this.navCtrl.push(this.rootPage, {utilisateur: this.utilisateur.trim()});
  }//connexionOk

  instancierNotificationsPush(){
   this.deviceToken = null;
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
        let addData = <any>data.additionalData; // On transforme les additionnalData en un objet quelconque
        let id = addData.payload.id;// On peut ainsi récupérer l'id du push
        this.afficherNotificationPush(id, data.title, data.message, data.additionalData.foreground);      
      });

      // Gestion des erreurs
      push.on('error', (e) => {
        console.log(e.message);
      });
    }); 
  }//instancierNotificationsPush

  afficherNotificationPush(idNoficiation, titreNotification, messageNotification, isApplicationOpen){
       let confirmAlert = this.alertCtrl.create({ // Création d'une alerte "confirm"
            title: titreNotification,
            message: messageNotification,
            buttons: [{
              text: 'Ignorer',
              role: 'cancel'
            }, {
              text: 'Afficher',
              handler: () => { // Si la personne est connectée ça ouvre la page des horaires
                if(window.localStorage.getItem('utilisateurConnecte') === "1"){  
                    if(idNoficiation == 1 || idNoficiation == 2){ // Le push concerne les horaires
                        this.navCtrl.push(MeshorairesPage);
                    } else { // Le push concerne les demandes
                      this.navCtrl.push(DemandesPage);
                    }
                } else { // Sinon : on lui demande de se connecter, et on affiche la page seulement après
                     //On enregsitre la page à afficher après la connexion
                      if(idNoficiation == 1 || idNoficiation == 2){ // Le push concerne les horaires
                        this.rootPage = MeshorairesPage;
                      } else { // Le push concerne les demandes
                        this.rootPage = DemandesPage;
                      }
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
        if(window.localStorage.getItem('utilisateurConnecte') === "1"){  
          this.afficherNotificationLocale(notification.id, notification.title, notification.text, notification.data);
        } else {
            this.isNotificationEnAttente = true;
            this.notificationEnAttente.id = notification.id;
            this.notificationEnAttente.titre = notification.title;
            this.notificationEnAttente.message = notification.text;   
            this.notificationEnAttente.data = notification.data;   
        }
    }); 
  }//instancierNotificationsLocales

 afficherNotificationLocale(idNotification, titreNotification, messageNotification, data) {
    if(idNotification == 0){  // Si l'id est 1 = c'est la notification mensuelle de validation des heures
      this.validationCtrl.afficherValidationMensuelle(titreNotification, messageNotification, data);
    } else  {
      if (idNotification == -1) { // Si l'id est -1 = c'est la notification des horaires en attente de validation
        this.validationCtrl.afficherAlertAttenteValidation(titreNotification, messageNotification);
      } else {
        this.validationCtrl.afficherNotificationFinDeService(data);
      }
  }    
  }//afficherNotificationLocale  

}//LoginPage
