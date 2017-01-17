import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// Providers
import { NotificationsLocalesService } from '../../providers/notifications-locales-service';

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
   constructor(public navCtrl: NavController, public navParams: NavParams, public notificationsLocalesCtrl : NotificationsLocalesService) {
     // Constructeur Date(Année, mois, jour, heure, minute) -> Atention, les mois se comptent à partrir de 0: 0 = janvier, 1= février...
     notificationsLocalesCtrl.scheduleNotificationFinDeService(new Date(2017, 0, 15, 0, 9));
     notificationsLocalesCtrl.scheduleNotificationValidationMensuelle(new Date(2017, 0, 15, 0, 10));
    }//constructor

  ionViewDidLoad() {
      console.log('Hello MesHoraires Page');
  }//ionViewDidLoad

  
}//MeshorairesPage
