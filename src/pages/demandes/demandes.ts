import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { SaisiedemandePage } from '../saisiedemande/saisiedemande';

// Providers
import { ApiBddService } from '../../providers/api-bdd-service';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private abiBddCtrl: ApiBddService) { 
    // POUR CELINE : exemple d'appel de la fonction enregsitrerDemande (tu peux effacer tout ça quant tu n'en a plus besoin)
    /* demId : l’id de la demande:
        1: Vacances/Férié
        2: Congé de formation
        3: Congé paternité
        4: Congé sans solde
        5: Congé sans solde
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

     // Demande Congé sans solde
    // this.enregsitrerDemande(5, "2017-07-10", "2017-07-20", "");

    // Autre demande
    // this.enregsitrerDemande(6, "2017-08-10", "2017-08-20", "Je suis fatigué");

    
  }

  ionViewDidLoad() {
    console.log('Hello Demandes Page');
  }

  saisirDemande() {
    this.navCtrl.push(SaisiedemandePage, null);
  }

  faireDemandeVacances() {
    let prompt = this.alertCtrl.create({
      title: 'Demande de vacances et/ou férié',
      message: "Entrez vos dates et votre motif de demande de vacances/férié : ",
      inputs: [
        {
          name: 'DateDebVac',
          type: 'number',
          placeholder: 'Date de début : sous forme JJ.MM.YYYY',
          id: 'dateDeb'
        },
        {
          name: 'DateFinVac',
          type: 'number',
          placeholder: 'Date de fin : sous forme JJ.MM.YYYY',
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
            this.RecuperationDonnes();
            console.log('Confirmer');
          }
        }
      ]
    });
    prompt.present();
  }//faireDemandeVacances

  faireDemandeConge() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Demande de Congé');

    alert.addInput({
      type: 'radio',
      label: 'Congé de formation',
      id : 'type',
      value: 'congeFormation',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Congé paternité',
      id : 'type',
      value: 'congePat',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Congé sans solde',
      id : 'type',
      value: 'congeNoSolde',
      checked: false
    });
    alert.addButton('Annuler');
    alert.addButton({
      text: 'Confirmer',
      handler: data => {
        this.radioOpen = false;
        this.radioResult = data;
        this.faireDemandeCongeSuite();
      }
    });
    alert.present();
  }//faireDemandeConge

  faireDemandeCongeSuite() {
    let prompt = this.alertCtrl.create({
      title: 'Demande de Congé',
      message: "Entrez vos dates de la demande de congé que vous avez séléctionnée : ",
      inputs: [
        {
          name: 'DateDebRec',
          type: 'number',
          placeholder: 'Date de début : sous forme JJ.MM.YYYY',
          id: 'dateDeb'
        },
        {
          name: 'DateFinRec',
          type: 'number',
          placeholder: 'Date de fin : sous forme JJ.MM.YYYY',
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
            this.RecuperationDonnes();
            console.log('Confirmer');
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
          type: 'number',
          placeholder: 'Date de début : sous forme JJ.MM.YYYY',
          id: 'dateDeb'
        },
        {
          name: 'DateFinRec',
          type: 'number',
          placeholder: 'Date de fin : sous forme JJ.MM.YYYY',
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
            this.RecuperationDonnes();
            console.log('Confirmer');
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
          type: 'number',
          placeholder: 'Date de début : sous forme JJ.MM.YYYY',
          id: 'dateDeb'
        },
        {
          name: 'DateFinRecInconne',
          type: 'number',
          placeholder: 'Date de fin : sous forme JJ.MM.YYYY',
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
            this.RecuperationDonnes();
            console.log('Confirmer');
          }
        }
      ]
    });
    prompt.present();
  }//faireDemandeInconnue

  // TODO Céline : les noms de fonction commencent par une lettre minuscule
  RecuperationDonnes(){
    var type = document.getElementById("type");
    var dateDebut = document.getElementById("dateDeb");
    var dateFin = document.getElementById("dateFin");
    var motif = document.getElementById("motif");
  }



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
  enregsitrerDemande(demId, dateDebut:string, dateFin:string, motif:string){  
    // setDemande(userId:string, token:string, demId:string, dateDebut: string, dateFin:string, motif:string
    this.abiBddCtrl.setDemande(window.localStorage.getItem('id'),window.localStorage.getItem('tokenBDD'), demId, dateDebut, dateFin, motif).subscribe(        
      data => {
           if(data) {  // OK         
              console.log("Demande enregsitrée"); // Traiter le cas où c'est ok : un toast par exemple
             } else { // Erreur
                 console.log("Enregsitrement échoue : token ou ID"); // Traiter le cas oû c'est pas OK : une alerte...
             }
        });
  }//enregsitrerDemande
}
