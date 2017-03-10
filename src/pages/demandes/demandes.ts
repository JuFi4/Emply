import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { SaisiedemandePage } from '../saisiedemande/saisiedemande';

// Providers
import { ApiBddService } from '../../providers/api-bdd-service';

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

  constructor(public toastCtrl : ToastController, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private abiBddCtrl: ApiBddService) { 
    // POUR CELINE : exemple d'appel de la fonction enregsitrerDemande (tu peux effacer tout ça quant tu n'en a plus besoin)
    /* typeDemId : l’id du type de la demande:
        1: Vacances/Férié
        2: Congé de formation
        3: Congé paternité
        4: Congé sans solde
        5: Récupération
        6: Autre demande
   */
    // Demande Vacances/Férié
    // this.enregsitrerDemande(1, "2017-03-10", "2017-03-20", "");

     // Demande Congé de formation
     // this.enregsitrerDemande(2, "2017-04-10", "2017-04-20", "");

     // Demande Congé paternité
    // this.enregsitrerDemande(3, "2017-05-10", "2017-05-20", "");

     // Demande Congé sans solde
     // this.enregsitrerDemande(4, "2017-06-10", "2017-06-20", "");

     // Demande Récupération
    // this.enregsitrerDemande(5, "2017-07-10", "2017-07-20", "");

    // Autre demande
    // this.enregsitrerDemande(6, "2017-08-10", "2017-08-20", "Je suis fatigué");

    // POUR CELINE : exemple d'appel de la fonction modifierDemande
    // Attention: il faut récupérer l'ID de la demande !
    //  this.modifierDemande(1, "2017-03-10", "2017-03-20", "Salut");

    // POUR CELINE 
    // Récupère les demandes et les range dans this.demandes
     this.getDemandes();
  }//constructor

  ionViewDidLoad() {
    console.log('Hello Demandes Page');
  }

  saisirDemande() {
    this.faireChoixDemande();
    //this.navCtrl.push(SaisiedemandePage, null);
    //console.log('saisir demande');
  }

  faireChoixDemande(){
    let alert = this.alertCtrl.create();
    alert.setTitle('Choix de la Demande');
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
      label: 'Demande de Récupération',
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
        console.log("HEY!!!! Je suis CONFIRMER!!!!");
        console.log("radioResult" + this.radioResult);
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
      title: 'Demande de Congé',
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
      title: 'Demande de Récupération',
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
      title: 'Demande Spéciale',
      message: "Entrez vos dates et le motif de la demande : ",
      inputs: [
        {
          name: 'DateDebInconnue',
          type: 'Date',
          placeholder: 'Date de début : sous forme AAAA-MM-JJ',
          id: 'dateDeb'
        },
        {
          name: 'DateFinRecInconne',
          type: 'Date',
          placeholder: 'Date de fin : sous forme AAAA-MM-JJ',
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

  /* TODO CELINE : : traiter l'enregistrement de la semande :
     - 1)  Appeller la fonction enregsitrerDemande() avec les bons paramètres 
                -(demId) selon le type de demande
                - dateDebut
                - dateFin
                - motif (si il n'y a pas de motif, tu peux mettre une chaine vide)
    
      -2) Traiter le résultat de l'API : 
          - Si la demande est bien enregsitrée (le "if(data)"" dans le code) : trouver comment traiter cela : l'idéal serait eu toast
          - sinon (le "else" dans le code) cela signifie que l'enregsitrement n'a pas fonctionné 
                -> Trouver comment traiter cela : message d'erreur... 
      */   

  /* demId : l’id de la demande:
        1: Vacances/Férié
        2: Congé de formation
        3: Congé paternité
        4: Congé sans solde
        5: Récupération
        6: Autre demande
   */

    faireToastOk(){
    let toast = this.toastCtrl.create({
      message: `Demande enregistrée`,
      duration: 2000,
      cssClass: "yourCssClassName",
    });
    toast.present();
  }

  faireAlertePasOk(){
  let alert = this.alertCtrl.create({
    title: 'Demande non enregistrée',
    subTitle: 'Recommencez votre demande.',
    buttons: ['Fermer']
  });
  alert.present();
  }
  
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

  modifierDemande(demId, dateDebut:string, dateFin:string, motif:string){  
    // setDemande(userId:string, token:string, demId:string, dateDebut: string, dateFin:string, motif:string
    this.abiBddCtrl.modDemande(window.localStorage.getItem('id'),window.localStorage.getItem('tokenBDD'), demId, dateDebut, dateFin, motif).subscribe(        
      data => {
           if(data) {  // OK         
              console.log("Modification enregsitrée"); // Traiter le cas où c'est ok : un toast par exemple
             } else { // Erreur
                 console.log("Enregsitrement échoue : token ou ID"); // Traiter le cas oû c'est pas OK : une alerte...
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
