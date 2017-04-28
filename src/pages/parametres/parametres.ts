import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { MeshorairesPage } from '../meshoraires/meshoraires';
import { Calendar } from 'ionic-native';

// Providers
import { ConnectivityService } from '../../providers/connectivity-service';
import { SyncHorairesService } from '../../providers/sync-horaires-service';
import { AlertsToasts } from '../../providers/alerts-toasts';

//Modele
import { CalendrierEvent } from '../../models/calendrierEvent';

/*
  Generated class for the Parametres page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-parametres',
  templateUrl: 'parametres.html'
})
export class ParametresPage {

  isHorsLigne: boolean;
  autoImport = true;
  nomCalendrierEvent = "Travail";
  minute;
  importeMinutes = true;
  calendrierEvents: CalendrierEvent[];
  is0 = false;
  is15 = false;
  is30 = false;
  is45 = false;
  is60 = false;
  is90 = false;
  is120 = false;
  is150 = false;
  is180 = false;
  isNull = false; // choix pour désactiver => minute à -1

  constructor(public navCtrl: NavController, public navParams: NavParams, private connectivityService: ConnectivityService, public alertCtrl: AlertController, private syncHoraireCtrl : SyncHorairesService, private AlertsToasts: AlertsToasts) {
    this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1' || connectivityService.isOffline();
    this.autoImport = this.setAutoImport();
    this.importMinutes();
    this.selectionnerMinutes();
  }

  ionViewDidLoad() {
    console.log('Hello Parametres Page');
  }

  saveAutoImportChange() {
    window.localStorage.setItem('autoImport', this.autoImport.toString());  // Création de la sauvegarde locale de ces horaires (mois et annee) 
    if (this.autoImport) { // Si on a coché "oui"
      let alert = this.alertCtrl.create({ // On affiche une alert pour savoir par quel nom appeller les events
        title: "Nom de l'évenement",
        message: "Entrez le nom par lequel vous souhaitez appeller vos heures de travail dans votre calendrier : ",
        inputs: [
          {
            name: 'nomEvent',
            value: this.nomCalendrierEvent,
          }
        ],
        buttons: [
          {
            text: 'OK',
            handler: data => {
              console.log("je suis dans ok");
              this.nomCalendrierEvent = data.nomEvent;//On defini ce nom comme nom pour les event
              console.log(this.nomCalendrierEvent + " je suis le nom du calendrier");              
              window.localStorage.setItem('autoImportNomEvent', data.nomEvent);                
              console.log("j'ai été enregistré " + data.nomEvent);
              this.syncCalendrierSmartphone(); //On synchronise le calendrier 
              this.AlertsToasts.faireToastSynchronisation();   
            }
          }
        ]
      });
      alert.present();
    } else { // On a coché non
      this.supprimerCalendrierEvents();
      console.log("On a coché non");
    }
  }//saveAutoImportChange

  syncCalendrierSmartphone(){
      // On re-traite les horaires avec paramètre de synchronisation
      this.syncHoraireCtrl.autoImport = true;
      this.syncHoraireCtrl.gethorairesFuturs(true);    
  }

  setAutoImport() {
    if (window.localStorage.getItem('autoImport') == "true") { return true; }
    return false;
  }//setAutoImport

  importMinutes() {
    if (window.localStorage.getItem('importeMinutes') == "true") { return true; }
    if (window.localStorage.getItem('importeMinutes') !== null) {
      this.minute = window.localStorage.getItem('importeMinutes');
      return true;
    }
    return false;
  }//importMinutes

  sauverMinutes(valeur) { // valeur = -1 si désactiver
    this.minute = valeur;
    window.localStorage.setItem('importeMinutes', this.minute);//On enregsitre
  }//sauverMinutes

  // Supprime tous les events futurs programmés dans le calendrier
  public supprimerCalendrierEvents() {
    console.log("supprimerCalendrierEvents");

    this.syncHoraireCtrl.gererCalendrierSmartphone(); // On récupère les events enregsitrés
    this.calendrierEvents = this.syncHoraireCtrl.calendrierEvents;

    for (let i = 0; i < this.calendrierEvents.length; i++) { //On boucle sur les events enregsitrés
      console.log("On supprime " + this.calendrierEvents[i].startDate);
      Calendar.deleteEvent( // On supprime l'event du calendrier
        this.calendrierEvents[i].title,
        this.calendrierEvents[i].location,
        this.calendrierEvents[i].notes,
        this.calendrierEvents[i].startDate,
        this.calendrierEvents[i].endDate);
    }//for    
    this.calendrierEvents = []; // On vide l'array des calendrier Events
    window.localStorage.setItem('calendrierEvents', JSON.stringify(this.calendrierEvents));// On enregsitre la modification en local storage 
  }//supprimerCalendrierEvents


  selectionnerMinutes() {
    if (this.minute === "0") {
      this.is0 = true;
    } else if (this.minute === "15") {
      this.is15 = true;
    } else if (this.minute === "30") {
      this.is30 = true;
    } else if (this.minute === "45") {
      this.is45 = true;
    } else if (this.minute === "60") {
      this.is60 = true;
    } else if (this.minute === "90") {
      this.is90 = true;
    } else if (this.minute === "120") {
      this.is120 = true;
    } else if (this.minute === "150") {
      this.is150 = true;
    } else if (this.minute === "180") {
      this.is180 = true;
    } else if (this.minute === "-1") { // -1 => désactiver
      this.isNull = true;
    } else {
      this.is0 = true;
    }
  }

}
