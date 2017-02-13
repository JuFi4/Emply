import { Component, Input} from '@angular/core';
import{NavController, NavParams, AlertController} from 'ionic-angular';
// Providers
import { NotificationsLocalesService } from '../../providers/notifications-locales-service';
import {MoisService} from '../../providers/mois-service';

//models
import {Mois} from '../../models/mois';
import {Semaine} from '../../models/semaine';
import {Horaires} from '../../models/horaires';

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
  annee : any = []; 
  affichageH : Boolean;
  horaires : Horaires;
  inputDisabled : Boolean;

  annneeCourrante = new Date().getFullYear(); // Année courrante
  isAnneBissextile= new Date(this.annneeCourrante, 2, 0).getDate() == 29; // Gestion des années bissextiles : "si le 1er mars est un 29 févirer XD"

   constructor(public navCtrl: NavController, public navParams: NavParams, public notificationsLocalesCtrl : NotificationsLocalesService, public moisService : MoisService, public alertCtrl: AlertController) {
     // Constructeur Date(Année, mois, jour, heure, minute) -> Atention, les mois se comptent à partrir de 0: 0 = janvier, 1= février...
     // notificationsLocalesCtrl.scheduleNotificationFinDeService(new Date(2017, 0, 15, 0, 9));
     // notificationsLocalesCtrl.scheduleNotificationValidationMensuelle(new Date(2017, 0, 15, 0, 10));
     this.moisService.getSemaine().then(semaines => this.semaines = semaines);
     this.moisService.getMois().then(moisListe => this.moisListe = moisListe);
     this.affichageH = false;
    }//constructor

    onChange(mois): void{
     this.moisSelectionne = this.getMoisSelectionne(mois.trim());
     this.afficherMois();
    }//onChange

    afficherMois(){         
     this.jours.length = 0;
     let premierJoursMois = new Date(this.annneeCourrante, this.moisSelectionne.moisId, 0).getDay(); // On défini quel est le 1er jours du mois (code de 0 à 6 qui défini quel est le jour de la semaine)
    
     // On regarder quel est le mois précédent (par rapport au moisId), si on est en janvier, c'est décembre (ID 11)
     let idMoisPrecedent = this.moisSelectionne.moisId - 1;
     if(idMoisPrecedent === -1) { idMoisPrecedent = 11};

     // On récupére le mois précédent depuis la liste, et on calcul son nombre de jours
     let moisPrecedent = this.moisListe[idMoisPrecedent];
     let nbJoursMoisPrecedent= moisPrecedent.nbJour;
     if(moisPrecedent.moisId == 1 && this.isAnneBissextile) { nbJoursMoisPrecedent++; } // Si c'est le mois de février et que l'année est bissextile, on ajoute 1 jours
     // Défini quel est le 1er jours du mois d'avant à afficher pour que le mois courrant commance au bon jours 
     let permierJourMoisPrecedentAafficher = nbJoursMoisPrecedent - premierJoursMois + 1; // On met le "+1" car les jours sont déclalés de 1 : 0 = lundi, 1 = mardi...
     
     // On remplis "des jours du mois d'avant" les permiers jours de la semaine qui ne sont pas de ce mois
     for(let i = 0; i < premierJoursMois; i++){
        this.jours.push(permierJourMoisPrecedentAafficher);
        permierJourMoisPrecedentAafficher++; 
     }

     let nbJoursMois = this.moisSelectionne.nbJour; // On fixe le nombre de jours en fonction du mois
     if(this.moisSelectionne.moisId == 1 && this.isAnneBissextile) { nbJoursMois++; } // Si c'est le mois de février et que l'année est bissextile, on ajoute 1 jours
     // On remplis les jours du mois 
     for(let i = 1; i <= nbJoursMois; i++){
        this.jours.push(i);
     }

     //afficher l'année
     this.annee = this.annneeCourrante;
     console.log(this.annee)

    }//afficherMois

    // Récupére le mois sélectionné sous format String, et retourne le mois en format Mois correspondant
    getMoisSelectionne(mois : string) : Mois{
      for(let i = 0; i <= this.moisListe.length; i++){
           if(this.moisListe[i].nom === mois){
              return this.moisListe[i];
           }
        }
       return this.moisListe[0];
    }//getMoisSelectionne

    // 
    detailHoraire(i){
      this.affichageH = true; 
      this.selJour = i; //récupération du jour choisi
      this.inputDisabled = true; //desactivation des champs horaires
    //  if(this.horaires.jour == i){


    }//DetailHoraire

  ionViewDidLoad() {
      console.log('Hello MesHoraires Page');
  }//ionViewDidLoad
}//MeshorairesPage
