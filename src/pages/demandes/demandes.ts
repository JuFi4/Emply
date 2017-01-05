import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SaisiedemandePage } from 'C:/MesProjetsIonic/Emply/src/pages/saisiedemande/saisiedemande';

/*
  Generated class for the Demandes page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-demandes',
  templateUrl: 'demandes.html'
})
export class DemandesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('Hello Demandes Page');
  }

  saisirDemande() {
    this.navCtrl.push(SaisiedemandePage, null);
  }

}
