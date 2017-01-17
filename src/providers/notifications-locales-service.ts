import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LocalNotifications } from 'ionic-native';
import 'rxjs/add/operator/map';

/*
  Generated class for the NotificationsLocalesService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NotificationsLocalesService {

  constructor(public http: Http) {
    console.log('Hello NotificationsLocalesService Provider');
  }

  // Gère l'envois différé de la notification locale de fin de service
  public scheduleNotificationFinDeService(scheduleDate : Date) {
      console.log('scheduleNotificationFinDeService : ' + scheduleDate);
       LocalNotifications.schedule({
            id: 1,
            title: 'Validation de fin de service',
            text: 'Avez-vous bien travailler de telle heure à telle heure ?',
            at: scheduleDate,
            sound: 'res://platform_default',
            icon: 'res://icon',
            led: 'FFFFFF'
        });
    } //scheduleNotificationFinDeService

    // Gère l'envois différé de la notification locale de validation mensuelle des heures
  public scheduleNotificationValidationMensuelle(scheduleDate : Date) {
      console.log('scheduleNotificationValidationMensuelle : ' + scheduleDate);
       LocalNotifications.schedule({
            id: 2,
            title: 'Validation mensuelle',
            text: 'Veuillez aller valider vos heures mensuelles',
            at: scheduleDate,
            sound: 'res://platform_default',
            icon: 'res://icon',
            led: 'FFFFFF'
        });
    }//scheduleNotificationValidationMensuelle 
}//NotificationsLocalesService
