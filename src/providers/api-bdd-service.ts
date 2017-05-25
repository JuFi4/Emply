//ApiBddService

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';


//Models
import { Utilisateur } from '../models/utilisateur';
import { Etablissement } from '../models/etablissement';

@Injectable()
export class ApiBddService {  
  baseUrl = 'https://ctrl-ccnt.ch/assets/php/api/apiBdd.php?'; // URL du service web

  constructor(public http: Http) {
  }//constructor

 // Connexion d'un utilisateur
 // Renvoie :  un JSON avec les données utilisateurs (connexion résussi), soit False (connexion échouée)
  connexion(login : string, password: string, deviceToken: string){  
    var url =this.baseUrl + 'type=connect&login=' + encodeURI(login) + '&password=' + encodeURI(password) + '&deviceToken=' + encodeURI(deviceToken);
    console.log(url);
    var response = this.http.get(url).map(res => res.json());  
    return response;
   }//connexion

 // Déconnexion  d'un utilisateur
 // Renvoie : true ou false. TRUE = déconnexion effectule, FALSE = erreur (mauvais  userId ou Token)
  deconnexion(userId : string, token: string)  {    
     var url =this.baseUrl + 'type=logout&userId=' + encodeURI(userId) + '&token=' + encodeURI(token);
     console.log(url);
     var response = this.http.get(url).map(res => res.json());
     return response;
   }//deconnexion

  // Requête pour générer un nouveau mot de passe
 // / Renvoie : true ou false. TRUE = nouveau mot de passe généré + envoyé par mail, FALSE = erreur  => l'adresse email n'existe pas
  setNewPassword(email : string){
     var url =this.baseUrl + 'type=setNewPassword&email=' + encodeURI(email);
     console.log(url);
     var response = this.http.get(url).map(res => res.json());
     return response;
   }//setNewPassword

 // Récupération du profil d'un utilisateur
 // Renvoie :  un JSON avec les données du profil utilisateurs (requête réussie), soit False (requête réussie)
  getProfil(userId : string, token: string) : Observable<Utilisateur> {
     var url =this.baseUrl + 'type=getProfil&userId=' + encodeURI(userId) + '&token=' + encodeURI(token);
     console.log(url);
     var response = this.http.get(url).map(res => <Utilisateur>res.json());
     return response;
   }//getProfil

  // Récupération de l'établissement d'un utilisateur
 // Renvoie : un JSON avec les données du profil utilisateurs (requête réussie), soit False (requête réussie)
  getEtablissement(userId : string, token: string) : Observable<Etablissement> {
     var url =this.baseUrl + 'type=getEtablissement&userId=' + encodeURI(userId) + '&token=' + encodeURI(token);
     console.log(url);
     var response = this.http.get(url).map(res => <Etablissement>res.json());
     return response;
   }//getEtablissement

 // Modification du profil d'un utilisateur
 // Renvoie : true ou false. TRUE = modification enregsitrée, FALSE = erreur (mauvais userId ou Token)
  setProfil(userId : string, token: string, nom : string, prenom : string, dateNaissance : string, adresse : string, suppAdresse : string, 
            codePostal : number, ville : string, telFix : string, telMobile: string)  {
     var url =this.baseUrl + 'type=setProfil&userId=' + encodeURI(userId) + '&token=' + encodeURI(token) + '&nom=' + encodeURI(nom) + '&prenom=' + encodeURI(prenom) + 
         '&dateNaissance=' + encodeURI(dateNaissance) + '&adresse=' + encodeURI(adresse) + '&suppAdresse=' + encodeURI(suppAdresse) + 
         '&codePostal=' + encodeURI(codePostal.toString()) + '&ville=' + encodeURI(ville) + '&telFix=' + encodeURI(telFix) + '&telMobile=' + encodeURI(telMobile);
     console.log(url);
     var response = this.http.get(url).map(res => res.json());
     return response;
   }//setProfil

  // Modification du mot de passe d'un utilisateur
 // Renvoie : true ou false. TRUE = modification enregsitrée, FALSE = erreur (mauvais mot  de passe, ou userId ou Token)
  setPassword(userId : string, token: string, ancienPassword : string, nouveauPassword : string)  {
     var url =this.baseUrl + 'type=setPassword&userId=' + encodeURI(userId) + '&token=' + encodeURI(token) + '&oldPassword=' + encodeURI(ancienPassword) + '&newPassword=' + encodeURI(nouveauPassword);
     console.log(url);
     var response = this.http.get(url).map(res => res.json());
     return response;
   }//setPassword

 // Modification de l'adresse email  d'un utilisateur
 // Renvoie : true ou false. TRUE = modification enregsitrée, FALSE = erreur (mauvais mot  de passe, ou userId ou Token)
  setEmail(userId : string, token: string, mail : string)  {
     var url =this.baseUrl + 'type=setLogin&userId=' + encodeURI(userId) + '&token=' + encodeURI(token) + '&mail=' + encodeURI(mail);
     console.log(url);
     var response = this.http.get(url).map(res => res.json());
     return response;
   }//setEmail

