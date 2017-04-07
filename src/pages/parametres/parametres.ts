import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { MeshorairesPage } from '../meshoraires/meshoraires';
import {Calendar} from 'ionic-native';

// Providers
import { ConnectivityService } from '../../providers/connectivity-service';

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
  Meshoraires : MeshorairesPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, private connectivityService: ConnectivityService,  public alertCtrl: AlertController,
//              public MesHoraires: MeshorairesPage
              ) {
    this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1' ||connectivityService.isOffline();
    this.autoImport = this.setAutoImport();
    this.importeMinutes = this.importMinutes();
//    this.Meshoraires = MeshorairesPage;

  }

  ionViewDidLoad() {
    console.log('Hello Parametres Page');
  }

     saveAutoImportChange(){
     window.localStorage.setItem('autoImport', this.autoImport.toString());  // Création de la sauvegarde locale de ces horaires (mois et annee) 
     if(this.autoImport){ // Si on a coché "oui"
     /* if(window.localStorage.getItem('autoImportNomEvent') != "undefined" && window.localStorage.getItem('autoImportNomEvent') != null){
          this.nomCalendrierEvent = window.localStorage.getItem('autoImportNomEvent'); // On récupère la sauvegarde locale len nom par lequel on veut appeller les events
      }*/
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
                 //s'arrete la!
                 this.Meshoraires.gethorairesFuturs(true);//On relance le chargement des horaires futurs pour qu'ils se synchronisent
                 console.log("les horaires sont rechargés");
              }
            }
          ]
        });
        alert.present();
     } else { // On a coché non
        this.Meshoraires.supprimerCalendrierEvents();
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

}
