//Accueil page

import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//model
import {InfoHeureUser} from '../../models/infoHeureUser';
import {userEta} from '../../models/userEta';
import {InfosEtablissement} from '../../models/infosEtablissement';
import {InfosContrat} from "../../models/infosContrat";
import {SoldeEmploye} from "../../models/SoldeEmploye";

//provider
import { ApiBddService } from '../../providers/api-bdd-service';
import { SyncHorairesService } from '../../providers/sync-horaires-service';
import { ConnectivityService } from '../../providers/connectivity-service';

@Component({
  selector: 'page-accueil',
  templateUrl: 'accueil.html'
})
export class AccueilPage {
  utilisateur: string;
  inputDisabled;
  etablissement : number;
  dataInfoUser : InfoHeureUser = null;
  infoEta : InfosEtablissement = null;
  idEtablissement = null;
  dataInfo = null;
  annneeCourrante = new Date().getFullYear(); // Année courrante
  moisCourant = new Date().getMonth()+1;
  jourCourant = new Date().getDay();
  idDepartement : string = null;
  infosContrat : InfosContrat = null;
  soldeEmploye : SoldeEmploye = null;
  heureSupp;
  nbHeureParSem : number;
  affichageHS : string;
  affichageConge : string;
  afficherFerier : string;
  isHorsLigne : boolean;


  constructor(private connectivityService: ConnectivityService, private loadCtrl: LoadingController, private navCtrl: NavController, private navParams: NavParams, private alertCtrl: AlertController, private apiBddService : ApiBddService, private syncHoraireCtrl : SyncHorairesService) {
    this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1' || this.connectivityService.isOffline();       
    let etaUser;
    this.utilisateur = navParams.get('utilisateur');
    this.inputDisabled = true;   
    
    //Icone de chargement
    let loader = loadCtrl.create({
      content: "Chargement"
    });  
    loader.present();

    // On synchronise les horaires (calendrier + notification ), ensuite: on récupère les stats, et quand c'est fini, on arrête l'affichage de l'icone de chargement
    syncHoraireCtrl.manangeSync().then(result => this.getStats()).then(result => loader.dismiss());
  }//constructor

 //Récupération de  l'ID du département 
 getIdDepartement(){
    console.log("getIdDepartement");
    return new Promise((resolve, reject) => {
      this.apiBddService.getIdDepartement(window.localStorage.getItem('id'),window.localStorage.getItem('tokenBDD')).subscribe(
             dep => {
               if(dep) { 
                  this.idDepartement = dep;  
                  console.log("this.idDepartement " + this.idDepartement);                                                    
              } else { // Erreur
                  console.log("Erreur");
              }
              resolve("Fini");    
          }, err => resolve("Fini"));       
     });
 }//getIdDepartement

  //Récupération de l'id de l'établissement
  getIdEtablissement(){
    console.log("getIdEtablissement");
    return new Promise((resolve, reject) => {    
      this.apiBddService.getIdEtablissement(window.localStorage.getItem('id'),window.localStorage.getItem('tokenBDD'), this.idDepartement).subscribe(
           eta => {        
            if(eta) { 
              this.idEtablissement = eta;    
               console.log("this.idEtablissement " + this.idEtablissement);                                       
             } else { // Erreur
               console.log("Erreur");
             }
             resolve("Fini");
          }, err => resolve("Fini"));      
     });
  }//getIdEtablissement

  //Récupération des infos de la personne lié au congé et aux horaires
  getInfosSolde(){
    return new Promise((resolve, reject) => {  
       console.log("getInfosSolde");  
       this.apiBddService.getInfosSolde(window.localStorage.getItem('id'), this.annneeCourrante+"-01-01",this.annneeCourrante+"-12-31",window.localStorage.getItem('tokenBDD')).subscribe(
           dataInfoSolde => {
                if(dataInfoSolde) { 
                  this.dataInfoUser = new InfoHeureUser(
                       dataInfoSolde.brut.time,
                       dataInfoSolde.totalPause.time,
                       dataInfoSolde.net.time, 
                       dataInfoSolde.conges
                  )   
                } else { // Erreur
                  console.log("Erreur");
                }
               resolve("Fini")
            }, err => resolve("Fini"));
     });
  }//getInfosSolde

  //Récupération des infos du contrat
  getTypeHoraireContrat(){
    console.log("getTypeHoraireContrat");
    return new Promise((resolve, reject) => {    
        this.apiBddService.getTypeHoraireContrat(window.localStorage.getItem('id'),window.localStorage.getItem('tokenBDD')).subscribe(
           typeContratH => {
               if(typeContratH) { // OK
                      this.infosContrat = new InfosContrat(
                          typeContratH[0].conParticularite,
                          typeContratH[0].idHor,
               ) 
               console.log("infosContrat");   console.log(this.infosContrat);  
               } else { // Erreur
                    console.log("Erreur");
               }
              resolve("Fini");
          }, err => resolve("Fini"));
     });
  }//getTypeHoraireContrat

