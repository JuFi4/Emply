
import {Horaires} from '../models/horaires'
export class Jour {
    jour: number;
    tbHoraire : Horaires[];
    constructor(jour){
        this.jour = jour;
    }//constructor
}