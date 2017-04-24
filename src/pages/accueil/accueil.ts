import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//model
import {InfoHeureUser} from '../../models/infoHeureUser';
import {userEta} from '../../models/userEta';
import {InfosEtablissement} from '../../models/infosEtablissement';
import {InfosContrat} from "../../models/infosContrat";
import {SoldeEmploye} from "../../models/SoldeEmploye";

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
  annneeCourrante = new Date().getFullYear(); // Année courrante
  moisCourant = new Date().getMonth()+1;
  jourCourant = new Date().getDay();
  vacancesAnnee : number;
  jourFerierAnnee : number;
  idDepartement : String;
  infosContrat : InfosContrat;
  soldeEmploye : SoldeEmploye;
  heureSupp : number;
  nbHeureParSem : number;
  affichageHS : String;
  affichageConge : String;
  afficherFerier : String;
  


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
    this.getCalcul();
  }//constructor
  
  getStats(){
    return new Promise((resolve, reject) => {
      console.log("getStats");
      
      this.apiBddService.getIdDepartement(window.localStorage.getItem('id'),window.localStorage.getItem('tokenBDD')).subscribe(
                              dep => {
                                if(dep) { // OK   
                                   // @ VANESSA : OK : tout se range bien dans this.idEtablissement
                                  this.idDepartement = dep;
                                  window.localStorage.setItem('getDepartement', JSON.stringify(this.idDepartement));
                                  console.log("idDepartement : " + window.localStorage.getItem('getDepartement'));
                                } else { // Erreur
                                  console.log("Pas ok");
                              }
                        });


      this.apiBddService.getIdEtablissement(window.localStorage.getItem('id'),window.localStorage.getItem('tokenBDD'),window.localStorage.getItem('getDepartement')).subscribe(
                              eta => {
                                if(eta) { // OK   
                                   // @ VANESSA : OK : tout se range bien dans this.idEtablissement
                                  this.idEtablissement = eta;
                                  console.log("idEtablissement : " + this.idEtablissement);
                                  window.localStorage.setItem('getEtablissement', JSON.stringify(this.idEtablissement));
                                } else { // Erreur
                                  console.log("Pas ok");
                              }
                        });


        this.apiBddService.getInfosSolde(window.localStorage.getItem('id'), this.annneeCourrante+"-01-01",this.annneeCourrante+"-12-31",window.localStorage.getItem('tokenBDD'),).subscribe(
                  dataInfoSolde => {
                        if(dataInfoSolde) { // OK     
                           // @ VANESSA : OK : tout se range bien dans ton objet
                            this.dataInfoUser = new InfoHeureUser(
                              dataInfoSolde.brut.time,
                              dataInfoSolde.totalPause.time,
                              dataInfoSolde.net.time, 
                              dataInfoSolde.conges
                            ) 
                            console.log("dataInfoUser");
                            console.log(this.dataInfoUser);  
                            window.localStorage.setItem('getInfoEta', JSON.stringify(this.dataInfoUser));
                          } else { // Erreur
                            console.log("Pas ok");
                          }
        });


    this.apiBddService.getInfosHeuresMois(window.localStorage.getItem('id'),''+this.moisCourant,''+this.annneeCourrante,window.localStorage.getItem('getEtablissement'),window.localStorage.getItem('tokenBDD') ).subscribe(
                              dataInfo => {
                                if(dataInfo) { // OK
                                  console.log(dataInfo)  
                                  this.infoEta = new InfosEtablissement(
                                        dataInfo.droitvacances_annee.time,
                                        dataInfo.droitjoursferies_annee,
                                        dataInfo.heures_mois,
                                        dataInfo.heures_semaine,
                                        dataInfo.jourprisvacances,
                                        dataInfo.jourprisferies,
                                  )                                                                   
                                  console.log("dataInfo");
                                  console.log(this.infoEta.droitVacanceAnnee);
                                  this.vacancesAnnee = this.infoEta.droitVacanceAnnee;
                                  this.jourFerierAnnee = this.infoEta.droitJourFerieAnnee;
                                  this.nbHeureParSem = this.infoEta.heureSemaine;
                                  var heureFerier = this.infoEta.droitJourFerieAnnee - this.infoEta.jourPrisFer;
                                  var heureVac = this.vacancesAnnee - this.infoEta.jourPrisVac;
                                  this.affichageHS = this.nbHeureParSem +" H/Semaine";
                                  console.log("affichage "+this.affichageHS);
                                  this.affichageConge = heureVac +"/"+this.vacancesAnnee;
                                  console.log("affichage "+this.affichageConge);
                                  this.afficherFerier = heureFerier +"/"+ this.jourFerierAnnee 
                                  window.localStorage.setItem('getInfoEta', JSON.stringify(this.dataInfo));
                                } else { // Erreur
                                  console.log("Pas ok");
                                }
                        });

       this.apiBddService.getTypeHoraireContrat(window.localStorage.getItem('id'),window.localStorage.getItem('tokenBDD')).subscribe(
                              typeContratH => {
                                if(typeContratH) { // OK
                                  console.log(typeContratH)  
                                  this.infosContrat = new InfosContrat(
                                        typeContratH[0].type,
                                        typeContratH[0].nbHeure,
                                  )                                                                   
                                  console.log("typeContratH");
                                } else { // Erreur
                                  console.log("Pas ok");
                                }
                        });
          
          this.apiBddService.getCalculerSoldeEmployee(window.localStorage.getItem('id'),''+this.moisCourant, ''+this.annneeCourrante, window.localStorage.getItem('getEtablissement'),window.localStorage.getItem('tokenBDD')).subscribe(
                              soldeEmploye => {
                                if(soldeEmploye) { // OK
                                  console.log(soldeEmploye)  
                                  this.soldeEmploye = new SoldeEmploye(
                                        soldeEmploye.solde_conges,
                                        soldeEmploye.solde_feries,
                                        soldeEmploye.solde_heures.time,
                                        soldeEmploye.solde_vacances,
                                  )
                                  this.heureSupp = this.soldeEmploye.soldeHeure;                                                                   
                                  console.log("soldeEmploye");
                                } else { // Erreur
                                  console.log("Pas ok");
                                }
                        });

       resolve("Fini");
      });
  }//getStats

  getCalcul(){
      

  }

  ionViewDidLoad() {
    console.log('Hello Accueil Page');
  }
}
