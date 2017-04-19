export class InfosEtablissement {
    jourEffectifConge : String;
    jourEffectifHeure : String;
    droitConge : String;
    droitVacancesMois : String;
    droitVacanceAnnee : String;
    droitJourFerieMois : String;
    droitJourFerieAnnee : String;
    heureSemaine : String;
    totalSemaine : String;
    heureMois : String;
    solde : String;

    constructor(droitVacanceAnnee : String, droitJourFerieAnnee : String,){
            this.droitVacanceAnnee = droitVacanceAnnee;
            this.droitJourFerieAnnee = droitJourFerieAnnee;
    }//constructor

}//Maladie
