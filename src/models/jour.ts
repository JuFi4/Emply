
import {Horaires} from '../models/horaires'
export class Jour {
    jour: number;
    tbHoraire : Horaires[];
    isJourDisabled = true;  //Est à true si le tableau d'horaire est vide
    
    constructor(jour){
        this.tbHoraire = [];
        this.jour = jour;
    }//constructor

    addHoraire(horaire : Horaires){
        this.tbHoraire.push(horaire);
        this.isJourDisabled = false;
    }//addHoraire
}//Jour