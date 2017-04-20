export class Maladie {
    id : number;
    dateDebut : Date;
    dateFin : Date;
    isAccident : boolean;
    affichageDateDebut : string;
    affichageDateFin : string;

    constructor(id, dateDebut : Date, dateFin : Date, isAccident){
        this.id = id; 
        this.dateDebut = dateDebut, 
        this.dateFin = dateFin; 
        this.isAccident = isAccident; 
        this.affichageDateDebut = ('0' + dateDebut.getDate()).slice(-2) + "-"+ ('0' + (dateDebut.getMonth() + 1)).slice(-2) + "-" + dateDebut.getFullYear();
        this.affichageDateFin = ('0' + dateFin.getDate()).slice(-2) + "-"+ ('0' + (dateFin.getMonth() + 1)).slice(-2) + "-" + dateFin.getFullYear();
    }//constructor
}//Maladie
