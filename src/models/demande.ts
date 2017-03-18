export class Demande {
    id : number;
    dateDebut : Date;
    dateFin : Date;
    motif : string;
    statut : string;
    id_typeDemande : string;
    nom_typeDemande : string;

    constructor(id, dateDebut, dateFin, motif, statut, id_typeDemande, nom_typeDemande){
        this.id = id; 
        this.dateDebut = dateDebut, 
        this.dateFin = dateFin; 
        this.motif = motif; 
        this.statut = statut;
        this.id_typeDemande = id_typeDemande; 
        this.nom_typeDemande = nom_typeDemande;
    }//constructor
}
