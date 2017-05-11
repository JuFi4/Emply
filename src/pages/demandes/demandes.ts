import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

// Providers
import { ApiBddService } from '../../providers/api-bdd-service';
import { ConnectivityService } from '../../providers/connectivity-service';
import { AlertsToasts } from '../../providers/alerts-toasts';

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
  isCheckHeure : boolean;

  constructor(public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, 
              public alertCtrl: AlertController, private abiBddCtrl: ApiBddService, private connectivityService: ConnectivityService, private AlertsToasts: AlertsToasts) {
    this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1' || connectivityService.isOffline();
    this.isCheckDate = true;
    this.isCheckDatePasse = true;
    this.isCheckHeure = true;
    this.getDemandes();
  }//constructor

  ionViewDidLoad() {
    console.log('Hello Demandes Page');
  }//ionViewDidLoad

  saisirDemande() {
    this.faireChoixTypeJournee();
  }//saisirDemande

  faireChoixTypeJournee() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Choississez le type de congé');
    alert.addInput({
      type: 'radio',
      label: 'Journée complète',
      id: '1',
      value: 'complete',
      name: 'complete',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Demi-journée',
      id: '2',
      value: 'demi',
      name: 'demi',
      checked: false
    });
    alert.addButton('Annuler');
    alert.addButton({
      text: 'Confirmer',
      handler: data => {
        this.radioOpen = false;
        this.radioResult = data;
        if (data === "complete") {
          this.faireChoixDemande(1);
        } else if (data === 'demi') {
          this.faireChoixDemande(0);
        } else {
          console.log("RIEN!!!!!");
        }
      }
    });
    alert.present();
  }//faireChoixTypeJournee

  faireChoixDemande(idTypeDemande) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Choix de la demande');
    alert.addInput({
      type: 'radio',
      label: 'Demande de férié',
      id: '2',
      value: 'demandeConge',
      name: 'conge',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Demande de vacances',
      id: '3',
      value: 'demandeVacances',
      name: 'vacances',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Demande de congé militaire',
      id: '4',
      value: 'demandeMilitaire',
      name: 'militaire',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Demande de congé de formation',
      id: '5',
      value: 'demandeFormation',
      name: 'formation',
      checked: false
    });
    /*alert.addInput({
      type: 'radio',
      label: 'Demande de congé maternité',
      id: '6',
      value: 'demandeMaternite',
      name: 'maternite',
      checked: false
    });*/
    alert.addInput({
      type: 'radio',
      label: 'Congé pour cause de décès',
      id: '7',
      value: 'demandeDeces',
      name: 'deces',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Congé pour déménagement',
      id: '8',
      value: 'demandeDemenagement',
      name: 'demenagement',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Demande de congé paternité',
      id: '10',
      value: 'demandePaternite',
      name: 'paternite',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Autre Demande',
      id: '9',
      value: 'demandeAutre',
      name: 'autre',
      checked: false
    }); 
    /*alert.addInput({
      type: 'radio',
      label: 'Congé sans solde',
      id: '11',
      value: 'demandeSansSolde',
      name: 'sansSolde',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Demande de récupération',
      id: '12',
      value: 'demandeRecuperation',
      name: 'recuperation',
      checked: false
    });*/
    alert.addButton('Annuler');
    alert.addButton({
      text: 'Confirmer',
      handler: data => {
        this.radioOpen = false;
        this.radioResult = data;
        //Pour les journées complètes
        if (data === "demandeConge" && idTypeDemande === 1) {
          this.faireDemandeConge(2);
        } else if (data === 'demandeVacances' && idTypeDemande === 1) {
          this.faireDemandeConge(3);
        } else if (data === "demandeMilitaire" && idTypeDemande === 1) {
          this.faireDemandeConge(4);
        } else if (data === "demandeFormation" && idTypeDemande === 1) {
          this.faireDemandeConge(5);
        } /*else if (data === "demandeMaternite" && idTypeDemande === 1) {
          this.faireDemandeConge(6);
        } */else if (data === "demandeDeces" && idTypeDemande === 1) {
          this.faireDemandeConge(7);
        } else if (data === "demandeDemenagement" && idTypeDemande === 1) {
          this.faireDemandeConge(8);
        } else if (data === "demandeAutre" && idTypeDemande === 1) {
          this.faireDemandeConge(9);
        } else if (data === "demandePaternite" && idTypeDemande === 1) {
          this.faireDemandeConge(10);
        } /*else if (data === "demandeSansSolde" && idTypeDemande === 1) {
          this.faireDemandeConge(11);
        } else if (data === "demandeRecuperation" && idTypeDemande === 1) {
          this.faireDemandeConge(12);

          //Pour les demi journées
        } */else if (data === "demandeConge" && idTypeDemande === 0) {
          this.faireDemandeDemiConge(2);
        } else if (data === 'demandeVacances' && idTypeDemande === 0) {
          this.faireDemandeDemiConge(3);
        } else if (data === "demandeMilitaire" && idTypeDemande === 0) {
          this.faireDemandeDemiConge(4);
        } else if (data === "demandeFormation" && idTypeDemande === 0) {
          this.faireDemandeDemiConge(5);
        } /*else if (data === "demandeMaternite" && idTypeDemande === 0) {
          this.faireDemandeDemiConge(6);
        } */else if (data === "demandeDeces" && idTypeDemande === 0) {
          this.faireDemandeDemiConge(7);
        } else if (data === "demandeDemenagement" && idTypeDemande === 0) {
          this.faireDemandeDemiConge(8);
        } else if (data === "demandeAutre" && idTypeDemande === 0) {
          this.faireDemandeDemiConge(9);
        } else if (data === "demandePaternite" && idTypeDemande === 0) {
          this.faireDemandeDemiConge(10);
        } /*else if (data === "demandeSansSolde" && idTypeDemande === 0) {
          this.faireDemandeDemiConge(11);
        } else if (data === "demandeRecuperation" && idTypeDemande === 0) {
          this.faireDemandeDemiConge(12);
        } */else {
          console.log("RIEN!!!!!");
        }
      }
    });
    alert.present();
  }//faireChoixDemande

  faireDemandeConge(id) {
    var today = new Date();
    var ajd = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    let prompt = this.alertCtrl.create({
      title: 'Demande de congé',
      message: "Entrez les dates de la demande : ",
      inputs: [
        {
          name: 'DateDeb',
          type: 'Date',
          value: ajd,
          id: 'dateDeb'
        },
        {
          name: 'DateFin',
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
            this.faireCheckDate(data.DateDeb, data.DateFin); //Vérifier que les dates ne soient pas incohérentes
            if (this.isCheckDate) {
              this.faireCheckDatePassee(data.DateDeb); //Vérifier que les dates ne sont pas dans le passé
              if (this.isCheckDatePasse) {
                console.log('Confirmer');
                this.enregsitrerDemande(id, data.DateDeb, data.DateFin, 1,  data.Motif.trim());
                console.log(id, data.DateDeb, data.DateFin, data.Motif);                
              } else {
                this.AlertsToasts.faireAlertePasOkDatePassee();
              }
            } else {
              this.AlertsToasts.afficherAlertPasValide();
            }
          }
        }
      ]
    });
    prompt.present();
  }//faireDemandeConge

  faireDemandeDemiConge(id) {
    var today = new Date();
    var ajd = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    var heureDebut = ('0' + ( today.getHours())).slice(-2) + ':' + ('0' +  today.getMinutes()).slice(-2);
    var heureFin = ('0' + (today.getHours() + 1)).slice(-2)  + ':' + ('0' + today.getMinutes()).slice(-2);
    console.log(heureDebut);
    console.log(heureFin);
    let prompt = this.alertCtrl.create({
      title: 'Demande de congé',
      message: "Entrez les dates de la demande : ",
      inputs: [
        {
          name: 'DateDeb',
          type: 'Date',
          value: ajd,
          id: 'dateDeb'
        },
        {
          name: 'HeureDebut',
          type: 'Time',
          value: heureDebut,
          id: 'heureDeb'
        },
        {
          name: 'HeureFin',
          type: 'Time',
          value: heureFin,
          id: 'heureFin'
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
              this.faireCheckDatePassee(data.DateDeb); //Vérifier que les dates ne sont pas dans le passé
              if (this.isCheckDatePasse) {
                console.log('Confirmer');
                this.faireCheckheure(data.HeureDebut, data.HeureFin); //Vérifier que les heures ne soient pas incohérentes
                if(this.isCheckHeure){
                  this.enregsitrerDemande(id, data.DateDeb +" "+ data.HeureDebut, data.DateDeb +" "+ data.HeureFin, 0,data.Motif.trim());
                  console.log(id, data.DateDeb +" "+ data.HeureDebut, data.DateDeb +" "+ data.HeureFin, 0,data.Motif);
                }else{
                  this.AlertsToasts.faireAlerteHeuresPasOk();
                }
              } else {
                this.AlertsToasts.faireAlertePasOkDatePassee();
              }
          }
        }
      ]
    });
    prompt.present();
  }//faireDemandeDemiConge

  modifierDemandeAlert(demande) {
    var dateDebValue = demande.dateDebut.getFullYear() + '-' + ('0' + (demande.dateDebut.getMonth() + 1)).slice(-2) + '-' + ('0' + demande.dateDebut.getDate()).slice(-2);
    var dateFinValue = demande.dateFin.getFullYear() + '-' + ('0' + (demande.dateFin.getMonth() + 1)).slice(-2) + '-' + ('0' + demande.dateFin.getDate()).slice(-2);
    var heureDebut = ('0' + ( demande.dateDebut.getHours())).slice(-2) + ':' + ('0' +  demande.dateDebut.getMinutes()).slice(-2);
    var heureFin = ('0' + (demande.dateFin.getHours())).slice(-2) + ':' + ('0' + demande.dateFin.getMinutes()).slice(-2);
    if (demande.statut === 'new' || demande.statut === 'modify') {
      if (demande.isJourneeComplete) { // Traiter la modification lorsque la demande est "new" ou "modify"
        let prompt = this.alertCtrl.create({
          title: 'Modification des dates la demande',
          subTitle: 'Type de demande : ' + demande.nom_typeDemande,
          inputs: [
            {
              name: 'DateDebutNew',
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
                this.faireCheckDate(data.DateDebutNew, data.DateFinNew); //Vérifier que les dates ne soient pas incohérentes
                if (this.isCheckDate) {
                  this.faireCheckDatePassee(data.DateDebutNew);//Vérifier que les dates ne sont pas dans le passé
                  if (this.isCheckDatePasse) {
                    console.log(demande.id, data.DateDebutNew, data.DateFinNew, 1, data.MotifNew);
                    this.modifierDemande(demande.id, data.DateDebutNew, data.DateFinNew, 1, data.MotifNew.trim());
                  } else {
                    this.AlertsToasts.faireAlertePasOkDatePassee();
                  }
                } else {
                  this.AlertsToasts.afficherAlertPasValide();
                }
              }
            }
          ]
        });
        prompt.present();
      } else if (!demande.isJourneeComplete) {
        let prompt = this.alertCtrl.create({
          title: 'Modification des dates la demande',
          subTitle: 'Type de demande : ' + demande.nom_typeDemande,
          inputs: [
       {
              name: 'DateDebutNew',
              value: dateDebValue,
              id: 'dateDebNew',
              type: 'Date',
            },
            {
              name: 'HeureDebutNew',
              type: 'Time',
              value: heureDebut,
              id: 'heureDebutNew'
            },
            {
              name: 'HeureFinNew',
              type: 'Time',
              value: heureFin,
              id: 'heureFinNew'
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
                  this.faireCheckDatePassee(data.DateDebutNew);//Vérifier que les dates ne sont pas dans le passé
                  if (this.isCheckDatePasse) {
                    this.faireCheckheure(data.HeureDebutNew, data.HeureFinNew); //Vérifier que les heures ne soient pas incohérentes
                    if(this.isCheckHeure){
                      console.log(demande.id, data.DateDebutNew + " " + data.HeureDebutNew, data.DateDebutNew + " " + data.HeureFinNew, 0, data.MotifNew);
                      this.modifierDemande(demande.id, data.DateDebutNew + " " + data.HeureDebutNew, data.DateDebutNew + " " + data.HeureFinNew, 0, data.MotifNew.trim());
                    } else{
                      this.AlertsToasts.faireAlerteHeuresPasOk();
                    }
                  } else {
                    this.AlertsToasts.faireAlertePasOkDatePassee();
                  }
              }
            }
          ]
        });
        prompt.present();
      } else {
        console.log("pas possible=> demande pas journée complète ni demi journée");
      }
    } else { // Traiter le cas ou la demande a déjà été validée par le gérant
      let alert = this.alertCtrl.create({
        title: 'Votre demande a déjà été traité, vous ne pouvez pas la modifier',
        buttons: ['Fermer']
      });
      alert.present();
    }

  }//modifierDemandeAlert

   enregsitrerDemande(typeDemId, dateDebut: string, dateFin: string, isJourneeComplete, motif: string) {
    this.abiBddCtrl.setDemande(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), typeDemId, dateDebut, dateFin, isJourneeComplete, motif).subscribe(
      data => {
        if (data) {  // OK         
          console.log("Demande enregsitrée"); // Traiter le cas où c'est ok : un toast par exemple
          this.AlertsToasts.faireToastOk();
        } else { // Erreur
          console.log("Enregsitrement échoue : token ou ID"); // Traiter le cas oû c'est pas OK : une alerte...
          this.AlertsToasts.faireAlertePasOk();
        }
        this.getDemandes();//On recharge les demandes
      });
  }//enregsitrerDemande

  modifierDemande(demId, dateDebut: string, dateFin: string, isJourneeComplete, motif: string) {
    // setDemande(userId:string, token:string, demId:string, dateDebut: string, dateFin:string, motif:string
    this.abiBddCtrl.modDemande(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), demId, dateDebut, dateFin, isJourneeComplete, motif).subscribe(
      data => {
        if (data) {  // OK         
          console.log("Modification enregsitrée"); // Traiter le cas où c'est ok : un toast par exemple
          this.AlertsToasts.faireToastOk();
        } else { // Erreur
          console.log("Enregsitrement échoue : token ou ID"); // Traiter le cas oû c'est pas OK : une alerte...
          this.AlertsToasts.faireAlertePasOk();
        }
        this.getDemandes();//On recharge les demandes
      });
  }//modifierDemande

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
                data[i].isJourneeComplete,
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
    console.log("je me fait check pour les dates");
    if (dateDebutCheck <= dateFinCheck) {
      this.isCheckDate = true;
    } else {
      this.isCheckDate = false;
    }
  }//faireCheckDate

  faireCheckheure(heureDebutCheck, heureFinCheck) { //Vérifier que les heures ne soient pas incohérentes
    var today = new Date();
    var ajd = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    var heureActuelle = ('0' + ( today.getHours())).slice(-2) + ':' + ('0' +  today.getMinutes()).slice(-2);
    console.log("je me fait check pour les heures");
    if (heureDebutCheck < heureFinCheck && heureDebutCheck >= heureActuelle) {
      this.isCheckHeure = true;
    } else {
      this.isCheckHeure = false;
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
}
