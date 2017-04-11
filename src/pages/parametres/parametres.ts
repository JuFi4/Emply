import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { MeshorairesPage } from '../meshoraires/meshoraires';
import {Calendar} from 'ionic-native';

// Providers
import { ConnectivityService } from '../../providers/connectivity-service';


//Modele
import {CalendrierEvent} from '../../models/calendrierEvent';

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

  isHorsLigne : boolean;
  autoImport = true;
  nomCalendrierEvent = "Travail";
  minute = "0";
  importeMinutes = true;
  calendrierEvents : CalendrierEvent[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private connectivityService: ConnectivityService,  public alertCtrl: AlertController) {
    this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1' ||connectivityService.isOffline();
    this.autoImport = this.setAutoImport();
    this.importeMinutes = this.importMinutes();
  }

  ionViewDidLoad() {
    console.log('Hello Parametres Page');
  }

     saveAutoImportChange(){
     window.localStorage.setItem('autoImport', this.autoImport.toString());  // Création de la sauvegarde locale de ces horaires (mois et annee) 
     if(this.autoImport){ // Si on a coché "oui"
      window.localStorage.setItem('syncCalendar', "true"); //On enregsitre que le calendrier doit se sychroniser
      if(window.localStorage.getItem('autoImportNomEvent') != "undefined" && window.localStorage.getItem('autoImportNomEvent') != null){
          this.nomCalendrierEvent = window.localStorage.getItem('autoImportNomEvent'); // On récupère la sauvegarde locale len nom par lequel on veut appeller les events
      }
      let alert = this.alertCtrl.create({ // On affiche une alert pour savoir par quel nom appeller les events
          title: "Nom de l'évenement",
          message: "Entrez le nom par lequel vous souhaitez appeller vos heures de travail dans votre calendrier : ",
          inputs: [
            {
              name: 'nomEvent',         
              value : this.nomCalendrierEvent,
            }          
          ],
          buttons: [   
            {
              text: 'OK',
              handler: data => {
                 console.log("je suis dans ok");
                 this.nomCalendrierEvent = data.nomEvent;//On defini ce nom comme nom pour les event
                 console.log(this.nomCalendrierEvent + " je suis le nom du calendrier");
                 window.localStorage.setItem('autoImportNomEvent', data.nomEvent);//On enregsitre                 
                 console.log("j'ai été enregistré " + data.nomEvent);               
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

   setAutoImport(){
      console.log("je suis dans setautoImport");
      if(window.localStorage.getItem('autoImport') == "true"){ return true;}
      return false;
    }//setAutoImport

  importMinutes(){
      if(window.localStorage.getItem('importMinutes') == "true"){ return true;}
      return false;
  }//importMinutes

  sauverMinutes(valeur){
    this.minute = valeur;
    window.localStorage.setItem('importMinutes', this.minute);//On enregsitre
    console.log(window.localStorage.getItem('importMinutes'));
  }//sauverMinutes

   // Supprime tous les events futurs programmés dans le calendrier
   public supprimerCalendrierEvents(){
      console.log("supprimerCalendrierEvents");
      this.getCalendrierSmartphone(); // On récupère les events enregsitrés
      for(let i = 0; i < this.calendrierEvents.length; i++){ //On boucle sur les events enregsitrés
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

   // Récupère les liste des events programmés pour la gestion du calendrier smartphone
    getCalendrierSmartphone(){             
        this.calendrierEvents = []; // Instanciation de l'array qui contient les events déja enregsitrés
        try{
              let data = JSON.parse(window.localStorage.getItem('calendrierEvents')); // On récupère les events précédement crées depuis la mémoire locale
              console.log(data);
              // On fixe les heures, minutes et secondes de la date actuelle à 0
              let dateCourrante = new Date();              
              dateCourrante.setHours(0);
              dateCourrante.setMinutes(0);
              dateCourrante.setSeconds(0);
              for(let i = 0; i < data.length; i++){
                  let event = new CalendrierEvent(data[i].title, data[i].location, data[i].notes, new Date(data[i].startDate), new Date(data[i].endDate), data[i].id);
                  if(event.endDate >= dateCourrante){ // Si l'event à lieux aujourd'hui ou dans le futur
                      this.calendrierEvents.push(event)//On le prend dans la liste d'events
                  }
              }
        } catch(Exception){}          
    }//gererCalendrier

}
