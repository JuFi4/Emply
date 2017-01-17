import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.utilisateur = navParams.get('utilisateur');
  }//constructor
  
  ionViewDidLoad() {
    console.log('Hello Accueil Page');
  }
}
