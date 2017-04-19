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
    isJourneeComplete : boolean;

    constructor(id, dateDebut, dateFin, motif, isJourneeComplete, statut, id_typeDemande, nom_typeDemande){
        this.id = id; 
        this.dateDebut = dateDebut, 
        this.dateFin = dateFin; 
        this.motif = motif; 
         this.isJourneeComplete = isJourneeComplete; 
        this.statut = statut;       
        this.id_typeDemande = id_typeDemande; 
        this.nom_typeDemande = nom_typeDemande;
        this.affichageDateDebut = ('0' + dateDebut.getDate()).slice(-2) + "-"+ ('0' + (dateDebut.getMonth() + 1)).slice(-2) + "-" + dateDebut.getFullYear();
        this.affichageDateFin =('0' + dateFin.getDate()).slice(-2) + "-"+ ('0' + (dateFin.getMonth() + 1)).slice(-2) + "-" + dateFin.getFullYear();
        if(!isJourneeComplete){
            this.affichageDateDebut+= " à " +  ('0' + (dateDebut.getHours())).slice(-2) + ':' + ('0' + dateDebut.getMinutes()).slice(-2);
            this.affichageDateFin+= " à " +  ('0' + (dateFin.getHours())).slice(-2) + ':' + ('0' + dateFin.getMinutes()).slice(-2);
        }
        if(this.statut === "new" || this.statut === "modify"){ this.isNew = true;}
        else if(this.statut === "accept" || this.statut === "modifyAccept") { this.isAccept = true;}
        else if(this.statut === "refuse" || this.statut === "modifyRefuse") { this.isRefuse = true;}
    }//constructor
}//Demande
