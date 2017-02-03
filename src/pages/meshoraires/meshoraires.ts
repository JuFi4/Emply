import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// Providers
import { NotificationsLocalesService } from '../../providers/notifications-locales-service';


@Component({
  selector: 'page-meshoraires',
  templateUrl: 'meshoraires.html'
})
export class MeshorairesPage {
   constructor(public navCtrl: NavController, public navParams: NavParams, public notificationsLocalesCtrl : NotificationsLocalesService) {
     // Test pour les notifications locales liées aux horaires
     // Constructeur Date(Année, mois, jour, heure, minute) -> Atention, les mois se comptent à partrir de 0: 0 = janvier, 1= février...
       //notificationsLocalesCtrl.scheduleNotificationFinDeService(new Date(2017, 1, 3, 3, 35));
       //notificationsLocalesCtrl.scheduleNotificationValidationMensuelle(new Date(2017, 1, 3, 3, 40));
    }//constructor

  ionViewDidLoad() {
      console.log('Hello MesHoraires Page');
  }//ionViewDidLoad

  
}//MeshorairesPage
