export class InfosEtablissement {
    jourEffectifConge : number;
    jourEffectifHeure : String;
    droitConge : String;
    droitVacancesMois : number;
    droitVacanceAnnee :number;
    droitJourFerieMois : String;
    droitJourFerieAnnee : number;
    heureSemaine : number;
    totalSemaine : String;
    heureMois : number;
    solde : String;
    jourPrisVac : number;
    jourPrisFer : number;

    constructor(droitVacanceAnnee : number, droitJourFerieAnnee : number, heureMois : number, 
                heureSemaine : number, jourPrisVac : number, jourPrisFer : number){
            this.droitVacanceAnnee = droitVacanceAnnee;
            this.droitJourFerieAnnee = droitJourFerieAnnee;
            this.heureMois = heureMois;
            this.heureSemaine = heureSemaine;
            this.jourPrisFer = jourPrisFer;
            this.jourPrisVac = jourPrisVac;
    }//constructor

}//InfoEtablissement
