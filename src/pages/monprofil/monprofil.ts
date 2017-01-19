import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

/*
  Generated class for the Monprofil page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-monprofil',
  templateUrl: 'monprofil.html'
})
/*export class MonprofilPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('Hello MonProfil Page');
  }

}*/


export class MonprofilPage {
  constructor(public alertCtrl: AlertController) {
  }

  doChangementMDP() {
    let prompt = this.alertCtrl.create({
      title: 'Modification de mon mot de passe',
      message: "Entrez votre mot de passe : ",
      inputs: [
        {
          id: 'mdpAct',
          name: 'mdpActuel',
          placeholder: 'Mot de passe actuel'
        },
        {
          id: 'NewMdp1',
          name: 'mdpNew',
          placeholder: 'Nouveau Mot de passe'
        },
        {
          id: 'NewMdp2',
          name: 'mdpNew2',
          placeholder: 'Confirmer votre nouveau Mot de passe'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Annulation de la modification');
          }
        },
        {
          text: 'Confirmer',
          handler: data => {
            console.log('Changement confirmé');
            this.doCheck();
          }
        }
      ]
    });
    prompt.present();
  }
  doCheck(){
    console.log('doCheck');
    var MDP1 = document.getElementById("NewMdp1");
    var MDP2 = document.getElementById("NewMdp2");
    if (MDP1 == MDP2) {
      console.log('true');
      return true;
    } else {
      console.log('false');
      return false;
    }
  }
  doChangementMail() {
    let prompt = this.alertCtrl.create({
      title: 'Modification du mail',
      message: "Entrez votre nouvelle adresse email : ",
      inputs: [
        {
          name: 'newMail',
          placeholder: 'Nouvelle adresse Email'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Annulation de la modification');
          }
        },
        {
          text: 'Confirmer',
          handler: data => {
            console.log('Changement confirmé');
          }
        }
      ]
    });
    prompt.present();
  }
}