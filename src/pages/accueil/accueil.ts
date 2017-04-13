import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

//model
import {infoHeureUser} from '../../models/infoHeureUser';
import {userEta} from '../../models/userEta';
import {infosEtablissement} from '../../models/infosEtablissement';

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
  entablissement : any =[];
  dataInfoUser;
  infoEta : any;
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
                                console.log("coucou");  
                                console.log("OK");
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
                           console.log(dataInfoSolde);
                           this.dataInfoUser = new infoHeureUser(
                             dataInfoSolde[0].brut.time,
                             dataInfoSolde[0].conge,
                             dataInfoSolde[0].net.time,
                             dataInfoSolde[0].totalPause,
                           )
                           console.log(this.dataInfoUser.conge);
                           window.localStorage.setItem('getInfoEta', JSON.stringify(this.dataInfoUser));
                        } else { // Erreur
                           console.log("Pas ok");
                        }
      });


this.apiBddService.getInfosHeuresMois(window.localStorage.getItem('id'), "4","2017", "1").subscribe(
                            dataInfo => {
                              console.log(dataInfo)   
                              if(dataInfo) { // OK  
                                console.log("OK");
                                this.dataInfo = new infosEtablissement(
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
