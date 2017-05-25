//Meshorairesfuturs page

import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';


// Providers
import { ApiPdfService } from '../../providers/api-pdf-service';
import { SyncHorairesService } from '../../providers/sync-horaires-service';
import { ConnectivityService } from '../../providers/connectivity-service';

//Models
import {Horaire} from '../../models/horaire';

@Component({
  selector: 'page-meshorairesfuturs',
  templateUrl: 'meshorairesfuturs.html'
})
export class MeshorairesfutursPage {

  horairesFuturs : Horaire[];
  isHorsLigne: boolean;

  constructor(private loadCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public pdfCtrl: ApiPdfService, private syncHoraireCtrl : SyncHorairesService, private connectivityService: ConnectivityService) {
    // Méthodes à lancer au chargement de la page
    this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1' || connectivityService.isOffline();
    this.getHorairesFuturs(); // On charge les horaires futurs
  }//constructor

  ionViewDidLoad() {
  }//ionViewDidLoad

  getHorairesFuturs() {
      //Icone de chargement
      let loader = this.loadCtrl.create({
        content: "Chargement"
      });  
      loader.present();
      // On va chercher les horaires futurs, quand on les a : on les range dans le tableau this.horairesFuturs, et on enlève l'affichage de l'icone de chargement
      this.syncHoraireCtrl.gethorairesFuturs().then(result => this.horairesFuturs = this.syncHoraireCtrl.horairesFuturs).then(result => loader.dismiss()); 
  }//getHorairesFuturs

  telechargerPDF(){
      this.pdfCtrl.getPdfHoraires(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'));
    }//telechargerPDF

}//MeshorairesfutursPage
