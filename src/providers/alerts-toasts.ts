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

  //Pour la page des demandes

  //Alert pour les dates qui sont dans le passé
  faireAlertePasOkDatePassee() {
    let alert = this.alertCtrl.create({
      title: 'Demande non enregistrée',
      subTitle: 'Vos dates sont dans le passé.',
      buttons: ['Fermer']
    });
    alert.present();
  }//faireAlertePasOk

  //Alerts pour les demandes dont les dates ne sont pas cohérentes (dateDebut > dateFin)
  faireAlertePasOkDate() {
    let alert = this.alertCtrl.create({
      title: 'Demande non enregistrée',
      subTitle: 'Vos dates ne sont pas cohérentes.',
      buttons: ['Fermer']
    });
    alert.present();
  }//faireAlertePasOk

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

  //Alert pour les modifications validées
  faireAlertOK() {
    let prompt = this.alertCtrl.create({
      title: 'Modification validée',
      //message: "Modification validée",
      buttons: [
        {
          text: 'Fermer',
        }
      ]
    });
    prompt.present();
  }//faireAlertOK

  //Alert pour les modifications non validées
  faireAlertEchoue() {
    let prompt = this.alertCtrl.create({
      title: 'Modification échouée, veuillez recommencer',
      //message: "Modification échouée, veuillez recommencer",
      buttons: [
        {
          text: 'Fermer',
        }
      ]
    });
    prompt.present();
  }//faireAlertEchoue

}
