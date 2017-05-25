//Parametres page

import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { MeshorairesPage } from '../meshoraires/meshoraires';
import { Calendar } from 'ionic-native';

// Providers
import { ConnectivityService } from '../../providers/connectivity-service';
import { SyncHorairesService } from '../../providers/sync-horaires-service';
import { AlertsToasts } from '../../providers/alerts-toasts';

//Modele
import { CalendrierEvent } from '../../models/calendrierEvent';

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
  is30 = false;
  is60 = false;
  is180 = false;
  is360 = false;
  is600 = false;
  isNull = false; // choix pour désactiver => minute à -1

  constructor(private loadCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, private connectivityService: ConnectivityService, public alertCtrl: AlertController, private syncHoraireCtrl : SyncHorairesService, private AlertsToasts: AlertsToasts) {
    this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1' || connectivityService.isOffline();
    this.autoImport = this.setAutoImport();
    this.importMinutes();
    this.selectionnerMinutes();
  }//constructor

  ionViewDidLoad() {
    console.log('Hello Parametres Page');
  }//ionViewDidLoad

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
              this.nomCalendrierEvent = data.nomEvent;//On defini ce nom comme nom pour les event            
              window.localStorage.setItem('autoImportNomEvent', data.nomEvent);                
              this.syncCalendrierSmartphone(); //On synchronise le calendrier 
              this.AlertsToasts.faireToastSynchronisation();   
            }
          }
        ]
      });
      alert.present();
    } else { // On a coché non
      this.supprimerCalendrierEvents();
    }
  }//saveAutoImportChange

  syncCalendrierSmartphone(){
      //Icone de chargement
      let loader = this.loadCtrl.create({
        content: "Chargement"
      });  

     loader.present();

      // On re-traite les horaires avec paramètre de synchronisation, et quand c'est fini on cache l'icone
      this.syncHoraireCtrl.autoImport = true;
      this.syncHoraireCtrl.gethorairesFuturs(true).then(result => loader.dismiss());;    
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

    //Icone de chargement
      let loader = this.loadCtrl.create({
        content: "Chargement"
      });  

     loader.present();

    this.syncHoraireCtrl.gererCalendrierSmartphone(); // On récupère les events enregsitrés
    this.calendrierEvents = this.syncHoraireCtrl.calendrierEvents;

    for (let i = 0; i < this.calendrierEvents.length; i++) { //On boucle sur les events enregsitrés
      Calendar.deleteEvent( // On supprime l'event du calendrier
        this.calendrierEvents[i].title,
        this.calendrierEvents[i].location,
        this.calendrierEvents[i].notes,
        this.calendrierEvents[i].startDate,
        this.calendrierEvents[i].endDate);
    }   
    this.calendrierEvents = []; // On vide l'array des calendrier Events
    window.localStorage.setItem('calendrierEvents', JSON.stringify(this.calendrierEvents));// On enregsitre la modification en local storage 
    
    loader.dismiss() // On arrête l'icone de chargement
  }//supprimerCalendrierEvents


  selectionnerMinutes() {
    if (this.minute === "0") {
      this.is0 = true;
    } else if (this.minute === "30") {
      this.is30 = true;
    } else if (this.minute === "60") {
      this.is60 = true;
    } else if (this.minute === "180") {
      this.is180 = true;
    } else if (this.minute === "360") {
      this.is360 = true;
    } else if (this.minute === "600") {
      this.is600 = true;
    } else if (this.minute === "-1") { // -1 => désactiver les notifications de fin de service
      this.isNull = true;
    } else {
      this.is0 = true;
    }
  }//selectionnerMinutes

}//ParametresPage
