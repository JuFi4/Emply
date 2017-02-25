export class Horaires {
    id : number;
    date : Date;
    heureDebut: Date;
    heureFin : Date;
    affichageHeureDebut : string;
    affichageHeureFin : string;

    constructor(id, date, heureDebut, heureFin){
        this.id = id; this.date = date, this.heureDebut = heureDebut, this.heureFin = heureFin;
        this.affichageHeureDebut = this.heureDebut.getHours()+":"+(this.heureDebut.getMinutes() <= 9 ? "0"+this.heureDebut.getMinutes() : this.heureDebut.getMinutes());
        this.affichageHeureFin = this.heureFin.getHours()+":"+(this.heureFin.getMinutes() <= 9 ? "0"+this.heureFin.getMinutes() : this.heureFin.getMinutes());
    }//constructor
}//Horaires