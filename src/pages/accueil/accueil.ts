import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

//model
import {InfoHeureUser} from '../../models/infoHeureUser';
import {userEta} from '../../models/userEta';
import {InfosEtablissement} from '../../models/infosEtablissement';

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
  etablissement : number;
  dataInfoUser : InfoHeureUser;
  infoEta : InfosEtablissement;
  idEtablissement;
  dataInfo;
  

  constructor(private navCtrl: NavController, private navParams: NavParams, private alertCtrl: AlertController,
              private apiBddService : ApiBddService) {
    let etaUser;
    this.utilisateur = navParams.get('utilisateur');
    this.inputDisabled = true;
    this.apiBddService.getIdEtablissement(window.localStorage.getItem('id')).subscribe(
                            eta => {
                              if(eta) { // OK   
                                // @ VANESSA : L'API ne retourne rien, donc je ne sais pas comment tester. Est-ce normal que ça ne retourne rien ?
                                this.idEtablissement = eta;
                                console.log(this.idEtablissement);
                               // window.localStorage.setItem('getEtablissement', JSON.stringify(this.entablissement));
                              } else { // Erreur
                                console.log("Pas ok");
                            }
                      });


      this.apiBddService.getInfosSolde(window.localStorage.getItem('id'), "2017-01-01","2017-12-31").subscribe(
                dataInfoSolde => {
                       if(dataInfoSolde) { // OK     
                         // @ VANESSA : OK : tout se range bien dans ton objet
                           this.dataInfoUser = new InfoHeureUser(dataInfoSolde.brut.time,dataInfoSolde.totalPause.time,dataInfoSolde.net.time, dataInfoSolde.conges) 
                           console.log(this.dataInfoUser.conge);
                           window.localStorage.setItem('getInfoEta', JSON.stringify(this.dataInfoUser));
                        } else { // Erreur
                           console.log("Pas ok");
                        }
      });


   this.apiBddService.getInfosHeuresMois(window.localStorage.getItem('id'), "4","2017", "1").subscribe(
                            dataInfo => {
                              // @ VANESSA : Les "/" posent effectivement problème, il faut que Joel les enlève et ensuite ça fonctionnera
                              if(dataInfo) { // OK  
                                console.log("OK");
                                this.dataInfo = new InfosEtablissement(
                                      dataInfo.droitvacancesannee.time,
                                      dataInfo.droitjoursferiesannee,
                                )
                                console.log(this.dataInfo.droitJourFerieAnnee);
                                window.localStorage.setItem('getInfoEta', JSON.stringify(this.dataInfo));
                              } else { // Erreur
                                console.log("Pas ok");
                              }
                      });
  }//constructor

  
  ionViewDidLoad() {
    console.log('Hello Accueil Page');
  }
}
