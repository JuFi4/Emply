
import {Horaire} from '../models/horaire'
export class Jour {
    jour: number;
    tbHoraire : Horaire[];
    hasHoraire = false;
    
    constructor(jour){
        this.tbHoraire = [];
        this.jour = jour;
    }//constructor

    addHoraire(horaire : Horaire){
        this.tbHoraire.push(horaire);
        this.hasHoraire = true;
    }//addHoraire
}//Jour