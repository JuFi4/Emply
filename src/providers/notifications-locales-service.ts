import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LocalNotifications } from 'ionic-native';
import 'rxjs/add/operator/map';

//Models
import { Horaire } from '../models/horaire';
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

  // Suppression des notificaitons de fin de service : id > 0
  public resetNotificationFinDeService(){
      LocalNotifications.getAllIds().then((data) => {
            for(let id in data){
                if(parseInt(id) > 0){
                    LocalNotifications.cancel(id);
                }
            }
        }); 
  }//resetNotificationFinDeService

  // Gère l'envois différé de la notification locale de fin de service
  public scheduleNotificationFinDeService(horaire : Horaire) {
      let scheduleDate = new Date(horaire.heureFin,);
      scheduleDate.setMinutes(scheduleDate.getMinutes() + 10); // On met la notif 10 minutes après la fin du service
      console.log('scheduleNotificationFinDeService : ' + scheduleDate);

       LocalNotifications.cancel(horaire.id); // On supprime la notification qui a cet id (si elle existe) -> pour ne pas avoir de doublon

       // On enregsitre la nouvelle notification
       LocalNotifications.schedule({
            id: horaire.id,
            title: 'Validation de fin de service',
            text: 'Avez-vous bien travailler de '+ horaire.affichageHeureDebut + ' à ' + horaire.affichageHeureFin +' ?',
            at: scheduleDate,
            sound: 'res://platform_default',
            icon: 'res://icon',
            led: 'FFFFFF',
            data: JSON.stringify(horaire)
        });
    } //scheduleNotificationFinDeService

  // Gère l'envois différé de la notification locale de validation mensuelle des heures
  // L'ID de cette notification est toujours de 0 : permet de la reconnaitre par rapport aux notifications de fin de service
  public scheduleNotificationValidationMensuelle() {
      let scheduleDate = new Date();
      let firstDay = 1;
      let nextMonth = (scheduleDate.getMonth()) + 1;
      let actualYear = scheduleDate.getFullYear();
      console.log('scheduleNotificationValidationMensuelle : ' + new Date(actualYear, nextMonth, firstDay));
       LocalNotifications.cancel(0); // Supprime la notification mensuelle si elle est existante
       LocalNotifications.schedule({
            id: 0,
            title: 'Validation mensuelle',
            text: 'Veuillez valider vos heures mensuelles!',
            at: new Date(actualYear, nextMonth, firstDay),
            sound: 'res://platform_default',
            icon: 'res://icon',
            led: 'FFFFFF',
            data : scheduleDate.getFullYear()+"-"+scheduleDate.getMonth() // On met en data le mois et l'année concernés par la validation
        });
    }//scheduleNotificationValidationMensuelle 


}//NotificationsLocalesService
