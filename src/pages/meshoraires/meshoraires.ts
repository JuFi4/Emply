
import { Component, Input} from '@angular/core';
import{NavController, NavParams, AlertController} from 'ionic-angular';

// Providers
import { NotificationsLocalesService } from '../../providers/notifications-locales-service';
import {MoisService} from '../../providers/mois-service';
import { ApiBddService } from '../../providers/api-bdd-service';

//models
import {Mois} from '../../models/mois';
import {Semaine} from '../../models/semaine';
import {Horaire} from '../../models/horaire';
import {Jour} from '../../models/jour';

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
  joursMoisPrecedent : any[] = [];
  jour : Jour;
  selJour : any = [];
  annee : any = []; 
  affichageH : Boolean;
  horaires : Horaire[]; // Tableau qui contient les horaires de la periode affichée
  horaireDuJour : Horaire[]; // Tableau qui contient les horaires du jour selectionné
  inputDisabled : Boolean;    
  annneeCourrante = new Date().getFullYear(); // Année courrante
  anneeSelectionne : number; 
  moisCourant = new Date().getMonth();
  pasHeure : boolean;
  isDisabledDay : boolean;
  isHorsLigne : boolean;

   constructor(public navCtrl: NavController, public navParams: NavParams, public notificationsLocalesCtrl : NotificationsLocalesService, 
    public moisService : MoisService, public alertCtrl: AlertController, private abiBddCtrl: ApiBddService) {    
     // Constructeur Date(Année, mois, jour, heure, minute) -> Atention, les mois se comptent à partrir de 0: 0 = janvier, 1= février...
     // notificationsLocalesCtrl.scheduleNotificationFinDeService(new Date(2017, 0, 15, 0, 9));
     // notificationsLocalesCtrl.scheduleNotificationValidationMensuelle(new Date(2017, 0, 15, 0, 10));
     this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1';
     this.moisService.getSemaine().then(semaines => this.semaines = semaines);
     this.moisService.getMois().then(moisListe => this.moisListe = moisListe).then(result => this.selectionnerMois());
     this.affichageH = false;
     this.pasHeure = true;
     this.anneeSelectionne = this.annneeCourrante; // Par défaut : l'année sélectionnée est l'année courante
     //this.afficherHoraireCouleur();
     this.notificationsLocalesCtrl.scheduleNotificationFinDeService(new Date(2017,2,13,14,34),"12h00","14h30",1);
    }//constructor


    ionViewDidLoad() {
      console.log('Hello MesHoraires Page');
    }//ionViewDidLoad


    /* VANESSA: j'ai trouvé comment selectionner le mois courrant: ligne 50, j'ai rajouter un "then()" qui lance la fonction selectionnerMois() lorsque 
      la liste des mois a bien été récuprée.
      Pour le moment l'affichage ne marche pas car le code que tu as mis dans l'HTML " [class = "JoursOk"]="IsColored"" a l'air de bloquer l'affichage
      mais j'ai tester en l'enlevant et ça affiche bien le calendrier du avec le bon mois.
      J'ai mis ton formulaire pour selectionner le mois en commentaire dans l'html pour pas le perdre, mais du coup est est désactivé
      Du coup je pense qu'il n'y a pas besoin de passer par le ionViewDidLoad, tu peux tout mettre soit dans le constructeur, soit dans
      selectionnerMois()
    */
    selectionnerMois(){
        this.moisSelectionne = this.moisListe[this.moisCourant]; 
        console.log("this.moisSelectionne " + this.moisSelectionne.nom);
        this.afficherMois();
    }//selectionnerMois
    

    /*afficherHoraireCouleur(){
      console.log("coucouCouleur")
      if(this.horaireDuJour != null){
        if(this.horaireDuJour.length > 0){
          this.isDisabledDay = true;
          console.log(this.horaireDuJour); // Contient un tableau des horaires du jour choisi sous le format Horaire
        } else {
          console.log("pas d'horaire pour ce jour");
          this.isDisabledDay = false;
        } 
      }
    }//afficherHoraireCouleur*/


    afficherMois(){   
     this.affichageH = false; // On désactive le détail du jour
     this.jours.length = 0;
     this.joursMoisPrecedent.length = 0;
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
     // DOIT ETRE DANS UN TABLEAU SEPARÉ DE jours : c'est très important pour la gestion des indexes
     for(let i = 0; i < premierJoursMois; i++){
        //this.jours.push(permierJourMoisPrecedentAafficher);
        this.joursMoisPrecedent.push(new Jour(permierJourMoisPrecedentAafficher));
        permierJourMoisPrecedentAafficher++; 
     }

     let nbJoursMois = this.moisSelectionne.nbJour; // On fixe le nombre de jours en fonction du mois
     if(this.moisSelectionne.moisId == 1 && this.isAnneeBissextile(this.anneeSelectionne)) { nbJoursMois++; } // Si c'est le mois de février et que l'année est bissextile, on ajoute 1 jours
     // On remplis les jours du mois 
     for(let i = 1; i <= nbJoursMois; i++){
        this.jour = new Jour(i);
        this.jours.push(this.jour);
     }
     
     // VANESSA: ON POURRAIT PAS SE CONTENTER DE this.anneeSelectionne ?????
     //afficher l'année
     this.annee = this.anneeSelectionne;
     console.log(this.annee)

     this.getHoraires(this.annee, this.moisSelectionne.moisId+1);
     //this.addHoraireJour();
    }//afficherMois

      // PAS BESOIN
     //remplir les horaires du jour en paramètre
    /* addHoraireJour(){
      console.log(this.jours.length)
      if(this.jours != null){ // Si des jours existent
        for(let i = 0; i < this.jours.length; i++){
            this.getHoraireDuJour(this.jours[i].jour);
        }
      }
      this.disabledHoraire();
     }*/

    //Récupère la liste des horaires pour l'année et le mois passés en paramètre
    getHoraires(annee, mois){
      if(!this.isHorsLigne){ // Si on a internet
        this.abiBddCtrl.getHoraires(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), annee, mois).subscribe(
          data => {  
            if(data) { // Si les données sont bien chargées  
               window.localStorage.setItem('getHoraires_'+mois+'_'+annee, JSON.stringify(data));  // Création de la sauvegarde locale de ces horaires (mois et annee)
                this.traiterHoraires(data, annee, mois); // Traitement des horaires               
              } else { // Erreur
                  console.log("Aucun horaire pour cette periode");
              }
          }); 
      } else { // Mode hors ligne
          // Traitement des horaires à partir des données sauvegardés
          this.traiterHoraires(JSON.parse(window.localStorage.getItem('getHoraires_'+mois+'_'+annee)), annee, mois);      
      }
    }//getHoraires

    traiterHoraires(data, mois, annee){
      for(let i = 0; i < data.length; i++){ //Remplissage du tableau horaires avec les données des horaires formatées
        let horaire =  new Horaire(data[i].id, 
          new Date(data[i].annee, data[i].mois-1, data[i].jour),
          new Date(data[i].annee, data[i].mois-1, data[i].jour, data[i].heureDebut, data[i].minuteDebut),
          new Date(data[i].annee, data[i].mois-1, data[i].jour, data[i].heureFin, data[i].minuteFin)
        );                    
        this.jours[data[i].jour-1].addHoraire(horaire);  // On ajoute l'horaire au jour auquel il y lieu
        // Si on a internet on enregsitre les notif locales pour l'horaire -> inutile si on a pas internet car la notification pour cet horaire aura forcément déja été créee
        if(!this.isHorsLigne){ this.enregistrerNotification(horaire);} 
      }         
    }//traiterHoraires

    // Enregsitre la notification locale pour l'horaire passé en paramètre
    enregistrerNotification(horaire : Horaire){
        if(horaire.heureFin > new Date()){ // Si l'horaire est dans le futur (on ne va pas enregistrer des notif pour un horaire passé !)          
          this.notificationsLocalesCtrl.scheduleNotificationFinDeService(horaire.heureFin, horaire.affichageHeureDebut, horaire.affichageHeureFin, horaire.id); // On enregsitre la notification locale
        } else {
          console.log("On enregsitre pas de notification pour cet horaire : " + horaire.heureFin);
        }
    }//enregistrerNotification

     // PAS BESOIN
    // Récupére le mois sélectionné sous format String, et retourne le mois en format Mois correspondant
    /*getMoisSelectionne(mois : string) : Mois{
      for(let i = 0; i <= this.moisListe.length; i++){
           if(this.moisListe[i].nom === mois){
              return this.moisListe[i];
           }
        }
       return this.moisListe[0];
    }//getMoisSelectionne*/

    // PAS BESOIN
    //Récupère la liste des horaires pour le jour passé en paramètre
    /*getHoraireDuJour(jour){
        let dateDuJour = new Date(this.anneeSelectionne, this.moisSelectionne.moisId, jour.jour);
        this.horaireDuJour = []; // Tableau pour les horaires du jour
        if(this.horaires != null){ // Si des horaires existent
          for(let i = 0; i < this.horaires.length; i++){ // On parcour les horaires
              if(this.horaires[i].date.getTime() === dateDuJour.getTime()){ // Si l'horaire est pour la date du jour sélectionné (on passe en getTime() sinon il ne reconnait pas 2 dates pareilles !)
                this.horaireDuJour.push(this.horaires[i]); // On l'ajoute dans la liste 
                this.jour.tbHoraire.push(this.horaires[i]);
                console.log(this.jour.tbHoraire.push(this.horaires[i]))
                console.log(this.horaires[i].affichageHeureDebut);
                console.log(this.horaires[i].affichageHeureFin);
              }
          }
        }
         
    }//getHoraireDuJour*/

    
    /*disabledHoraire(){
      if(this.jour.tbHoraire != null){
        console.log(this.jour.tbHoraire.length)
        if(this.jour.tbHoraire.length > 0){
          this.isDisabledDay = true;
        }else{
          this.isDisabledDay = false;
        }
      }
    }*/
  
    /* J'ai créer des horaires pour ton utilisateur, comme ça tu peux tester :
    2017-02-16 : 11:00:00 à 14:00:00
    2017-02-16 : 18:00:00 à 22:00:00
    2017-02-17 : 17:00:00 à 23:00:00
    2017-02-19 : 11:00:00 à 13:00:00
    2017-02-21 : 11:00:00 à 21:00:00
    2017-02-23 : 10:00:00 à 16:00:00    
    2017-02-23 : 20:00:00 à 22:00:00
    */
    detailHoraire(jour : Jour){
      console.log(jour);
      this.horaireDuJour = jour.tbHoraire;   // CONTIENT LES HORAIRES DU JOUR MAIS L'AFFICHAGE NE MARCHE PASSSSSS :( :( :(
      console.log(this.horaireDuJour);
      this.pasHeure = this.horaireDuJour.length <= 0; //Contient false si on a pas d'horaire pour ce jour
      this.affichageH = true;
      this.selJour = jour.jour;
      /*for(let j = 0; j < this.jours.length; j++){
        if(this.jours[j].jour == jour){
          console.log("joursSel "+jour);
          this.affichageH = true;
          if(this.getHoraireDuJour.length > 0){
            this.pasHeure = false;
            console.log(this.horaireDuJour); // Contient un tableau des horaires du jour choisi sous le format Horaire
          } else {
            console.log("pas d'horaire pour ce jour");
            this.pasHeure = true;
          } 
          this.selJour = i; //récupération du jour choisi
          this.inputDisabled = true; //desactivation des champs horaires
          //  if(this.horaires.jour == i){
        }
      }*/
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

  
}//MeshorairesPage

