import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { SaisiedemandePage } from '../saisiedemande/saisiedemande';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) { }

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

  RecuperationDonnes(){
    var type = document.getElementById("type");
    var dateDebut = document.getElementById("dateDeb");
    var dateFin = document.getElementById("dateFin");
    var motif = document.getElementById("motif");
  }
}
