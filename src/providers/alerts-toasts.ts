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

}