 // Récupération des horaires d'un utilisateur pour l'année et le mois passé en paramètre
 // Renvoie :  un JSON avec les horaires pour la periode demandée (requête réussie), soit False (requête réussie)
  getHorairesMensuels(userId : string, token: string, annee : string, mois: string) {
     var url =this.baseUrl + 'type=getHoraires&userId=' + encodeURI(userId) + '&token=' + encodeURI(token) + '&annee=' + encodeURI(annee) + '&mois=' + encodeURI(mois);
     console.log(url);
     var response = this.http.get(url).map(res => res.json());     
     return response;
   }//getHorairesMensuels

   // Récupération des horaires futiirsd'un utilisateur
  // Renvoie :  un JSON avec les horaires pour la periode demandée (requête réussie), soit False (requête réussie)
  getHorairesFuturs(userId : string, token: string) {
     var url =this.baseUrl + 'type=getHorairesFuturs&userId=' + encodeURI(userId) + '&token=' + encodeURI(token);
     console.log(url);
     var response = this.http.get(url).map(res => res.json());     
     return response;
   }//getHorairesFuturs

   // Récupération des horaires en attente de validation d'un utilisateur
  // Renvoie :  un JSON avec les horaires en attente de validation (requête réussie), soit False (requête réussie)
  getHorairesAttenteValidation(userId : string, token: string) {
     var url =this.baseUrl + 'type=getHorairesAttenteValidation&userId=' + encodeURI(userId) + '&token=' + encodeURI(token);
     console.log(url);
     var response = this.http.get(url).map(res => res.json());     
     return response;
   }//getHorairesAttenteValidation

  // Enregsitrement d'une demande
 // Renvoie :  True (requête réussie), ou False (mauvais userId, demId, ou Token)
  setDemande(userId:string, token:string, typeDemId:string, dateDebut: string, dateFin:string, isJourneeComplete:string, motif:string) {
     var url =this.baseUrl + 'type=setDemande&userId=' + encodeURI(userId) + '&token=' + encodeURI(token) + '&demId=' + encodeURI(typeDemId) 
      + '&dateDebut=' + encodeURI(dateDebut) + '&dateFin=' + encodeURI(dateFin) + '&isJourneeComplete=' + encodeURI(isJourneeComplete) + '&motif=' + encodeURI(motif);
     console.log(url);
     var response = this.http.get(url).map(res => res.json());
     return response;
   }//setDemande

 // Modification d'une demande
 // Renvoie :  True (requête réussie), ou False (mauvais userId, demId, ou Token)
  modDemande(userId:string, token:string, demId:string, dateDebut: string, dateFin:string, isJourneeComplete:string, motif:string) {
     var url =this.baseUrl + 'type=modDemande&userId=' + encodeURI(userId) + '&token=' + encodeURI(token) + '&id=' + encodeURI(demId) 
      + '&dateDebut=' + encodeURI(dateDebut) + '&dateFin=' + encodeURI(dateFin) +  '&isJourneeComplete=' + encodeURI(isJourneeComplete)  +'&motif=' + encodeURI(motif);
     console.log(url);
     var response = this.http.get(url).map(res => res.json());
     return response;
   }//modDemande

  // Récupération des demandes "futures"
  // Renvoie :  un JSON avec les demandes non passées (requête réussie), soit False (requête réussie)
  getDemandes(userId:string, token:string) {
     var url =this.baseUrl + 'type=getDemandes&userId=' + encodeURI(userId) + '&token=' + encodeURI(token);
     console.log(url);
     var response = this.http.get(url).map(res => res.json());
     return response;
   }//getDemandes

   // Validation des heures et modification de ces dernières
   //Renvoie : true ou false
   setModHoraire(userId:string, token:string, hopId:string, dateTimeDebut:string, dateTimeFin:string, traValide:string) {
     var url =this.baseUrl + 'type=valHoraire&userId=' + encodeURI(userId) + '&token=' + encodeURI(token) + 
     '&hopId=' + encodeURI(hopId) + '&dateTimeDebut=' + encodeURI(dateTimeDebut) + '&dateTimeFin=' + encodeURI(dateTimeFin) +
     '&traValide='+ encodeURI(traValide);
     console.log(url);
     var response = this.http.get(url).map(res => res.json());
     return response;
   }//getModHoraire

   //Validation des heures du mois
   //Renvoie : true or false
   setValMensuelle(userId:string, token:string, annee : string, mois:string) {
     var url =this.baseUrl + 'type=valMensuelle&userId=' + encodeURI(userId) + '&annee=' + encodeURI(annee) + '&token=' + encodeURI(token) + 
     '&mois=' + encodeURI(mois);
     console.log(url);
     var response = this.http.get(url).map(res => res.json());
     return response;
   }//setValMensuelle

