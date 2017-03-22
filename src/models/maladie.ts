export class Maladie {
    id : number;
    dateDebut : Date;
    dateFin : Date;
    isAccident : boolean;

    constructor(id, dateDebut, dateFin, isAccident){
        this.id = id; 
        this.dateDebut = dateDebut, 
        this.dateFin = dateFin; 
        this.isAccident = isAccident; 
    }//constructor
}//Maladie