  //Récupération des infos du solde de l'employé
  getCalculerSoldeEmployee(){
    console.log("getCalculerSoldeEmployee");
    return new Promise((resolve, reject) => {    
        this.apiBddService.getCalculerSoldeEmployee(window.localStorage.getItem('id'),''+this.moisCourant, ''+this.annneeCourrante, this.idEtablissement,window.localStorage.getItem('tokenBDD')).subscribe(
                soldeEmploye => {
                  if(soldeEmploye) { // OK
                    this.soldeEmploye = new SoldeEmploye(
                      soldeEmploye.solde_conges,
                      soldeEmploye.solde_feries,
                      soldeEmploye.solde_heures.time,
                      soldeEmploye.solde_vacances,
                   )
                    this.heureSupp = this.soldeEmploye.soldeHeure; 
                    console.log("heureSupp");   console.log(this.heureSupp);  
                    window.localStorage.setItem('heureSupp', this.heureSupp);//Sauvegarde pour mode hors ligne                                                                                             
                 } else { // Erreur
                     console.log("Erreur");
                }
                resolve("Fini");
         }, err => resolve("Fini"));      
     });
  }//getCalculerSoldeEmployee

   //Récupération des infos du solde de l'employé
  getInfosHeuresMois(){
     console.log("getInfosHeuresMois");
    return new Promise((resolve, reject) => {    
        this.apiBddService.getInfosHeuresMois(window.localStorage.getItem('id'),''+this.moisCourant,''+this.annneeCourrante, this.idEtablissement,window.localStorage.getItem('tokenBDD') ).subscribe(
             dataInfo => {
              console.log(dataInfo);
              if(dataInfo) { // OK
                this.infoEta = new InfosEtablissement(
                    dataInfo.droitvacances_annee.time,
                    dataInfo.droitjoursferies_annee,
                    dataInfo.heures_mois,
                    dataInfo.heures_semaine,
                    dataInfo.jourprisvacances,
                    dataInfo.jourprisferies,
                )   
                console.log(this.infoEta);
                try {                
                  //calcul des vacances et feriers
                  var heureFerier = (this.infoEta.droitJourFerieAnnee - this.infoEta.jourPrisFer) + this.soldeEmploye.soldeFerier;                                   
                  var heureVac = Math.round(this.infoEta.droitVacanceAnnee - this.infoEta.jourPrisVac) + this.soldeEmploye.soldeVacance;
                  //si il c'est un contrat en pourcentage on fait fois le nombre d'heures de l'étabalissement
                  //sinon, on met les horaires normaux
                  if(this.infosContrat.type == 2){
                      this.affichageHS = Math.round(this.infoEta.heureSemaine*this.infosContrat.nbHeure) +" H/Semaine";
                  }else{
                      this.affichageHS = this.infosContrat.nbHeure + " H/Semaine";
                  }
                  //affichage des données
                  this.affichageConge = Math.round(heureVac) +"/"+Math.round(this.infoEta.droitVacanceAnnee);                                     
                  this.afficherFerier = heureFerier +"/"+ this.infoEta.droitJourFerieAnnee 
                  
                  //Sauvegarde pour mode hors ligne  
                  window.localStorage.setItem('affichageHS', this.affichageHS);
                  window.localStorage.setItem('affichageConge', this.affichageConge);
                  window.localStorage.setItem('afficherFerier', this.afficherFerier);     
                }  catch(Exception){
                  //Erreur dans les calculs
                  resolve("Fini");    
                }
            } else { // Erreur
                console.log("Erreur");
            }
            resolve("Fini");
        }, err => resolve("Fini"));
     });
  }//getInfosHeuresMois
  
  getStats(){
    return new Promise((resolve, reject) => {
      console.log("getStats"); 
      if(!this.isHorsLigne) {  
         // On récupère toutes les infos de l'utilisateur via les différents services
         this.getIdDepartement()
          .then(result=> this.getIdEtablissement())
          .then(result=> this.getInfosSolde())
          .then(result => this.getTypeHoraireContrat())
          .then(result => this.getCalculerSoldeEmployee())
          .then(result => this.getInfosHeuresMois())
          .then(result => resolve("Fini"));   // Et on résoud la promise à la fin
                   
        } else { // Si on est hors ligne          
            //On regarde si les données à afficher existent en sauvegarde locale, et si oui on affichera ces données
             if(window.localStorage.getItem('heureSupp') !== "undefined" &&  window.localStorage.getItem('heureSupp') !== null){
                this.heureSupp = window.localStorage.getItem('heureSupp');
             }
             if(window.localStorage.getItem('affichageHS') !== "undefined" &&  window.localStorage.getItem('affichageHS') !== null){
                this.affichageHS = window.localStorage.getItem('affichageHS');
             }
             if(window.localStorage.getItem('affichageConge') !== "undefined" &&  window.localStorage.getItem('affichageConge') !== null){
                this.affichageConge = window.localStorage.getItem('affichageConge');
             }
             if(window.localStorage.getItem('afficherFerier') !== "undefined" &&  window.localStorage.getItem('afficherFerier') !== null){
                this.afficherFerier = window.localStorage.getItem('afficherFerier');
             }
             //On résoud la promise
             resolve("Fini");
        }
     });
  }//getStats

  ionViewDidLoad() {
    console.log('Hello Accueil Page');
  }//ionViewDidLoad
}//AccueilPage
