import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

/*
  Generated class for the Accueil page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-accueil',
  templateUrl: 'accueil.html'
})
export class AccueilPage {
  utilisateur: string;
  inputDisabled;

  constructor(private navCtrl: NavController, private navParams: NavParams, private alertCtrl: AlertController) {
    this.utilisateur = navParams.get('utilisateur');
    this.inputDisabled = true;
  }//constructor
  
  ionViewDidLoad() {
    console.log('Hello Accueil Page');
  }
}
