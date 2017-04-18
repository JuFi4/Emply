import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//model
import {InfoHeureUser} from '../../models/infoHeureUser';
import {userEta} from '../../models/userEta';
import {InfosEtablissement} from '../../models/infosEtablissement';

//import du provider
import { ApiBddService } from '../../providers/api-bdd-service';
import { SyncHorairesService } from '../../providers/sync-horaires-service';

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
  


  constructor(private loadCtrl: LoadingController, private navCtrl: NavController, private navParams: NavParams, private alertCtrl: AlertController, private apiBddService : ApiBddService, private syncHoraireCtrl : SyncHorairesService) {
    let etaUser;
    this.utilisateur = navParams.get('utilisateur');
    this.inputDisabled = true;   
    
    //Icone de chargement
    let loader = loadCtrl.create({
      content: "Chargement"
    });  
    loader.present();

    //On sync les horaires (calendrier + notification ) ensuite: en récupère les stats, et quand c'est fini, on arrête l'affichage de l'icone de chargement
    syncHoraireCtrl.manangeSync().then(result => this.getStats()).then(result => loader.dismiss());
  }//constructor
  
  getStats(){
    return new Promise((resolve, reject) => {
      console.log("getStats");
      this.apiBddService.getIdEtablissement(window.localStorage.getItem('id')).subscribe(
                              eta => {
                                if(eta) { // OK   
                                   // @ VANESSA : OK : tout se range bien dans this.idEtablissement
                                  this.idEtablissement = eta;
                                  console.log("idEtablissement : " + this.idEtablissement);
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
                            console.log("dataInfoUser");
                            console.log(this.dataInfoUser);  
                            window.localStorage.setItem('getInfoEta', JSON.stringify(this.dataInfoUser));
                          } else { // Erreur
                            console.log("Pas ok");
                          }
        });


    this.apiBddService.getInfosHeuresMois(window.localStorage.getItem('id'), "4","2017", "1").subscribe(
                              dataInfo => {
                                // @ VANESSA : OK : tout se range bien dans ton objet, par contre j'ai récupéré le "time" comme tu m'avais dit, mais je ne comprend pas bien à quoi il correspond
                                // Pour droitvacances_annee j'ai : hours:"840", minutes:"57", seconds:"36", time:35.04 et ke trouve que c'est assez bizare : je ne vois pas quelle est l'unité de mesure du "time" !!
                                // Donc j'espère que Joel t'a expliqué ce que c'est car je ne comprend pas trop !!
                                // Si jamais tu as besoin d'autres champs je pense que tu as compris comment ça fonctionne (il n'y jamais le "[0]", et si jamais tu  me dis ;)
                                if(dataInfo) { // OK
                                  console.log(dataInfo)  
                                  this.infoEta = new InfosEtablissement(
                                        dataInfo.droitvacances_annee.time,
                                        dataInfo.droitjoursferies_annee,
                                  )                                                                   
                                  console.log("dataInfo");
                                  console.log(this.infoEta);
                                  window.localStorage.setItem('getInfoEta', JSON.stringify(this.dataInfo));
                                } else { // Erreur
                                  console.log("Pas ok");
                                }
                        });
       resolve("Fini");
      });
  }//getStats

  ionViewDidLoad() {
    console.log('Hello Accueil Page');
  }
}
