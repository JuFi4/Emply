export class Horaires {
    id : number;
    date : Date;
    heureDebut: Date;
    heureFin : Date;

    constructor(id, date, heureDebut, heureFin){
        this.id = id; this.date = date, this.heureDebut = heureDebut, this.heureFin = heureFin;
    }//constructor
}//Horaires