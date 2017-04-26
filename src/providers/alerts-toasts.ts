import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the AlertsToasts provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AlertsToasts {

  constructor(public http: Http, public alertCtrl: AlertController, public toastCtrl: ToastController) {
    console.log('Hello AlertsToasts Provider');
  }

  //Pour le provider d'affichage des validation des horaires et les demandes
  //Alerts pour les demandes dont les dates ne sont pas cohérentes (dateDebut > dateFin)
  afficherAlertPasValide() {
    let alert = this.alertCtrl.create({
      title: "Dates non valide",
      message: "Vos dates ne sont pas valides. Veuillez mettre une date de debut antérieur à la date de fin",
      buttons: ['OK']
    });
    alert.present();
  }//afficherAlertPasValide

  afficherAlerteDatePasse(){
    let alert = this.alertCtrl.create({
      title: "Dates non valide",
      message: "Vos dates ne sont pas valides. Veuillez mettre des dates qui ne sont pas dans le passé.",
      buttons: ['OK']
    });
    alert.present();
  }

  //Pour la page des demandes

  //Alert pour les dates qui sont dans le passé
  faireAlertePasOkDatePassee() {
    let alert = this.alertCtrl.create({
      title: 'Demande non enregistrée',
      subTitle: 'Vos dates sont dans le passé.',
      buttons: ['Fermer']
    });
    alert.present();
  }//faireAlertePasOkDatePassee

  //Alerts pour les demandes pas enregistrées
  faireAlertePasOk() {
    let alert = this.alertCtrl.create({
      title: 'Demande non enregistrée',
      subTitle: 'Recommencez votre demande.',
      buttons: ['Fermer']
    });
    alert.present();
  }//faireAlertePasOk

  //Alerts pour les demandes pas enregistrées
  faireAlerteHeuresPasOk() {
    let alert = this.alertCtrl.create({
      title: 'Demande non enregistrée',
      subTitle: 'Vos heures ne sont pas cohérentes ou dans le passé',
      buttons: ['Fermer']
    });
    alert.present();
  }//faireAlerteHeuresPasOk

  //Toast pour les demandes enregistrées
  faireToastOk() {
    let toast = this.toastCtrl.create({
      message: `Demande enregistrée`,
      duration: 2000,
      cssClass: "yourCssClassName",
    });
    toast.present();
  }//faireToastOk


  //Pour le profil

  //Alert connexion echouée
  faireAlertConnexionEchouee() {
    let prompt = this.alertCtrl.create({
      title: 'Erreur de connexion',
      message: "Problème de connexion",
      buttons: ["ok"]
    });
    prompt.present();
  }//faireAlertConnexionEchouee

  //Toast modification enregistrée
  faireToastModificationEnregistree() {
    let toast = this.toastCtrl.create({
      message: `Modifications enregistrées`,
      duration: 2000,
      cssClass: "yourCssClassName",
    });
    toast.present();
  }//faireToastModificationEnregistree

  //Alert pour une adresse mail pas valide
  faireAlertMailPasValide(){
    let prompt = this.alertCtrl.create({
      title: 'Modification échouée',
      message: "Veuillez entrer une adresse email valide",
      buttons: ["ok"]
    });
    prompt.present();
  }//faireAlertMailPasValide

  //Alert pour un mdp pas valide
  faireAlertMdpPasValide(){
    let prompt = this.alertCtrl.create({
      title: 'Modification échouée',
      message: "Votre nouveau mot de passe et sa confirmation ne sont pas identiques.",
      buttons: ["ok"]
    });
    prompt.present();
  }//faireAlertMdpPasValide

  //Page login

  faireAlertModeHorsLigne() {
    let alert = this.alertCtrl.create({
      title: 'Mode hors ligne',
      message: 'Vous êtes actuellement en mode hors ligne.\n '
      + 'Vous pouvez vous connecter avec le dernier compte utilisé et consulter les données chargées lors de votre dernière utilisation.\n '
      + ' Vous ne pourrez pas charger de nouvelles données, ni enregsitrer de modifications.',
      buttons: ['OK']
    });
    alert.present();
  }//faireAlertModeHorsLigne

  confirmerDemandeNouveauMotDePasse() {
    let alert = this.alertCtrl.create({
      title: 'Demande exécutée',
      subTitle: 'Votre nouveau mot de passe a été envoyé sur votre boîte mail.',
      buttons: ['Retour']
    });
    alert.present();
  }//confirmerDemandeNouveauMotDePasse

  alerterMailInexistant() {
    let alert = this.alertCtrl.create({
      title: 'Le mail saisi ne correspond à aucun utilisateur',
      buttons: ['Retour']
    });
    alert.present();
  }//alerterMailInexistant

  afficherErreurDeCOnnexion() {
    console.log("Connexion échouée : mauvais mail ou mot de passe");
    let alert = this.alertCtrl.create({
      title: 'Erreur',
      subTitle: 'Utilisateur et/ou mot de passe incorrect(s).',
      buttons: ['Retour']
    });
    alert.present();
  }//afficherErreurDeCOnnexion

  faireToastSynchronisation(){
    let toast = this.toastCtrl.create({
      message: `Synchronisation activée`,
      duration: 2000,
      cssClass: "yourCssClassName",
    });
    toast.present();
  }

}

