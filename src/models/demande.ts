export class Demande {
    id : number;
    dateDebut : Date;
    dateFin : Date;
    motif : string;
    statut : string;
    id_typeDemande : string;
    nom_typeDemande : string;
    isAccept = false;
    isNew = false;
    isRefuse = false;
    affichageDateDebut : string;
    affichageDateFin : string;

    constructor(id, dateDebut, dateFin, motif, statut, id_typeDemande, nom_typeDemande){
        this.id = id; 
        this.dateDebut = dateDebut, 
        this.dateFin = dateFin; 
        this.motif = motif; 
        this.statut = statut;
        this.id_typeDemande = id_typeDemande; 
        this.nom_typeDemande = nom_typeDemande;
        this.affichageDateDebut = (this.dateDebut.getDate() <= 9 ? "0"+this.dateDebut.getDate() : this.dateDebut.getDate())+"."+(this.dateDebut.getMonth() <= 8 ? "0"+(this.dateDebut.getMonth()+1) : (this.dateDebut.getMonth()+1))+"."+this.dateDebut.getFullYear();
        this.affichageDateFin =  (this.dateFin.getDate() <= 9 ? "0"+this.dateFin.getDate() : this.dateFin.getDate())+"."+(this.dateFin.getMonth() <= 8 ? "0"+(this.dateFin.getMonth()+1) : (this.dateFin.getMonth()+1))+"."+this.dateFin.getFullYear();
        if(this.statut === "new" || this.statut === "modify"){ this.isNew = true;}
        else if(this.statut === "accept" || this.statut === "modifyAccept") { this.isAccept = true;}
        else if(this.statut === "refuse" || this.statut === "modifyRefuse") { this.isRefuse = true;}
    }//constructor
}//Demande
