import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// Providers
import { ApiBddService } from '../../providers/api-bdd-service';
import { ConnectivityService } from '../../providers/connectivity-service';
import { AffichageValidationHoraireService } from '../../providers/affichage-validation-horaire-service';

// Models
import {Horaire} from '../../models/horaire';

/*
  Generated class for the Controle page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-validation',
  templateUrl: 'validation.html'
})
export class ValidationPage {

isHorsLigne : boolean;
horairesAttenteValidation : Horaire[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private abiBddCtrl: ApiBddService, private connectivityService: ConnectivityService
   //public pushHoraireAttente : AffichageValidationHoraireService
   ) {
    this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1' || connectivityService.isOffline();

    // Méthodes à lancer au chargement de la page
    this.getHorairesAttenteValidation(); // On charge et on gère les horaires en attente de validation
  }

  ionViewDidLoad() {
    console.log('Hello Validation Page');
  }

  getHorairesAttenteValidation () {
    if(!this.isHorsLigne){ // Si on a internet
              this.abiBddCtrl.getHorairesAttenteValidation(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD')).subscribe(
                data => {  
                  if(data) { // Si les données sont bien chargées 
                      console.log("Les horaires en attente de validation ont été chargés.");
                      this.traiterHorairesAttenteValidation(data);      
                  } else { 
                      console.log("Les horaires en attente de validation n'ont pas été chargés.");
                  }              
                }); 
    } else { // Mode hors ligne 
            // Traitement des horaires à partir des données sauvegardés : mode hors-ligne, ou synchronisation du calendrier au cas ou les horaires n'ont pas changés
            console.log("Tu es hors ligne")      
    }
  } //getHorairesAttenteValidation

  traiterHorairesAttenteValidation(data){
      this.horairesAttenteValidation = [] // On instancie le tableau des horaires en attente de validation
      //let verifierCalendrierEvents = (data.length > 0) ? false : true; // On instancie la vérification des horaire en attente de validation à false, SAUF si le tableau des nouveaux horaires est vide
      for(let i = 0; i < data.length; i++){ //Remplissage du tableau avec les données des horaires formatées
        let dateHoraire = new Date(data[i].date);
        let horaire =  new Horaire(data[i].id, 
          dateHoraire,         
          new Date(dateHoraire.getFullYear(), dateHoraire.getMonth(), dateHoraire.getDate(), data[i].heureDebut, data[i].minuteDebut),
          new Date(dateHoraire.getFullYear(), dateHoraire.getMonth(), dateHoraire.getDate(), data[i].heureFin, data[i].minuteFin)
        );            
        this.horairesAttenteValidation.push(horaire);  // On ajoute l'horaire dans le tableau
      } //For
      console.log(this.horairesAttenteValidation);
  }//traiterHorairesAttenteValidation

  afficherValidationAttenteAlert(horaire) {
      // TODO: corriger pour que ça ouvre la bonne alerte qui permettera de valider l'horaire dans la BDD et mettre la valeur de tra_valide à 1
      //this.pushHoraireAttente.afficherNotificationFinDeService("Validation de l'horaire en attente", "Blabla", 1, horaire);
  }

}
