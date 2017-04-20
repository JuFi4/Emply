
import {Horaire} from '../models/horaire';
import {Demande} from '../models/demande';
import {Maladie} from '../models/Maladie';

export class Jour {
    jour: number;
    date : Date;
    tbHoraire : Horaire[];
    tbDemande : Demande[];
    enMaladie : Maladie;
    hasHoraire = false;
    hasDemande = false;
    isAujourdhui = false;
    isMaladie = false;
    isAccident = false;
    
    constructor(jour, date : Date){
        this.tbHoraire = [];
        this.tbDemande = [];
        this.jour = jour;
        this.date = date;
        this.enMaladie = null;
    }//constructor

    addHoraire(horaire : Horaire){
        this.tbHoraire.push(horaire);
        this.hasHoraire = true;
    }//addHoraire

     setMaladie(maladie : Maladie){
        this.enMaladie = maladie;
        this.hasHoraire = false;
        if(maladie.isAccident) { this.isAccident = true } else { this.isMaladie = true }
    }//addHoraire

     addDemande(demande : Demande){
        this.tbDemande.push(demande);   
        this.hasDemande = true;     
        if(demande.isJourneeComplete) { //Si c'est une journée complete : on annule l'horaire et on met la jour comme "demande"
            this.hasHoraire = false; 
        }
    }//addDemande

}//Jour