import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


// Providers
import { ApiPdfService } from '../../providers/api-pdf-service';
import { SyncHorairesService } from '../../providers/sync-horaires-service';
import { ConnectivityService } from '../../providers/connectivity-service';

//Models
import {Horaire} from '../../models/horaire';
/*
  Generated class for the Meshorairesfuturs page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-meshorairesfuturs',
  templateUrl: 'meshorairesfuturs.html'
})
export class MeshorairesfutursPage {

  horairesFuturs : Horaire[];
  isHorsLigne: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public pdfCtrl: ApiPdfService, private syncHoraireCtrl : SyncHorairesService, private connectivityService: ConnectivityService) {
    // Méthodes à lancer au chargement de la page
    this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1' || connectivityService.isOffline();
    this.getHorairesFuturs(); // On charge les horaires futurs
  }

  ionViewDidLoad() {
    console.log('Hello Meshorairesfuturs Page');
  }

  getHorairesFuturs() {
    console.log("Coucou les horaires futurs");
      this.syncHoraireCtrl.gethorairesFuturs().then(result => this.horairesFuturs = this.syncHoraireCtrl.horairesFuturs);     
      console.log(this.horairesFuturs);    
  }

  telechargerPDF(){
      this.pdfCtrl.getPdfHoraires(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'));
    }//telechargerPDF

}
