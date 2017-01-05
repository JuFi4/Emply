import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AccueilPage } from 'C:/MesProjetsIonic/Emply/src/pages/accueil/accueil';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('Hello Login Page');
  }

  connexion() {
    this.navCtrl.push(AccueilPage, {utilisateur: "utilisateur"});
  }

}
