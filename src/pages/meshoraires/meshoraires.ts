import { Component, Input} from '@angular/core';
import{NavController, NavParams, AlertController} from 'ionic-angular';
// Providers
import { NotificationsLocalesService } from '../../providers/notifications-locales-service';
import {MoisService} from '../../providers/mois-service';

//models
import {Mois} from '../../models/mois';
import {Semaine} from '../../models/semaine';

/*
  Generated class for the Meshoraires page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-meshoraires',
  templateUrl: 'meshoraires.html'
})
export class MeshorairesPage {
  
  moisListe: Mois[];
  moisSelectionne : Mois;
  semaines : Semaine[]
  semaine : Semaine;
  jours : any[] = [];
  selJour : any = [];

   constructor(public navCtrl: NavController, public navParams: NavParams, public notificationsLocalesCtrl : NotificationsLocalesService, public moisService : MoisService, public alertCtrl: AlertController) {
     // Constructeur Date(Année, mois, jour, heure, minute) -> Atention, les mois se comptent à partrir de 0: 0 = janvier, 1= février...
     notificationsLocalesCtrl.scheduleNotificationFinDeService(new Date(2017, 0, 15, 0, 9));
     notificationsLocalesCtrl.scheduleNotificationValidationMensuelle(new Date(2017, 0, 15, 0, 10));
     this.moisService.getSemaine().then(semaines => this.semaines = semaines);
     this.moisService.getMois().then(moisListe => this.moisListe = moisListe);
    }//constructor

    onChange(mois): void{
      console.log(mois)
     this.moisSelectionne = mois
     this.jours.length = 0;
     for(let i = 1; i <= 31; i++){
        this.jours.push(i);
     }
    }

    DetailHoraire(i){
      console.log(i)
        let prompt = this.alertCtrl.create({
          title: i,
          message: "Vos horaires du jour",
          inputs: [
          {
            id: 'HoraireMatin',
            name: 'HoraireMatin',
            placeholder: '8:00 12:00'
          },
          {
            id: 'HoraireMidi',
            name: 'HoraireMidi',
            placeholder: '13:00 18:00',
            
          },
          {
            id: 'horaireNuit',
            name: 'horaireNuit',
            placeholder: '-'
          },
        ]
      });
    prompt.present();
    }

  ionViewDidLoad() {
      console.log('Hello MesHoraires Page');
  }//ionViewDidLoad
}//MeshorairesPage
