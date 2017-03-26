import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { SaisiedemandePage } from '../saisiedemande/saisiedemande';

// Providers
import { ApiBddService } from '../../providers/api-bdd-service';
import { ConnectivityService } from '../../providers/connectivity-service';

//models
import {Demande} from '../../models/demande';

/*
  Generated class for the Demandes page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-demandes',
  templateUrl: 'demandes.html'
})
export class DemandesPage {
  radioOpen: boolean;
  radioResult;
  demandes : Demande[]; // Tableau qui contient toutes les demandes
  isHorsLigne : boolean;
  
  constructor(public toastCtrl : ToastController, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private abiBddCtrl: ApiBddService, private connectivityService: ConnectivityService) { 
    this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1' || connectivityService.isOffline();
     this.getDemandes();
  }//constructor

  ionViewDidLoad() {
    console.log('Hello Demandes Page');
  }//ionViewDidLoad

  saisirDemande() {
    this.faireChoixDemande();
  }//saisirDemande

  faireChoixDemande(){
    let alert = this.alertCtrl.create();
    alert.setTitle('Choix de la demande');
    alert.addInput({
      type: 'radio',
      label: 'Demande de vacances/férié',
      id : '1',
      value: 'demandeVacances',
      name:'vacances',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Congé de formation',
      id : '2',
      value: 'congeFormation',
      name:'formation',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Congé paternité',
      id : '3',
      value: 'congePaternite',
      name:'paternite',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Congé sans solde',
      id : '4',
      value: 'congeNoSolde',
      name:'nosolde',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Demande de récupération',
      id : '5',
      value: 'congeRec',
      name:'recuperation',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Autre demande',
      id : '6',
      value: 'autreDemande',
      name:'autre',
      checked: false
    });
    alert.addButton('Annuler');
    alert.addButton({
      text: 'Confirmer',
      handler: data => {
        this.radioOpen = false;
        this.radioResult = data;
        if (data === "demandeVacances"){
          this.faireDemandeVacances();
        }else if(data === 'congeFormation'){
          this.faireDemandeConge(2);
        }else if(data === "congePaternite"){
          this.faireDemandeConge(3);
        }else if(data === "congeNoSolde"){
          this.faireDemandeConge(4);
        }else if(data === "congeRec"){
          this.faireDemandeRecuperation();
        }else if(data === "autreDemande"){
          this.faireDemandeInconnue();
        }
        else{
          console.log("RIEN!!!!!");
        }
      }
    });
    alert.present();    
  }//faireChoixDemande

  faireDemandeVacances() {
   console.log('fairedemande');
    let prompt = this.alertCtrl.create({
      title: 'Demande de vacances et/ou férié',
      message: "Entrez vos dates et votre motif de demande de vacances/férié : ",
      inputs: [
        {
          name: 'DateDebVac',
          type: 'Date',
          placeholder: 'Date de début : sous forme AAAA-MM-JJ',
          id: 'dateDeb',
        },
        {
          name: 'DateFinVac',
          type: 'Date',
          placeholder: 'Date de fin : sous forme AAAA-MM-JJ',
          id: 'dateFin'
        },
        {
          name: 'Motif',
          placeholder: 'Motif de la demande',
          id: 'motif'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Annuler');
          }
        },
        {
          text: 'Confirmer',
          handler: data => {
            console.log('Confirmer');
            this.enregsitrerDemande(1, data.DateDebVac, data.DateFinVac, data.Motif);
            console.log(1, data.DateDebVac, data.DateFinVac, data.Motif);
          }
        }
      ]
    });
    prompt.present();
  }//faireDemandeVacances

  faireDemandeConge(id) {
    let prompt = this.alertCtrl.create({
      title: 'Demande de congé',
      message: "Entrez vos dates de la demande de congé que vous avez séléctionnée : ",
      inputs: [
        {
          name: 'DateDebRec',
          type: 'Date',
          placeholder: 'Date de début : sous forme AAAA-MM-JJ',
          id: 'dateDeb'
        },
        {
          name: 'DateFinRec',
          type: 'Date',
          placeholder: 'Date de fin : sous forme AAAA-MM-JJ',
          id: 'dateFin'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Annuler');
          }
        },
        {
          text: 'Confirmer',
          handler: data => {
            console.log('Confirmer');
            this.enregsitrerDemande(id, data.DateDebRec, data.DateFinRec, "");
            console.log(id, data.DateDebRec, data.DateFinRec);
          }
        }
      ]
    });
    prompt.present();
  }//faireDemandeRecuperation

  faireDemandeRecuperation() {
    let prompt = this.alertCtrl.create({
      title: 'Demande de récupération',
      message: "Entrez vos dates de la demande de récupération : ",
      inputs: [
        {
          name: 'DateDebRec',
          type: 'Date',
          placeholder: 'Date de début : sous forme AAAA-MM-JJ',
          id: 'dateDeb'
        },
        {
          name: 'DateFinRec',
          type: 'Date',
          placeholder: 'Date de fin : sous forme AAAA-MM-JJ',
          id: 'dateFin'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Annuler');
          }
        },
        {
          text: 'Confirmer',
          handler: data => {
            console.log('Confirmer');
            this.enregsitrerDemande(5, data.DateDebRec, data.DateFinRec, "");
            console.log(5, data.DateDebRec, data.DateFinRec);
            
          }
        }
      ]
    });
    prompt.present();
  }//faireDemandeRecuperation

  faireDemandeInconnue() {
    let prompt = this.alertCtrl.create({
      title: 'Demande spéciale',
      message: "Entrez vos dates et le motif de la demande : ",
      inputs: [
        {
          name: 'DateDebInconnue',
          type: 'Date',
          placeholder: 'Date de début',
          id: 'dateDeb'
        },
        {
          name: 'DateFinRecInconne',
          type: 'Date',
          placeholder: 'Date de fin',
          id: 'dateFin'
        },
       {
          name: 'MotifInconnue',
          placeholder: 'Motif de la demande',
          id: 'motif'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
          console.log('Annuler');
          }
        },
        {
          text: 'Confirmer',
          handler: data => {
         console.log('Confirmer');
         this.enregsitrerDemande(6, data.DateDebInconnue, data.DateFinRecInconne, data.MotifInconnue);
         console.log(6, data.DateDebInconnue, data.DateFinRecInconne, data.MotifInconnue);
          }
        }
      ]
    });
    prompt.present();
  }//faireDemandeInconnue

    faireToastOk(){
    let toast = this.toastCtrl.create({
      message: `Demande enregistrée`,
      duration: 2000,
      cssClass: "yourCssClassName",
    });
    toast.present();
  }//faireToastOk

  faireAlertePasOk(){
  let alert = this.alertCtrl.create({
    title: 'Demande non enregistrée',
    subTitle: 'Recommencez votre demande.',
    buttons: ['Fermer']
  });
  alert.present();
  }//faireAlertePasOk
  
  enregsitrerDemande(typeDemId, dateDebut:string, dateFin:string, motif:string){  
    // setDemande(userId:string, token:string, demId:string, dateDebut: string, dateFin:string, motif:string
    this.abiBddCtrl.setDemande(window.localStorage.getItem('id'),window.localStorage.getItem('tokenBDD'), typeDemId, dateDebut, dateFin, motif).subscribe(        
      data => {
           if(data) {  // OK         
              console.log("Demande enregsitrée"); // Traiter le cas où c'est ok : un toast par exemple
              this.faireToastOk();
             } else { // Erreur
                 console.log("Enregsitrement échoue : token ou ID"); // Traiter le cas oû c'est pas OK : une alerte...
                 this.faireAlertePasOk();
             }
        });
  }//enregsitrerDemande

  modifierDemandeAlert(demande){
    if(demande.statut === 'new' || demande.statut==='modify'){ // Traiter la modification lorsque la demande est "new" ou "modify"
      let prompt = this.alertCtrl.create({
      title: 'Modification des dates la demande',
      subTitle: 'Type de demande :' +  demande.nom_typeDemande,
      message : 'Du ' + demande.affichageDateDebut + ' au ' + demande.affichageDateFin,
      inputs: [
        {
          name: 'NewDebut',
          type: 'Date',
          placeholder: 'Date de début',
          id: 'dateDebNew'
        },
        {
          name: 'DateFinNew',
          type: 'Date',
          placeholder: 'Date de fin',
          id: 'dateFinNew'
        },
       {
          name: 'MotifNew',
          placeholder: 'Motif de la modification',
          id: 'motif',
          value: demande.motif,
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
          console.log('Annuler');
          }
        },
        {
          text: 'Confirmer',
          handler: data => {
         console.log('Confirmer');
         console.log(demande.id, data.NewDebut, data.DateFinNew, data.MotifNew);
         this.modifierDemande(demande.id, data.NewDebut, data.DateFinNew, data.MotifNew);
         this.getDemandes();
          }
        }
      ]
      });
      prompt.present();
    } else{ // Traiter le cas ou la demande a déjà été validée par le gérant
      let alert = this.alertCtrl.create({
      title: 'Votre demande a déjà été traité, vous ne pouvez pas la modifier',
      buttons: ['Fermer']
      });
      alert.present();
    }
  }//modifierDemandeAlert

  modifierDemande(demId, dateDebut:string, dateFin:string, motif:string){  
    // setDemande(userId:string, token:string, demId:string, dateDebut: string, dateFin:string, motif:string
    this.abiBddCtrl.modDemande(window.localStorage.getItem('id'),window.localStorage.getItem('tokenBDD'), demId, dateDebut, dateFin, motif).subscribe(        
      data => {
           if(data) {  // OK         
              console.log("Modification enregsitrée"); // Traiter le cas où c'est ok : un toast par exemple
              this.faireToastOk();
             } else { // Erreur
                 console.log("Enregsitrement échoue : token ou ID"); // Traiter le cas oû c'est pas OK : une alerte...
                 this.faireAlertePasOk();
             }
        });
  }//enregsitrerDemande

  //Récupère la liste des demandes
  getDemandes(){
      this.abiBddCtrl.getDemandes(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD')).subscribe(
        data => {  
           if(data) { // Si les données sont bien chargées    
                this.demandes = [];
                for(let i = 0; i < data.length; i++){ //Remplissage du tableau demandes avec les données formatées
                    let demande =  new Demande(data[i].id, 
                      new Date(data[i].dateDebut), 
                      new Date(data[i].dateFin), 
                      data[i].motif, 
                      data[i].statut, 
                      data[i].id_typeDemande, 
                      data[i].nom_typeDemande
                    );                    
                    this.demandes.push(demande); // On ajoute l'horaire au tableau
                }
                console.log(this.demandes);
             } else { // Erreur
                 console.log("Aucune demande à afficher");
             }
        }); 
    }//getDemandes
}
