import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {User} from "../models/user";
import {ServiceUsers} from "../../providers/user-service";
/*
  Generated class for the Monprofil page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-monprofil',
  templateUrl: 'monprofil.html'
})
 export class MonprofilPage {

  user : any = [];
  inputDisabled : boolean;	

  constructor(public navCtrl: NavController, public navParams: NavParams, public serviceUsers : ServiceUsers, public alertCtrl: AlertController) {
    this.user.id = 4;
    this.user.token = "Marcuzzo | 587fc844ef548587fc844ef580587fc844ef5b9";
    serviceUsers.getUser(this.user.id, this.user.token).subscribe(user => {
      this.user = user;
      console.log(user);
    })
   this.inputDisabled = true;
  }
  
   modifier(){
    this.inputDisabled = false;
  }

  enregistrer(){
    this.serviceUsers.setUser(this.user.id, this.user.token, this.user.nom, this.user.prenom, this.user.dateNaissance, this.user.adresse,this.user.suppAdresse, this.user.codePostal, this.user.ville, this.user.telFix, this.user.telMobile)
    console.log(this.user.id, this.user.token, this.user.nom, this.user.prenom, this.user.dateNaissance, this.user.adresse)
  }
  
  ionViewDidLoad() {
    console.log('Hello MonProfil Page');
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
            console.log('Changement confirm�');
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
            console.log('Changement confirm�');
          }
        }
      ]
    });
    prompt.present();
  }
}