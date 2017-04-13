import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

// Providers
import { ApiBddService } from '../../providers/api-bdd-service';
import { ConnectivityService } from '../../providers/connectivity-service';

//models
import { Demande } from '../../models/demande';

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
  demandes: Demande[]; // Tableau qui contient toutes les demandes
  isHorsLigne: boolean;
  isCheckDate: boolean;
  isCheckDatePasse: boolean;

  constructor(public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private abiBddCtrl: ApiBddService, private connectivityService: ConnectivityService) {
    this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1' || connectivityService.isOffline();
    this.isCheckDate = true;
    this.isCheckDatePasse = true;
    this.getDemandes();
  }//constructor

  ionViewDidLoad() {
    console.log('Hello Demandes Page');
  }//ionViewDidLoad

  saisirDemande() {
    this.faireChoixDemande();
  }//saisirDemande

  faireChoixDemande() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Choix de la demande');
    alert.addInput({
      type: 'radio',
      label: 'Demande de vacances/férié',
      id: '1',
      value: 'demandeVacances',
      name: 'vacances',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Congé de formation',
      id: '2',
      value: 'congeFormation',
      name: 'formation',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Congé paternité',
      id: '3',
      value: 'congePaternite',
      name: 'paternite',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Congé sans solde',
      id: '4',
      value: 'congeNoSolde',
      name: 'nosolde',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Demande de récupération',
      id: '5',
      value: 'congeRec',
      name: 'recuperation',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Autre demande',
      id: '6',
      value: 'autreDemande',
      name: 'autre',
      checked: false
    });
    alert.addButton('Annuler');
    alert.addButton({
      text: 'Confirmer',
      handler: data => {
        this.radioOpen = false;
        this.radioResult = data;
        if (data === "demandeVacances") {
          this.faireDemandeVacances();
        } else if (data === 'congeFormation') {
          this.faireDemandeConge(2);
        } else if (data === "congePaternite") {
          this.faireDemandeConge(3);
        } else if (data === "congeNoSolde") {
          this.faireDemandeConge(4);
        } else if (data === "congeRec") {
          this.faireDemandeRecuperation();
        } else if (data === "autreDemande") {
          this.faireDemandeInconnue();
        }
        else {
          console.log("RIEN!!!!!");
        }
      }
    });
    alert.present();
  }//faireChoixDemande

  faireDemandeVacances() {
    var today = new Date();
    var ajd = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    console.log('fairedemande');
    let prompt = this.alertCtrl.create({
      title: 'Demande de vacances et/ou férié',
      message: "Entrez vos dates et votre motif de demande de vacances/férié : ",
      inputs: [
        {
          name: 'DateDebVac',
          value:ajd,
          type: 'Date',
          id: 'dateDeb',
        },
        {
          name: 'DateFinVac',
          type: 'Date',
          value: ajd,
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
            this.faireCheckDate(data.DateDebVac, data.DateFinVac); //Vérifier que les dates ne soient pas incohérentes
            if (this.isCheckDate) {
              this.faireCheckDatePassee(data.DateDebVac); // Vérifier que les dates ne sont pas dans le passé
              if (this.isCheckDatePasse) {
                this.enregsitrerDemande(1, data.DateDebVac, data.DateFinVac, data.Motif);
                console.log(1, data.DateDebVac, data.DateFinVac, data.Motif);
                this.getDemandes();
              } else {
                this.faireAlertePasOkDatePassee();
              }
            } else {
              this.faireAlertePasOkDate();
            }
          }
        }
      ]
    });
    prompt.present();
  }//faireDemandeVacances

  faireDemandeConge(id) {
    var today = new Date();
    var ajd = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    let prompt = this.alertCtrl.create({
      title: 'Demande de congé',
      message: "Entrez vos dates de la demande de congé que vous avez séléctionnée : ",
      inputs: [
        {
          name: 'DateDebRec',
          type: 'Date',
          value: ajd,
          id: 'dateDeb'
        },
        {
          name: 'DateFinRec',
          type: 'Date',
          value: ajd,
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
            this.faireCheckDate(data.DateDebRec, data.DateFinRec); //Vérifier que les dates ne soient pas incohérentes
            if (this.isCheckDate) {
              this.faireCheckDatePassee(data.DateDebRec); //Vérifier que les dates ne sont pas dans le passé
              if (this.isCheckDatePasse) {
                console.log('Confirmer');
                this.enregsitrerDemande(id, data.DateDebRec, data.DateFinRec, "");
                console.log(id, data.DateDebRec, data.DateFinRec);
                this.getDemandes();
              } else {
                this.faireAlertePasOkDatePassee();
              }
            } else {
              this.faireAlertePasOkDate();
            }
          }
        }
      ]
    });
    prompt.present();
  }//faireDemandeRecuperation

  faireDemandeRecuperation() {
    var today = new Date();
    var ajd = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    let prompt = this.alertCtrl.create({
      title: 'Demande de récupération',
      message: "Entrez vos dates de la demande de récupération : ",
      inputs: [
        {
          name: 'DateDebRec',
          type: 'Date',
          value: ajd,
          id: 'dateDeb'
        },
        {
          name: 'DateFinRec',
          type: 'Date',
          value: ajd,
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
            this.faireCheckDate(data.DateDebRec, data.DateFinRec); //Vérifier que les dates ne soient pas incohérentes
            if (this.isCheckDate) {
              this.faireCheckDatePassee(data.DateDebRec);// Vérifier que les dates ne sont pas dans le passé
              if (this.isCheckDatePasse) {
                console.log('Confirmer');
                this.enregsitrerDemande(5, data.DateDebRec, data.DateFinRec, "");
                console.log(5, data.DateDebRec, data.DateFinRec);
                this.getDemandes();
              } else {
                this.faireAlertePasOkDatePassee();
              }
            } else {
              this.faireAlertePasOkDate();
            }

          }
        }
      ]
    });
    prompt.present();
  }//faireDemandeRecuperation

  faireDemandeInconnue() {
    var today = new Date();
    var ajd = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    let prompt = this.alertCtrl.create({
      title: 'Demande spéciale',
      message: "Entrez vos dates et le motif de la demande : ",
      inputs: [
        {
          name: 'DateDebInconnue',
          type: 'Date',
          value: ajd,
          id: 'dateDeb'
        },
        {
          name: 'DateFinRecInconne',
          type: 'Date',
          value: ajd,
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
            this.faireCheckDate(data.DateDebInconnue, data.DateFinRecInconne); //Vérifier que les dates ne soient pas incohérentes
            if (this.isCheckDate) {
              this.faireCheckDatePassee(data.DateDebInconnue); //Vérifier que les dates ne sont pas dans le passé
              if (this.isCheckDatePasse) {
                console.log('Confirmer');
                this.enregsitrerDemande(6, data.DateDebInconnue, data.DateFinRecInconne, data.MotifInconnue);
                console.log(6, data.DateDebInconnue, data.DateFinRecInconne, data.MotifInconnue);
                this.getDemandes();
              } else {
                this.faireAlertePasOkDatePassee();
              }
            } else {
              this.faireAlertePasOkDate();
            }
          }
        }
      ]
    });
    prompt.present();
  }//faireDemandeInconnue

  enregsitrerDemande(typeDemId, dateDebut: string, dateFin: string, motif: string) {
    // setDemande(userId:string, token:string, demId:string, dateDebut: string, dateFin:string, motif:string
    this.abiBddCtrl.setDemande(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), typeDemId, dateDebut, dateFin, motif).subscribe(
      data => {
        if (data) {  // OK         
          console.log("Demande enregsitrée"); // Traiter le cas où c'est ok : un toast par exemple
          this.faireToastOk();
        } else { // Erreur
          console.log("Enregsitrement échoue : token ou ID"); // Traiter le cas oû c'est pas OK : une alerte...
          this.faireAlertePasOk();
        }
      });
  }//enregsitrerDemande

  modifierDemandeAlert(demande) {
    var jjDeb = ('0' + demande.dateDebut.getDate()).slice(-2);
    var mmDeb = ('0' + (demande.dateDebut.getMonth() + 1)).slice(-2);
    var yyyyDeb = demande.dateDebut.getFullYear()
    var dateDebValue = yyyyDeb + '-' + mmDeb + '-' + jjDeb;

    var jjFin = ('0' + demande.dateFin.getDate()).slice(-2);
    var mmFin = ('0' + (demande.dateFin.getMonth() + 1)).slice(-2);
    var yyyyFin = demande.dateFin.getFullYear()
    var dateFinValue = yyyyFin + '-' + mmFin + '-' + jjFin;

    if (demande.statut === 'new' || demande.statut === 'modify') { // Traiter la modification lorsque la demande est "new" ou "modify"
      let prompt = this.alertCtrl.create({
        title: 'Modification des dates la demande',
        subTitle: 'Type de demande :' + demande.nom_typeDemande,
        inputs: [
          {
            name: 'NewDebut',
            value: dateDebValue,
            id: 'dateDebNew',
            type: 'Date',
          },
          {
            name: 'DateFinNew',
            value: dateFinValue,
            id: 'dateFinNew',
            type: 'Date'
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
              this.faireCheckDate(data.NewDebut, data.DateFinNew); //Vérifier que les dates ne soient pas incohérentes
              if (this.isCheckDate) {
                this.faireCheckDatePassee(data.NewDebut);//Vérifier que les dates ne sont pas dans le passé
                if (this.isCheckDatePasse) {
                  console.log(demande.id, data.NewDebut, data.DateFinNew, data.MotifNew);
                  this.modifierDemande(demande.id, data.NewDebut, data.DateFinNew, data.MotifNew);
                  this.getDemandes();
                } else {
                  this.faireAlertePasOkDatePassee();
                }
              } else {
                this.faireAlertePasOkDate();
              }
            }
          }
        ]
      });
      prompt.present();
    } else { // Traiter le cas ou la demande a déjà été validée par le gérant
      let alert = this.alertCtrl.create({
        title: 'Votre demande a déjà été traité, vous ne pouvez pas la modifier',
        buttons: ['Fermer']
      });
      alert.present();
    }
  }//modifierDemandeAlert

  modifierDemande(demId, dateDebut: string, dateFin: string, motif: string) {
    // setDemande(userId:string, token:string, demId:string, dateDebut: string, dateFin:string, motif:string
    this.abiBddCtrl.modDemande(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), demId, dateDebut, dateFin, motif).subscribe(
      data => {
        if (data) {  // OK         
          console.log("Modification enregsitrée"); // Traiter le cas où c'est ok : un toast par exemple
          this.faireToastOk();
        } else { // Erreur
          console.log("Enregsitrement échoue : token ou ID"); // Traiter le cas oû c'est pas OK : une alerte...
          this.faireAlertePasOk();
        }
      });
  }//enregsitrerDemande

  //Récupère la liste des demandes
  getDemandes() {
    if (!this.isHorsLigne) {
      this.abiBddCtrl.getDemandes(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD')).subscribe(
        data => {
          if (data) { // Si les données sont bien chargées    
            this.demandes = [];
            for (let i = 0; i < data.length; i++) { //Remplissage du tableau demandes avec les données formatées
              let demande = new Demande(data[i].id,
                new Date(data[i].dateDebut),
                new Date(data[i].dateFin),
                data[i].motif,
                data[i].statut,
                data[i].id_typeDemande,
                data[i].nom_typeDemande
              );
              this.demandes.push(demande); // On ajoute l'horaire au tableau
              window.localStorage.setItem('getDemandes', JSON.stringify(this.demandes));  // Création de la sauvegarde locale
            }
            console.log(this.demandes);
          } else { // Erreur
            console.log("Aucune demande à afficher");
          }
        });
    } else {
      console.log("Mode hors ligne");
      this.demandes = JSON.parse(window.localStorage.getItem('getDemandes'));
    }
  }//getDemandes

  faireCheckDate(dateDebutCheck, dateFinCheck) { //Vérifier que les dates ne soient pas incohérentes
    console.log("je me fait check");
    if (dateDebutCheck <= dateFinCheck) {
      this.isCheckDate = true;
    } else {
      this.isCheckDate = false;
    }
  }//faireCheckDate

  faireCheckDatePassee(dateDebutChek) {
    var today = new Date();
    var ajd = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    if (dateDebutChek >= ajd) {
      this.isCheckDatePasse = true;
    } else {
      this.isCheckDatePasse = false;
    }

  }//faireCheckDatePassee

  //Alertes pour les checks

  faireToastOk() {
    let toast = this.toastCtrl.create({
      message: `Demande enregistrée`,
      duration: 2000,
      cssClass: "yourCssClassName",
    });
    toast.present();
  }//faireToastOk

  faireAlertePasOk() {
    let alert = this.alertCtrl.create({
      title: 'Demande non enregistrée',
      subTitle: 'Recommencez votre demande.',
      buttons: ['Fermer']
    });
    alert.present();
  }//faireAlertePasOk

  faireAlertePasOkDate() {
    let alert = this.alertCtrl.create({
      title: 'Demande non enregistrée',
      subTitle: 'Vos dates ne sont pas cohérentes.',
      buttons: ['Fermer']
    });
    alert.present();
  }//faireAlertePasOk

  faireAlertePasOkDatePassee() {
    let alert = this.alertCtrl.create({
      title: 'Demande non enregistrée',
      subTitle: 'Vos dates sont dans le passé.',
      buttons: ['Fermer']
    });
    alert.present();
  }//faireAlertePasOk

}
