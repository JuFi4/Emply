import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

// Providers
import { ApiBddService } from '../../providers/api-bdd-service';

//Models
import { UserModel } from '../../models/user-model';

@Component({
  selector: 'page-monprofil',
  templateUrl: 'monprofil.html'
})

export class MonprofilPage {
  user : any = [];
  inputDisabled : boolean;	

  constructor(public navCtrl: NavController, public navParams: NavParams, private abiBddCtrl: ApiBddService,  public alertCtrl: AlertController) {
   // ANCIEN CODE
   /* this.user.id = 4;
    this.user.token = "Marcuzzo | 587fc844ef548587fc844ef580587fc844ef5b9";
    serviceUsers.getUser(this.user.id, this.user.token).subscribe(user => {
      this.user = user;
      console.log(user);
    })*/
     /* TODO VANESSA : : traiter les données du profil :
      - Traiter le résultat de l'API : 
          - Si on a bien récupérer le profil (le " if(user)" dans le code) : vérifier que l'affichage des  les données dans la page profil est OK 
                  -> La date de naissance est buggée -> il y a un problème avec l'année, mais on l'avais déja vu (lors de la modification), donc il faudra le régler
          - sinon (le "else" dans le code), trouver comment traiter cela, exemple: message d'erreur, et peut êre renvoyer sur la page de connexion
      */
     abiBddCtrl.getProfil(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD')).subscribe(
        user => {
           if(user) { // OK     
             this.user = user    
             } else { // Erreur
                 console.log("Connexion échouée : mauvais token ou ID");
             }
        }); 
   this.user.mail  = window.localStorage.getItem('utilisateur');
   this.inputDisabled = true; // On désactive les champs du formulaire
  }//constructor  
  
   modifier(){
    this.inputDisabled = false; // On active les champs du formulaire
  }//modifier

  enregistrer(){
    // ANCIEN CODE :
      /* TODO VANESSA : : traiter la modification du profil :     -
      - Traiter le résultat de l'API : 
          - Si la modification est bien enregsitrée (le "if(data)"" dans le code) : trouver comment traiter cela : alerte pour dire que c'est OK, 
            ou rien du tout et juste remettre les champs en "nom modifiable".... à toi de voir ce que tu veux mettre
          - sinon (le "else" dans le code), trouver comment traiter cela : message d'erreur "modification impossible",
      */
    /* Modèle de la fonction: setProfil(userId : string, token: string, nom : string, prenom : string, dateNaissance : string, adresse : string, suppAdresse : string, 
            codePostal : number, ville : string, telFix : string, telMobile: string) */
    this.abiBddCtrl.setProfil(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'),this.user.nom, this.user.prenom, this.user.dateNaissance, this.user.adresse, this.user.suppAdresse, this.user.codePostal, this.user.ville, this.user.telFix, this.user.telMobile).subscribe(
        data => {
           if(data) {  // OK        
              console.log("Modifications profil enregsitrées");
             } else { // Erreur
                 console.log("Connexion échouée : mauvais token ou ID");
             }
        });
       this.inputDisabled = true; // On désactive les champs du formulaire
  }//enregistrer
  
  ionViewDidLoad() {
    console.log('Hello MonProfil Page');
  }//ionViewDidLoad

  doChangementMDP() {
    let prompt = this.alertCtrl.create({
      title: 'Modification de mon mot de passe',
      message: "Entrez votre mot de passe : ",
      inputs: [
        {
          id: 'mdpAct',
          name: 'mdpActuel',
          placeholder: 'Mot de passe actuel'
        },
        {
          id: 'NewMdp1',
          name: 'mdpNew',
          placeholder: 'Nouveau Mot de passe'
        },
        {
          id: 'NewMdp2',
          name: 'mdpNew2',
          placeholder: 'Confirmer votre nouveau Mot de passe'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Annulation de la modification');
          }
        },
        {
          text: 'Confirmer',
          handler: data => {
            console.log('Changement confirm�');
            this.doCheck();
          }
        }
      ]
    });
    prompt.present();
  }
  doCheck(){
    console.log('doCheck');
    var MDP1 = document.getElementById("NewMdp1");
    var MDP2 = document.getElementById("NewMdp2");
    if (MDP1 == MDP2) {
      console.log('true');
      return true;
    } else {
      console.log('false');
      return false;
    }
  }
  doChangementMail() {
    let prompt = this.alertCtrl.create({
      title: 'Modification du mail',
      message: "Entrez votre nouvelle adresse email : ",
      inputs: [
        {
          name: 'newMail',
          placeholder: 'Nouvelle adresse Email'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Annulation de la modification');
          }
        },
        {
          text: 'Confirmer',
          handler: data => {
            console.log('Changement confirm�');
          }
        }
      ]
    });
    prompt.present();
  }//doChangementMDP

   modifierMotDePasse(){   
     /* TODO CELINE : : traiter la modification du mot de passe :
     - 1)  Mettre le code à la bonne place : garder la fonction modifierMotDePasse() et la completer (paramètres), ou créer une autre -> Je l'ai fait juste pour mettre le code
          d'exemple à un endroit, mais tu en fait ce que tu veux
      -2) Remplacer les données de test dans l'api  avec les données du profil issues du formulaire de modification de mot de passe
      -3) Traiter le résultat de l'API : 
          - Si la modification est bien enregsitrée (le "if(data)"" dans le code) : trouver comment traiter cela : alerte pour dire que c'est OK, 
            ou rien du tout et juste remettre les champs en "nom modifiable".... à toi de voir ce que tu veux mettre
          - sinon (le "else" dans le code) cela signifie que la modification n'a pas fonctionné 
                -> erreur sur l'ancien mot de passe ou modification impossible pour une autre raison
                -> Trouver comment traiter cela : message d'erreur "mauvais mot de passe", "modification impossible"... 
      */
    
    // Modèle de la fonction: setPassword(userId : string, token: string, ancienPassword : string, nouveauPassword : string)
    this.abiBddCtrl.setPassword(window.localStorage.getItem('id'),window.localStorage.getItem('tokenBDD'), "1234", "1234").subscribe(        
      data => {
           if(data) {  // OK         
              console.log("Modifications mot de passe enregsitrées");
             } else { // Erreur
                 console.log("Connexion échouée : mauvais mot de passe, token ou ID");
             }
        });
  }//modifierMotDePasse

  modifierEmail(){   
     /* TODO CELINE : : traiter la modification de l^'email :
     - 1)  Mettre le code à la bonne place : garder la fonction modifierMotDePasse() et la completer (paramètres), ou créer une autre -> Je l'ai fait juste pour mettre le code
          d'exemple à un endroit, mais tu en fait ce que tu veux
      -2) Remplacer les données de test avec les données du profil issues du formulaire de modification de l'eamil
      -3) Traiter le résultat de l'API : 
          - Si la modification est bien enregsitrée (le "if(data)"" dans le code) : trouver comment traiter cela : alerte pour dire que c'est OK, 
            ou rien du tout et juste remettre les champs en "nom modifiable".... à toi de voir ce que tu veux mettre
          - sinon (le "else" dans le code), trouver comment traiter cela : message d'erreur "modification impossible",
      */
    
    // Modèle de la fonction: setEmail(userId : string, token: string, mail : string)
    this.abiBddCtrl.setEmail(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), "lucille@gmail.com").subscribe(        
       data => {
           if(data) { // OK     
              console.log("Modifications de l'adresse email enregsitrées");
             } else { // Erreur
                 console.log("Connexion échouée : mauvais mot de passe, token ou ID");
             }
        });
  }//modifierEmail

}//MonprofilPage