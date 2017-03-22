
import {Horaire} from '../models/horaire'
export class Jour {
    jour: number;
    date : Date;
    tbHoraire : Horaire[];
    hasHoraire = false;
    isMaladie = false;
    isAccident = false;
    isVacance = false;
    isFormation = false;
    isPaternite = false;
    isCongeSansSolde = false;
    isRecuperation = false;
    isAutreDemande = false;
    
    constructor(jour, date : Date){
        this.tbHoraire = [];
        this.jour = jour;
        this.date = date;
    }//constructor

    addHoraire(horaire : Horaire){
        this.tbHoraire.push(horaire);
        this.hasHoraire = true;
    }//addHoraire

    setIsMaladie(){ this.isMaladie = true; }
    setIsAccident(){ this.isAccident = true; }
    setIsVacance(){ this.isVacance = true; }
    setIsPaternite(){ this.isPaternite = true; }
    setIsFormation(){ this.isFormation = true; }
    setIsCongeSansSolde(){ this.isCongeSansSolde = true; }
    setIsRecuperation(){ this.isRecuperation = true; }
    setIsAutreDemande(){ this.isAutreDemande = true; }
}//Jour