  // Récupération des demandes pour le mois et l'année passés en paramètres
  // Renvoie :  un JSON avec les demandes demandées (requête réussie), soit False (requête réussie)
  getDemandesParMois(userId:string, token:string,  annee : string,  mois: string) {
     var url =this.baseUrl + 'type=getDemandesParMois&userId=' + encodeURI(userId) + '&token=' + encodeURI(token) + '&annee=' + encodeURI(annee) + '&mois=' + encodeURI(mois);
     console.log(url);
     var response = this.http.get(url).map(res => res.json());
     return response;
   }//getDemandesParMois

   // Récupération des maladies/accidents pour le mois et l'année passés en paramètres
  // Renvoie :  un JSON avec les demandes demandées (requête réussie), soit False (requête réussie)
  getMaladiesParMois(userId:string, token:string,  annee : string, mois: string) {
     var url =this.baseUrl + 'type=getMaladiesParMois&userId=' + encodeURI(userId) + '&token=' + encodeURI(token) + '&annee=' + encodeURI(annee) + '&mois=' + encodeURI(mois);
     console.log(url);
     var response = this.http.get(url).map(res => res.json());
     return response;
   }//getMaladiesParMois

   //Ajoute les date congé maladie ou accident dans la table maladieAccident 
   setMaladieAccident(userId : string, token : string, dateDebut : string, dateFin: string, isAccdient : string, horaireId : string){ 
     var url =this.baseUrl + 'type=dateMaladieAccident&userId=' + encodeURI(userId) + '&token=' + encodeURI(token) + '&dateDebut=' + encodeURI(dateDebut) + '&dateFin=' + encodeURI(dateFin)+ 
      '&isAccident=' + encodeURI(isAccdient) +'&horaireId='+ encodeURI(horaireId);
     console.log(url);
     var response = this.http.get(url).map(res => res.json());
     return response; 
   }//setMaladieAccident

    setValVueHoraire(userId : string, token : string){ 
     var url =this.baseUrl + 'type=getValVueHor&userId=' + encodeURI(userId) + '&token=' + encodeURI(token);
     console.log(url);
     var response = this.http.get(url).map(res => res.json());
     return response; 
   }//setValVueHoraire

   //retourne le numéro de l'établissement de l'employé connecté 
   getIdEtablissement(userId : string, token : string, idDep : string){ 
     var url =this.baseUrl + 'type=getIdEtablissement&userId=' + encodeURI(userId)+'&token=' + encodeURI(token) +'&idDep=' + encodeURI(idDep);
     console.log("getEtablissement "+ url);
     var response = this.http.get(url).map(res => res.json());
     return response; 
   }//getIdEtablissement

   //retourne les heures que l'employé a effectué  
   getInfosSolde(userId : string, dateDebut : string, dateFin : string, token : string){ 
     var url =this.baseUrl + 'type=getInfosSoldes&userId=' + encodeURI(userId) + '&token=' + encodeURI(token) + '&dateDebut=' + encodeURI(dateDebut) + '&dateFin=' + encodeURI(dateFin);
     console.log("getInfoSolde "+ url);
     var response = this.http.get(url).map(res => res.json());
     return response; 
   }//getIdEtablissement

   //retourne les informations sur ....
   getInfosHeuresMois(userId : string, mois : string, annee : string, idEta : string, token : string){ 
     var url =this.baseUrl + 'type=getInfosHeuresMois&userId=' + encodeURI(userId) + '&token=' + encodeURI(token) + '&mois=' + encodeURI(mois) + '&annee=' + encodeURI(annee) + '&idEta=' + encodeURI(idEta);
     console.log("getInfosHeuresMois "+ url);
     var response = this.http.get(url).map(res => res.json());
     return response; 
   }//getInfosHeuresMois

   //retourne les informations sur .....
   getCalculerSoldeEmployee(userId : string, mois : string, annee : string, idEta : string, token : string){ 
     var url =this.baseUrl + 'type=calculerSoldeEmployee&userId=' + encodeURI(userId) + '&token=' + encodeURI(token) + '&mois=' + encodeURI(mois) + '&annee=' + encodeURI(annee) + '&idEta=' + encodeURI(idEta);
     console.log("calculerSoldeEmployee "+ url);
     var response = this.http.get(url).map(res => res.json());
     return response; 
   }//getCalculerSoldeEmployee

  //retourne le numéro de l'établissement de l'employé connecté 
   getTypeHoraireContrat(userId : string, token : string){ 
     var url =this.baseUrl + 'type=getTypeHoraireContrat&userId=' + encodeURI(userId)+'&token=' + encodeURI(token);
     console.log("getTypeHoraireContrat "+ url);
     var response = this.http.get(url).map(res => res.json());
     return response; 
   }//getTypeHoraireContrat

  //retourne le numéro de l'établissement de l'employé connecté 
   getIdDepartement(userId : string, token : string){ 
     var url =this.baseUrl + 'type=getIdDepartement&userId=' + encodeURI(userId)+'&token=' + encodeURI(token);
     console.log("getIdDepartement "+ url);
     var response = this.http.get(url).map(res => res.json());
     return response; 
   }//getIdDepartement

}//ApiBddService
