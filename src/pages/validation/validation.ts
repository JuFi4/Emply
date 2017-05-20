//Controle page

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// Providers
import { ApiBddService } from '../../providers/api-bdd-service';
import { ConnectivityService } from '../../providers/connectivity-service';
import { AffichageValidationHoraireService } from '../../providers/affichage-validation-horaire-service';
import { ApiPdfService } from '../../providers/api-pdf-service';
import { AlertsToasts } from '../../providers/alerts-toasts';

// Models
import {Horaire} from '../../models/horaire';

@Component({
  selector: 'page-validation',
  templateUrl: 'validation.html'
})
export class ValidationPage {

isHorsLigne : boolean;
horairesAttenteValidation : Horaire[];

  constructor(public pdfCtrl: ApiPdfService, public navCtrl: NavController, public navParams: NavParams, private abiBddCtrl: 
            ApiBddService, private connectivityService: ConnectivityService, private affichageValidation : AffichageValidationHoraireService, private AlertsToasts: AlertsToasts)
  {
    this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1' || connectivityService.isOffline();

    // Méthodes à lancer au chargement de la page
    this.getHorairesAttenteValidation(); // On charge et on gère les horaires en attente de validation
  }//constructor

  ionViewDidLoad() {
    console.log('Hello Validation Page');
  }//ionViewDidLoad

  getHorairesAttenteValidation () {
    if(!this.isHorsLigne){ // Si on a internet
              this.abiBddCtrl.getHorairesAttenteValidation(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD')).subscribe(
                data => {  
                  if(data) { // Si les données sont bien chargées 
                      console.log("Les horaires en attente de validation ont été chargés.");
                      window.localStorage.setItem('getHorairesAttenteValidation', JSON.stringify(data));//On sauvegarde les données en local    
                      this.traiterHorairesAttenteValidation(data);      
                  } else { 
                    this.AlertsToasts.afficherErreurChargementValidation();
                  }              
                }); 
    } else { // Mode hors ligne 
      // Traitement des horaires à partir des données sauvegardés            
             this.traiterHorairesAttenteValidation(JSON.parse(window.localStorage.getItem('getHorairesAttenteValidation')));   
    }
  } //getHorairesAttenteValidation

  traiterHorairesAttenteValidation(data){    
      this.horairesAttenteValidation = [] // On instancie le tableau des horaires en attente de validation
      for(let i = 0; i < data.length; i++){ //Remplissage du tableau avec les données des horaires formatées
        let dateHoraire = new Date(data[i].date);
        let horaire =  new Horaire(data[i].id, 
          dateHoraire,         
          new Date(dateHoraire.getFullYear(), dateHoraire.getMonth(), dateHoraire.getDate(), data[i].heureDebut, data[i].minuteDebut),
          new Date(dateHoraire.getFullYear(), dateHoraire.getMonth(), dateHoraire.getDate(), data[i].heureFin, data[i].minuteFin)
        );            
        this.horairesAttenteValidation.push(horaire);  // On ajoute l'horaire dans le tableau
      } 
  }//traiterHorairesAttenteValidation

  afficherValidationAttenteAlert(horaire : Horaire) {
      this.affichageValidation.afficherAlertFinDeService(horaire).then(result => this.getHorairesAttenteValidation());
  }//afficherValidationAttenteAlert

  telechargerPDF(){
      let date = new Date();
      let mois = date.getMonth();// Mois actuel : on ne soutrait pas 1 pour avoir le mois dernier car JavaScript compte déja les mois avec une décalage de 1
     let annee = date.getFullYear();
      if(mois == 0){ // Si on est en janvier : il faut afficher décémbre dernier
        mois = 12;//On fixe le mois
        annee-=1;//On décrémente l'année de 1
      }
      this.pdfCtrl.getPdfValMensuelle(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), annee.toString(), mois.toString());
  }//telechargerPDF

}//ValidationPage
