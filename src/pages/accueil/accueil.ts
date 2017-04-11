import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';


//import du provider
import { ApiBddService } from '../../providers/api-bdd-service';
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



  constructor(private navCtrl: NavController, private navParams: NavParams, private alertCtrl: AlertController,
              private apiBddService : ApiBddService) {
    this.utilisateur = navParams.get('utilisateur');
    this.inputDisabled = true;
  }//constructor


  afficherInformationEmploye(){
    var idEtablissement = this.apiBddService.getIdEtablissement(window.localStorage.getItem('id')).subscribe(
                            data => {
                              if(data) { // OK     
                                console.log("OK");
                              } else { // Erreur
                                console.log("Pas ok");
                            }
                      });
    console.log("Etablissement " + idEtablissement)
    var hello = this.apiBddService.getInfosHeuresMois(window.localStorage.getItem('id'), "04","2017", "1").subscribe(
                            data => {
                              if(data) { // OK     
                                console.log("OK");
                              } else { // Erreur
                                console.log("Pas ok");
                            }
                      });
    console.log("cc"+hello);
}
  
  ionViewDidLoad() {
    console.log('Hello Accueil Page');
  }
}
