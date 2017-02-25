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
            id: this.getNotificationNewId(),
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
            id: 1,
            title: 'Validation mensuelle',
            text: 'Veuillez aller valider vos heures mensuelles',
            at: scheduleDate,
            sound: 'res://platform_default',
            icon: 'res://icon',
            led: 'FFFFFF'
        });
    }//scheduleNotificationValidationMensuelle 

    // Retourne l'ID de la prochaine notification (incrémente de 1 l'id de plus grand)
    public getNotificationNewId() : number {
        var maxId = 1;
        LocalNotifications.getAllIds().then((data) => {
            for(let id in data){
                if(Number(id) > maxId){
                    maxId = Number(id);
                }
            }
        });        
        maxId++;
        return maxId;
    }//getNotificationNewId
}//NotificationsLocalesService
