import { Component, Input} from '@angular/core';
import{NavController, NavParams, AlertController} from 'ionic-angular';

// Providers
import { NotificationsLocalesService } from '../../providers/notifications-locales-service';
import {MoisService} from '../../providers/mois-service';
import { ApiBddService } from '../../providers/api-bdd-service';

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
  horaires : Horaires[]; // Tableau qui contient les horaires de la periode affichée
  horaireDuJour : Horaires[]; // Tableau qui contient les horaires du jour selectionné
  inputDisabled : Boolean;    
  annneeCourrante = new Date().getFullYear(); // Année courrante
  anneeSelectionne : number; 
  moisCourant = new Date().getMonth();
  pasHeure : boolean;

   constructor(public navCtrl: NavController, public navParams: NavParams, public notificationsLocalesCtrl : NotificationsLocalesService, 
    public moisService : MoisService, public alertCtrl: AlertController, private abiBddCtrl: ApiBddService) {    
     // Constructeur Date(Année, mois, jour, heure, minute) -> Atention, les mois se comptent à partrir de 0: 0 = janvier, 1= février...
     // notificationsLocalesCtrl.scheduleNotificationFinDeService(new Date(2017, 0, 15, 0, 9));
     // notificationsLocalesCtrl.scheduleNotificationValidationMensuelle(new Date(2017, 0, 15, 0, 10));
     this.moisService.getSemaine().then(semaines => this.semaines = semaines);
     this.moisService.getMois().then(moisListe => this.moisListe = moisListe);
     this.affichageH = false;
     this.pasHeure = true;
     this.anneeSelectionne = this.annneeCourrante; // Par défaut : l'année sélectionnée est l'année courante
     console.log("mois :" + this.moisCourant);
    }//constructor

    onChange(mois): void{
     this.moisSelectionne = this.getMoisSelectionne(mois.trim());
     this.afficherMois();
    }//onChange

    afficherMois(){         
     this.jours.length = 0;
     let premierJoursMois = new Date(this.anneeSelectionne, this.moisSelectionne.moisId, 0).getDay(); // On défini quel est le 1er jours du mois (code de 0 à 6 qui défini quel est le jour de la semaine)
    
     // On regarder quel est le mois précédent (par rapport au moisId), si on est en janvier, c'est décembre (ID 11)
     let idMoisPrecedent = this.moisSelectionne.moisId - 1;
     if(idMoisPrecedent === -1) { idMoisPrecedent = 11};

     // On récupére le mois précédent depuis la liste, et on calcul son nombre de jours
     let moisPrecedent = this.moisListe[idMoisPrecedent];
     let nbJoursMoisPrecedent= moisPrecedent.nbJour;
     if(moisPrecedent.moisId == 1 && this.isAnneeBissextile(this.anneeSelectionne)) { nbJoursMoisPrecedent++; } // Si c'est le mois de février et que l'année est bissextile, on ajoute 1 jours
     // Défini quel est le 1er jours du mois d'avant à afficher pour que le mois courrant commance au bon jours 
     let permierJourMoisPrecedentAafficher = nbJoursMoisPrecedent - premierJoursMois + 1; // On met le "+1" car les jours sont déclalés de 1 : 0 = lundi, 1 = mardi...
     
     // On remplis "des jours du mois d'avant" les permiers jours de la semaine qui ne sont pas de ce mois
     for(let i = 0; i < premierJoursMois; i++){
        this.jours.push(permierJourMoisPrecedentAafficher);
        permierJourMoisPrecedentAafficher++; 
     }

     let nbJoursMois = this.moisSelectionne.nbJour; // On fixe le nombre de jours en fonction du mois
     if(this.moisSelectionne.moisId == 1 && this.isAnneeBissextile(this.anneeSelectionne)) { nbJoursMois++; } // Si c'est le mois de février et que l'année est bissextile, on ajoute 1 jours
     // On remplis les jours du mois 
     for(let i = 1; i <= nbJoursMois; i++){
        this.jours.push(i);
     }

     //afficher l'année
     this.annee = this.anneeSelectionne;
     console.log(this.annee)

     this.getHoraires(this.annee, this.moisSelectionne.moisId+1);
    }//afficherMois

    //Récupère la liste des horaires pour l'année et le mois passés en paramètre
    getHoraires(annee, mois){
      this.abiBddCtrl.getHoraires(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), annee, mois).subscribe(
        data => {  
           if(data) { // Si les données sont bien chargées    
                this.horaires = [];
                for(let i = 0; i < data.length; i++){ //Remplissage du tableau horaires avec les données des horaires formatées
                    let horaire =  new Horaires(data[i].id, 
                      new Date(data[i].annee, data[i].mois-1, data[i].jour),
                      new Date(data[i].annee, data[i].mois-1, data[i].jour, data[i].heureDebut, data[i].minuteDebut),
                      new Date(data[i].annee, data[i].mois-1, data[i].jour, data[i].heureFin, data[i].minuteFin));                    
                    this.horaires.push(horaire); // On ajoute l'horaire au tableau
                }
                console.log(this.horaires);
             } else { // Erreur
                 console.log("Aucun horaire pour cette periode");
             }
        }); 
    }//getHoraires

    // Récupére le mois sélectionné sous format String, et retourne le mois en format Mois correspondant
    getMoisSelectionne(mois : string) : Mois{
      for(let i = 0; i <= this.moisListe.length; i++){
           if(this.moisListe[i].nom === mois){
              return this.moisListe[i];
           }
        }
       return this.moisListe[0];
    }//getMoisSelectionne

    //Récupère la liste des horaires pour le jour passé en paramètre
    getHoraireDuJour(jour){
      let dateDuJour = new Date(this.anneeSelectionne, this.moisSelectionne.moisId, jour);
      this.horaireDuJour = []; // Tableau pour les horaires du jour
      if(this.horaires != null){ // Si des horaires existent
        for(let i = 0; i < this.horaires.length; i++){ // On parcour les horaires
            if(this.horaires[i].date.getTime() === dateDuJour.getTime()){ // Si l'horaire est pour la date du jour sélectionné (on passe en getTime() sinon il ne reconnait pas 2 dates pareilles !)
              this.horaireDuJour.push(this.horaires[i]); // On l'ajoute dans la liste
              console.log(this.horaires[i].affichageHeureDebut);
              console.log(this.horaires[i].affichageHeureFin);
            }
        }
      }
    }//getHoraireDuJour
  
    /* J'ai créer des horaires pour ton utilisateur, comme ça tu peux tester :
    2017-02-16 : 11:00:00 à 14:00:00
    2017-02-16 : 18:00:00 à 22:00:00
    2017-02-17 : 17:00:00 à 23:00:00
    2017-02-19 : 11:00:00 à 13:00:00
    2017-02-21 : 11:00:00 à 21:00:00
    2017-02-23 : 10:00:00 à 16:00:00    
    2017-02-23 : 20:00:00 à 22:00:00
    */
    detailHoraire(i){
      console.log("detailHoraire");
      this.getHoraireDuJour(i);
      this.affichageH = true;
      if(this.horaireDuJour.length > 0){
        this.pasHeure = false;
        console.log(this.horaireDuJour); // Contient un tableau des horaires du jour choisi sous le format Horaire
      } else {
        console.log("pas d'horaire pour ce jour");
        this.pasHeure = true;
      } 
      this.selJour = i; //récupération du jour choisi
      this.inputDisabled = true; //desactivation des champs horaires
    //  if(this.horaires.jour == i){
    
   }//DetailHoraire


    goToMoisPrecedent(){
      console.log("mois d'avant");
      // On regarde quel est le mois précédent (par rapport au moisId)
      let idMois = this.moisSelectionne.moisId - 1;
      // Si on est en janvier, c'est décembre (ID 11), et on change également d'année (décrément)
      if(idMois === -1) { 
        idMois = 11;
        this.anneeSelectionne--;
      };
      // On défini ce mois comme moisSelectionne, et on appelle l'affichage.
      this.moisSelectionne = this.moisListe[idMois];
      this.afficherMois();
    }//goToMoisPrecedent

    goToMoisSuivant(){
      console.log("mois d'après");
      // On regarde quel est le mois suivante (par rapport au moisId)
      let idMois = this.moisSelectionne.moisId +1;
      // Si on est en décembre, c'est janvier (ID 0), et on change également d'année (incrément)
      if(idMois === 12) { 
        idMois = 0;
        this.anneeSelectionne++;
      };
      // On définicele mois comme moisSelectionne, et on appelle l'affichage.
      this.moisSelectionne = this.moisListe[idMois];
      this.afficherMois();
    }//goToMoisSuivant

    changerMois(e){
      console.log("changerMois");
      if (e.direction == 2) { // Vers la gauche
          console.log("gauche");
          this.goToMoisSuivant();          
      } else if (e.direction == 4) { // Vers la droite
        console.log("droite");
        this.goToMoisPrecedent();
      }
    }//changerMois


   isAnneeBissextile(annee){
      return new Date(annee, 2, 0).getDate() == 29
    }//isAnneeBissextile

  ionViewDidLoad() {
      console.log('Hello MesHoraires Page');
  }//ionViewDidLoad
}//MeshorairesPage
