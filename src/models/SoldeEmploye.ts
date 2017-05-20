export class SoldeEmploye {
    soldeConge : number;
    soldeHeure : number;
    soldeVacance : number;
    soldeFerier : number;

    constructor(soldeConge : number, soldeFerier : number, soldeHeure : number, soldeVacance : number){
        this.soldeConge = soldeConge;
        this.soldeHeure = soldeHeure;
        this.soldeFerier = soldeFerier;
        this.soldeVacance = soldeVacance;
    }//constructor
}//SoldeEmploye
