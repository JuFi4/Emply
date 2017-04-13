export class Horaire {
    id : number;
    date : Date;
    heureDebut: Date;
    heureFin : Date;
    affichageHeureDebut : string;
    affichageHeureFin : string;
    affichageDateAttente : string;

    constructor(id, date, heureDebut, heureFin){
        this.id = id; 
        this.date = date, 
        this.heureDebut = heureDebut, 
        this.heureFin = heureFin;
        this.affichageHeureDebut = (this.heureDebut.getHours() <= 9 ? "0"+this.heureDebut.getHours() : this.heureDebut.getHours())+":"+(this.heureDebut.getMinutes() <= 9 ? "0"+this.heureDebut.getMinutes() : this.heureDebut.getMinutes());
        this.affichageHeureFin =  (this.heureFin.getHours() <= 9 ? "0"+this.heureFin.getHours() : this.heureFin.getHours())+":"+(this.heureFin.getMinutes() <= 9 ? "0"+this.heureFin.getMinutes() : this.heureFin.getMinutes());
        this.affichageDateAttente = (this.date.getDate() <= 9 ? "0"+this.date.getDate() : this.date.getDate())+"."+(this.date.getMonth() <= 8 ? "0"+(this.date.getMonth()+1) : (this.date.getMonth()+1))+"."+this.date.getFullYear();
}//constructor
}//Horaires