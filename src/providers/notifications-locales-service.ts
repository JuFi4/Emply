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
  public scheduleNotificationFinDeService(heureFin : Date, affHeureDebut : string, affHeureFin: string, id : number) {
      let scheduleDate = new Date(heureFin);
      scheduleDate.setMinutes(scheduleDate.getMinutes() + 10); // On met la notif 10 minutes après la fin du service
      console.log('scheduleNotificationFinDeService : ' + scheduleDate);

       LocalNotifications.cancel(id); // On supprime la notification qui a cet id (si elle existe) -> pour ne pas avoir de doublon

       // On enregsitre la nouvelle notification
       LocalNotifications.schedule({
            id: id,
            title: 'Validation de fin de service',
            text: 'Avez-vous bien travailler de '+ affHeureDebut + ' à ' + affHeureFin +' ?',
            at: scheduleDate,
            sound: 'res://platform_default',
            icon: 'res://icon',
            led: 'FFFFFF'
        });
    } //scheduleNotificationFinDeService

  // Gère l'envois différé de la notification locale de validation mensuelle des heures
  // L'ID de cette notification est toujours de 0 : permet de la reconnaitre par rapport aux notifications de fin de service
  public scheduleNotificationValidationMensuelle(scheduleDate : Date) {
      console.log('scheduleNotificationValidationMensuelle : ' + scheduleDate);
       LocalNotifications.schedule({
            id: 0,
            title: 'Validation mensuelle',
            text: 'Veuillez aller valider vos heures mensuelles',
            at: scheduleDate,
            sound: 'res://platform_default',
            icon: 'res://icon',
            led: 'FFFFFF'
        });
    }//scheduleNotificationValidationMensuelle 


}//NotificationsLocalesService
