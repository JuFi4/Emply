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
  idDepartement : String;
  infosContrat : InfosContrat;
  soldeEmploye : SoldeEmploye;
  heureSupp : number;
  nbHeureParSem : number;
  affichageHS : String;
  affichageConge : String;
  afficherFerier : String;
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

    // On sync les horaires (calendrier + notification ) ensuite: en récupère les stats, et quand c'est fini, on arrête l'affichage de l'icone de chargement
    syncHoraireCtrl.manangeSync().then(result => this.getStats()).then(result => loader.dismiss());
  }//constructor
  
  getStats(){
    return new Promise((resolve, reject) => {
      console.log("getStats"); 
      if(!this.isHorsLigne) {   
          this.apiBddService.getIdDepartement(window.localStorage.getItem('id'),window.localStorage.getItem('tokenBDD')).subscribe(
                                  dep => {
                                    if(dep) { 
                                      this.idDepartement = dep;                                     
                                      console.log("getIdDepartement : " + window.localStorage.getItem('getDepartement'));
                                    } else { // Erreur
                                      console.log("Pas ok");
                                  }
                            });


          this.apiBddService.getIdEtablissement(window.localStorage.getItem('id'),window.localStorage.getItem('tokenBDD'),window.localStorage.getItem('getDepartement')).subscribe(
                                  eta => {
                                    if(eta) { 
                                      this.idEtablissement = eta;
                                      console.log("idEtablissement : " + this.idEtablissement);                                    
                                    } else { // Erreur
                                      console.log("Pas ok");
                                  }
                            });


            this.apiBddService.getInfosSolde(window.localStorage.getItem('id'), this.annneeCourrante+"-01-01",this.annneeCourrante+"-12-31",window.localStorage.getItem('tokenBDD'),).subscribe(
                      dataInfoSolde => {
                            if(dataInfoSolde) { 
                                this.dataInfoUser = new InfoHeureUser(
                                  dataInfoSolde.brut.time,
                                  dataInfoSolde.totalPause.time,
                                  dataInfoSolde.net.time, 
                                  dataInfoSolde.conges
                                ) 
                                console.log("dataInfoUser");
                                console.log(this.dataInfoUser);  
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
                                      console.log("------Coucou info personne------");                                                               
                                      console.log("dataInfo");
                                      console.log(this.infoEta.droitVacanceAnnee);
                                      var heureFerier = (this.infoEta.jourPrisFer+this.soldeEmploye.soldeFerier) - this.infoEta.jourPrisFer;
                                      var heureVac = (this.infoEta.jourPrisVac+ this.soldeEmploye.soldeVacance) - this.infoEta.jourPrisVac;
                                      
                                      //si il c'est un contrat en pourcentage on fait fois le nombre d'heures de l'étabalissement
                                      //sinon, on met les horaires normaux
                                      console.log(this.infosContrat.type);
                                      if(this.infosContrat.type == 2){
                                        this.affichageHS = this.infoEta.heureSemaine*this.infosContrat.nbHeure +" H/Semaine";
                                      }else{
                                        this.affichageHS = this.infosContrat.nbHeure + " H/Semaine";
                                      }
                                      console.log(this.affichageHS);
                                      window.localStorage.setItem('affichageHS', JSON.stringify(this.affichageHS));//Sauvegarde pour mode hors ligne
                                      this.affichageConge = heureVac +"/"+this.infoEta.droitVacanceAnnee;
                                      window.localStorage.setItem('affichageConge', JSON.stringify(this.affichageConge));//Sauvegarde pour mode hors ligne
                                      console.log(this.affichageConge);
                                      this.afficherFerier = heureFerier +"/"+ this.infoEta.droitJourFerieAnnee 
                                      window.localStorage.setItem('afficherFerier', JSON.stringify(this.afficherFerier)); //Sauvegarde pour mode hors ligne
                                      console.log( this.afficherFerier);
                                    } else { // Erreur
                                      console.log("Pas ok");
                                    }
                            });

          this.apiBddService.getTypeHoraireContrat(window.localStorage.getItem('id'),window.localStorage.getItem('tokenBDD')).subscribe(
                                typeContratH => {
                                  if(typeContratH) { // OK
                                    console.log(typeContratH)  
                                    this.infosContrat = new InfosContrat(
                                          typeContratH[0].conParticularite,
                                          typeContratH[0].idHor,
                                    )
                                    console.log("---- HELLOOO ------");      
                                    console.log(this.infosContrat.nbHeure);
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
                                    console.log("-----HELLO LOOOG");
                                    this.heureSupp = this.soldeEmploye.soldeHeure;                                     
                                    window.localStorage.setItem('heureSupp', JSON.stringify(this.heureSupp));//Sauvegarde pour mode hors ligne
                                    console.log(this.soldeEmploye.soldeHeure);                                                                  
                                    console.log("soldeEmploye");
                                  } else { // Erreur
                                    console.log("Pas ok");
                                  }
                });
      
        } else { // Si on est hors ligne          
            // TODO VANESSA : si tu rajoute des variables pour l'affichage, tu peux leur faire leur traitement pour le mode hors ligne, ou me le dire pour que je le fasse ???
            //On regarde si les données à afficher existent en sauvegarde locale, et si oui on affichera ces données
             if(window.localStorage.getItem('heureSupp') !== "undefined" &&  window.localStorage.getItem('heureSupp') !== null){
                this.heureSupp = parseInt(window.localStorage.getItem('heureSupp'));
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
        }
        // Dans tous les cas : on résoud la promise
         resolve("Fini");
     });
  }//getStats


  ionViewDidLoad() {
    console.log('Hello Accueil Page');
  }
}
