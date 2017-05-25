//Meshoraires page
import { Component, Input} from '@angular/core';
import{ NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import {Calendar} from 'ionic-native';

// Providers
import { NotificationsLocalesService } from '../../providers/notifications-locales-service';
import {MoisService} from '../../providers/mois-service';
import { ApiBddService } from '../../providers/api-bdd-service';
import { ConnectivityService } from '../../providers/connectivity-service';
import { ApiPdfService } from '../../providers/api-pdf-service';

//models
import {Mois} from '../../models/mois';
import {Semaine} from '../../models/semaine';
import {Horaire} from '../../models/horaire';
import {Jour} from '../../models/jour';
import {CalendrierEvent} from '../../models/calendrierEvent';
import {Etablissement} from '../../models/etablissement';
import {Demande} from '../../models/demande';
import {Maladie} from '../../models/Maladie';

@Component({
  selector: 'page-meshoraires',
  templateUrl: 'meshoraires.html'
})
export class MeshorairesPage {  
  moisListe: Mois[];
  moisSelectionne : Mois;
  semaines : Semaine[]
  semaine : Semaine;
  jours : Jour[] = [];
  demandesDuMois : Demande[] = [];
  maladiesDuMois : Maladie[] = [];
  horairesDuMois : Horaire[] = [];
  joursMoisPrecedent : Jour[] = [];
  jour : Jour;
  selJour : any = [];
  annee : any = []; 
  inputDisabled : boolean;    
  dateCourrante = new Date();
  annneeCourrante = new Date().getFullYear(); // Année courrante
  anneeSelectionne : number; 
  moisCourant = new Date().getMonth();  
  isHorsLigne : boolean;

   horairesDuJour : Horaire[]; // Tableau qui contient les horaires du jour selectionné
   demandesDuJour : Demande[]; // Tableau qui contient les demandes du jour selectionné  
   isMaladie = false;
   isAccident = false;
   hasHoraire = false;
   affichageDetailH = false;
   maladieDuJour : Maladie;
   isJourVide = true;

   constructor(public pdfCtrl: ApiPdfService, private loadCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public notificationsLocalesCtrl : NotificationsLocalesService,
    public moisService : MoisService, public alertCtrl: AlertController, private abiBddCtrl: ApiBddService, private connectivityService: ConnectivityService) {   
     // Instanciation des valeurs par défaut
     this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1' || connectivityService.isOffline();
     this.moisService.getSemaine().then(semaines => this.semaines = semaines);
     this.moisService.getMois().then(moisListe => this.moisListe = moisListe).then(result => this.selectionnerMois());
     this.anneeSelectionne = this.annneeCourrante; // Par défaut : l'année sélectionnée est l'année courante   

     // On fixe les heures, minutes et secondes de la date actuelle à 0
     this.dateCourrante.setHours(0);
     this.dateCourrante.setMinutes(0);
     this.dateCourrante.setSeconds(0);       

     // Méthodes à lancer au chargement de la page
     this.supprimerAnciennesSauvegares(); //Supprime les sauvegardes locales trop ancienne pour éviter de surcharger la mémoire du téléphone    
  }//constructor

    ionViewDidLoad() {
      console.log('Hello MesHoraires Page');      
    }//ionViewDidLoad

    selectionnerMois(){
        this.moisSelectionne = this.moisListe[this.moisCourant]; 
        this.afficherMois();
    }//selectionnerMois

    afficherMois(){          
    this.affichageDetailH = false; // On désactive le détail du jour
     this.jours.length = 0;
     this.joursMoisPrecedent.length = 0;
     let premierJoursMois = new Date(this.anneeSelectionne, this.moisSelectionne.moisId, 0).getDay(); // On définit quel est le 1er jours du mois (code de 0 à 6 qui défini quel est le jour de la semaine)
    
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
        this.joursMoisPrecedent.push(new Jour(permierJourMoisPrecedentAafficher, null));
        permierJourMoisPrecedentAafficher++; 
     }

     let nbJoursMois = this.moisSelectionne.nbJour; // On fixe le nombre de jours en fonction du mois
     if(this.moisSelectionne.moisId == 1 && this.isAnneeBissextile(this.anneeSelectionne)) { nbJoursMois++; } // Si c'est le mois de février et que l'année est bissextile, on ajoute 1 jours
    
     // On remplis les jours du mois 
     for(let i = 1; i <= nbJoursMois; i++){
        this.jours.push(new Jour(i, new Date(this.anneeSelectionne, this.moisSelectionne.moisId, i)));
     }

      if(this.moisSelectionne.moisId == this.moisCourant){ // Si le mois à afficher est le mois courant
          this.jours[this.dateCourrante.getDate()-1].isAujourdhui = true; // On définie le jour d'aujourd'hui
       }

     this.getControleMensuel(this.anneeSelectionne, this.moisSelectionne.moisId+1);
    }//afficherMois
     
    //Récupère la liste des horaires pour l'année et le mois passés en paramètre
    getControleMensuel(annee, mois){
      if(!this.isHorsLigne){ // Si on a internet

        //Icone de chargement
        let loader = this.loadCtrl.create({
          content: "Chargement"
        });  
        loader.present();

        // 1) on récupres les horaires
        // 2) on récupère les maladies/ accidents pour ce mois
        // 3) on récupère les demandes validées pour ce mois
        // 4) on traite tout ça
        // 5) on arrête l'icone de chargement
        this.getHorairesMensuels(annee, mois)
          .then(result => this.getMaladiesParMois(annee, mois))
            .then(result => this.getDemandesParMois(annee, mois))
              .then(result => this.traiterControleMensuel(annee, mois, false))
                .then(result => loader.dismiss());
      
      } else {//Mode hors ligne : traitement des données avec l'indicateur hors ligne
         this.traiterControleMensuel(annee, mois, true);     
      }         
    }//getControleMensuel

    // Retourne une Promise toujours résolue pour gérer l'asynchronicité
    getHorairesMensuels(annee, mois){
      return new Promise((resolve, reject) => {
          this.horairesDuMois = []; // On récupère les horaires pour ce mois
          this.abiBddCtrl.getHorairesMensuels(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), annee, mois).subscribe(
          data => {  
            if(data) { // Si les données sont bien chargées 
                for(let i = 0; i < data.length; i++){ //Remplissage du tableau horaires avec les données des horaires formatées
                      let dateHoraire = new Date(data[i].date);
                      let horaire =  new Horaire(data[i].id, 
                        dateHoraire,         
                        new Date(dateHoraire.getFullYear(), dateHoraire.getMonth(), dateHoraire.getDate(), data[i].heureDebut, data[i].minuteDebut),
                        new Date(dateHoraire.getFullYear(), dateHoraire.getMonth(), dateHoraire.getDate(), data[i].heureFin, data[i].minuteFin)
                      );                    
                       this.jours[dateHoraire.getDate()-1].addHoraire(horaire);//On ajoute l'horaire au jours auquel il a lieu
                  }//for
                  resolve(true); // On résout la promise à true
              } else {       
                 resolve(false);  // On résout la promise à false  
              }              
          }); 
      });
    }//getHorairesMensuels

    // Retourne une Promise toujours résolue pour gérer l'asynchronicité
   getMaladiesParMois(annee, mois){
      return new Promise((resolve, reject) => {
       this.maladiesDuMois = []; //On initialise l'array
        this.abiBddCtrl.getMaladiesParMois(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), annee, mois).subscribe(
           data => {  
               if(data) { // Si les données sont bien chargées 
                  for(let i = 0; i < data.length; i++){ //Remplissage du tableau maladies avec les données demandes formatées
                    this.maladiesDuMois.push(new Maladie(data[i].id, new Date(data[i].dateDebut), new Date(data[i].dateFin), data[i].isAccident));                              
                   }//for
                    resolve(true); // On résout la promise à true
               } else {
                   resolve(false); // On résout la promise à false 
              }              
          });
       });
   }//getMaladiesParMois

   // Retourne une Promise toujours résolue pour gérer l'asynchronicité
   getDemandesParMois(annee, mois){
     return new Promise((resolve, reject) => {
        this.demandesDuMois = []; //On initialise l'array
        this.abiBddCtrl.getDemandesParMois(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), annee, mois).subscribe(
            data => {   
              if(data) { // Si les données sont bien chargées 
                   for(let i = 0; i < data.length; i++){ //Remplissage du tableau demandes avec les données demandes formatées
                       this.demandesDuMois.push(new Demande(data[i].id, new Date(data[i].dateDebut), new Date(data[i].dateFin), data[i].motif,  data[i].isJourneeComplete, "", data[i].id_typeDemande, data[i].nom_typeDemande));
                   }    
                  resolve(true); // On résout la promise à true
               } else {
                 resolve(false); // On résout la promise à false     
               }            
          });       
     });
   }//getDemandesParMois

  // Traitement des données du controle mensuel 
  traiterControleMensuel(annee, mois, isHorsLigne){   
    if(!isHorsLigne){//Si on est pas hors ligne : on va utiliser les données récupéres précédemment
      for(let i = 0; i < this.jours.length; i++){
          if(!this.setMaladieOnJour(this.jours[i])){ // On regarde si on était on maladie/accident 
              this.setDemandeOnJour(this.jours[i]);//Si ce n'est pas le cas: on regarde si on était en "congé"
          }
      }
      window.localStorage.setItem("getControleMensuel_"+ annee +"_"+ mois, JSON.stringify(this.jours));//On enregsitre
    } else { //Si on est hors-ligne: on récupère les jours enregistrés en local*/
      let savedJours : Jour[];
      savedJours= JSON.parse(window.localStorage.getItem("getControleMensuel_"+ annee +"_"+ mois));//On récuèr les jours sauvegardés      
      if(savedJours != null && savedJours.length > 0) {//Si ces jours existement 
        this.jours = savedJours;//On remplace this.jours par les jours sauvegardés
                                // -> Ce qui veut dire que son on a pas ces jours sauvés, ça va afficher le calendrier avec aucune info dans les jours
      } else {
        return;//On garde les jours vides
      }
    }
    if(mois == this.dateCourrante.getMonth()+1){ // Si le mois qu'on traite est le mois courant
      this.detailHoraire(this.jours[this.dateCourrante.getDate()-1]); // On affiche le détail du jours courant
    }
  }//traiterControleMensuel

   setMaladieOnJour(jour : Jour) : boolean {
     let output = false;
      for(let i = 0; i < this.maladiesDuMois.length; i++){
        if(jour.date.setHours(0) >= this.maladiesDuMois[i].dateDebut.setHours(0) && jour.date.setHours(0) <= this.maladiesDuMois[i].dateFin.setHours(0)){ // Si on était malade ce jours là
          jour.setMaladie(this.maladiesDuMois[i]);
            output = true;
        }
      }
      return output;
   }//setMaladieOnJour

    setDemandeOnJour(jour : Jour) : boolean {
      for(let i = 0; i < this.demandesDuMois.length; i++){
        // On règle les heures, minutes et secondes à zéro pour que la comparaison fonctionne
        jour.date.setHours(0);
        jour.date.setMinutes(0);
        jour.date.setSeconds(0);
        this.demandesDuMois[i].dateDebut.setHours(0) ;
        this.demandesDuMois[i].dateDebut.setMinutes(0);
        this.demandesDuMois[i].dateDebut.setSeconds(0);
        this.demandesDuMois[i].dateFin.setHours(0);
        this.demandesDuMois[i].dateFin.setMinutes(0);
        this.demandesDuMois[i].dateFin.setSeconds(0);

        if(jour.date >= this.demandesDuMois[i].dateDebut && jour.date <= this.demandesDuMois[i].dateFin){ // Si on avait une demande pour ce jours là
            jour.addDemande(this.demandesDuMois[i]); //On ajoute la demande ce jour  
            return true;
        }
      }
      return false;
    }//setDemandeOnJour  

    // Supprime les sauvegardes locales trop anciennes pour ne pas surcharger le téléphone
    supprimerAnciennesSauvegares(){
      let dateMax = new Date();
      dateMax.setMonth(dateMax.getMonth()-6); // On enlève 6 mois
      for(let a = (dateMax.getFullYear()-1); a < (dateMax.getFullYear()); a++){
        for(let m = 1; m <=12; m++){
             window.localStorage.removeItem('getControleMensuel_'+a+'_'+m);
        }
      }     
    }//supprimerAnciennesSauvegares   

    // Remise à zéro des paramètres du détail d'un horaire
    resetDetailHoraire(){
      this.isMaladie = false;
      this.isAccident = false;
      this.hasHoraire = false;
      this.horairesDuJour = []
      this.demandesDuJour = []
      this.affichageDetailH = true;
      this.maladieDuJour = null;
      this.isJourVide = true;
    }//resetDetailHoraire
    
    detailHoraire(jour : Jour){
      this.resetDetailHoraire();
      if(jour.hasHoraire){ this.horairesDuJour = jour.tbHoraire; this.hasHoraire = true; this.isJourVide = false;}
      if(jour.hasDemande) {  this.demandesDuJour = jour.tbDemande; this.isJourVide = false;}
      if(jour.isAccident) { this.isAccident = true;  this.isJourVide = false;}
      if(jour.isMaladie){ this.isMaladie = true; this.isJourVide = false;}
      if(jour.enMaladie != null ) { this.maladieDuJour = jour.enMaladie; this.isJourVide = false;}
      this.selJour = jour.jour; 
   }//DetailHoraire


    goToMoisPrecedent(){
      // On regarde quel est le mois précédent (par rapport au moisId)
      let idMois = this.moisSelectionne.moisId - 1;
      // Si on est en janvier, c'est décembre (ID 11), et on change également d'année (décrément)
      if(idMois === -1) { 
        idMois = 11;
        this.anneeSelectionne--;
      };
      // On définit ce mois comme moisSelectionne, et on appelle l'affichage.
      this.moisSelectionne = this.moisListe[idMois];
      this.afficherMois();
    }//goToMoisPrecedent

    goToMoisSuivant(){
      // On regarde quel est le mois suivant (par rapport au moisId)
      let idMois = this.moisSelectionne.moisId +1;
      // Si on est en décembre, c'est janvier (ID 0), et on change également d'année (incrément)
      if(idMois === 12) { 
        idMois = 0;
        this.anneeSelectionne++;
      };
      // On définit le mois comme moisSelectionne, et on appelle l'affichage.
      this.moisSelectionne = this.moisListe[idMois];
      this.afficherMois();
    }//goToMoisSuivant

    changerMois(e){
      if (e.direction == 2) { // Vers la gauche
          this.goToMoisSuivant();          
      } else if (e.direction == 4) { // Vers la droite
        this.goToMoisPrecedent();
      }
    }//changerMois

   isAnneeBissextile(annee){
      return new Date(annee, 2, 0).getDate() == 29
    }//isAnneeBissextile

   telechargerPDF(){
      this.pdfCtrl.getPdfCalendrier(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), this.anneeSelectionne, (this.moisSelectionne.moisId+1));
   }//telechargerPDF
  
}//MeshorairesPage

