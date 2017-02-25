import { Component,  } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
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

  constructor(public toastCtrl : ToastController, public navCtrl: NavController, public navParams: NavParams, private abiBddCtrl: ApiBddService,  public alertCtrl: AlertController) {
     abiBddCtrl.getProfil(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD')).subscribe(
        user => {
           if(user) { // OK     
             this.user = user    
             } else { // Erreur
                  let prompt = this.alertCtrl.create({
                    title: 'Erreur de connexion',
                    message: "Problème de connexion",
                    buttons:["ok"]
                  });
                  prompt.present();
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
                 let toast = this.toastCtrl.create({
                      message: `Modifications enregistrées`,
                      duration: 2000,
                      cssClass: "yourCssClassName",
                });
                toast.present();
             } else { // Erreur
                 let prompt = this.alertCtrl.create({
                    title: 'Erreur de connexion',
                    message: "Connexion échouée",
                    buttons:["ok"]
                  });
                  prompt.present();
             }
        });
       this.inputDisabled = true; // On désactive les champs du formulaire
  }//enregistrer
  
  ionViewDidLoad() {
    console.log('Hello MonProfil Page');
  }//ionViewDidLoad

 faireChangementMDP() {
    let prompt = this.alertCtrl.create({
      title: 'Modification de mon mot de passe',
      message: "Entrez votre mot de passe : ",
      inputs: [
        {
          id: 'mdpAct',
          type: 'password',
          name: 'mdpActuel',
          placeholder: 'Mot de passe actuel'
        },
        {
          id: 'NewMdp1',
          type: 'password',
          name: 'mdpNew',
          placeholder: 'Nouveau Mot de passe'
        },
        {
          id: 'NewMdp2',
          type: 'password',
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
            this.faireCheck(data.mdpNew, data.mdpNew2);
            this. modifierMotDePasse(data.mdpActuel, data.mdpNew);
            console.log('Changement ok');
          }
        }
      ]
    });
    prompt.present();
  }//faireChangementMDP

  // TODO Céline: coder cette fonction
  faireCheck(MDP1, MDP2){
    console.log('doCheck');
    if (MDP1 === MDP2) {
      console.log('true');
      return true;
    } else {
      console.log('false');
      return false;
    }
  }//faireCheck



   modifierMotDePasse(MDPOld, MDPNew){   
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
    this.abiBddCtrl.setPassword(window.localStorage.getItem('id'),window.localStorage.getItem('tokenBDD'), MDPOld, MDPNew).subscribe(        
      data => {
           if(data) {  // OK         
              console.log("Modifications mot de passe enregsitrées");
              this.faireAlertOK();
             } else { // Erreur
                 console.log("Connexion échouée : mauvais mot de passe, token ou ID");
                 this.faireAlertEchoue();
             }
        });
  }//modifierMotDePasse

 faireChangementMail() {
    let prompt = this.alertCtrl.create({
      title: 'Modification du mail',
      message: "Entrez votre nouvelle adresse email : ",
      inputs: [
        {
          id: 'newMail',
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
             this.modifierEmail(data.newMail);
            console.log('Changement confirmé');
          }
        }
      ]
    });
    prompt.present();
  }//faireChangementMail

  modifierEmail(newMail){  
    console.log("modifierEmail"); 
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
    this.abiBddCtrl.setEmail(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), newMail).subscribe(        
       data => {
           if(data) { // OK     
              console.log("Modifications de l'adresse email enregsitrées");
              this.faireAlertOK();
              this.user.mail = newMail; // Affichage du nouvel email
             } else { // Erreur
                 console.log("Connexion échouée : mauvais mot de passe, token ou ID");
                 this.faireAlertEchoue();
             }
        });
  }//modifierEmail

  faireAlertOK(){
      let prompt = this.alertCtrl.create({
      title: 'Modification validée',
      //message: "Modification validée",
      buttons: [
        {
          text: 'Fermer',
        }
      ]
    });
    prompt.present();
  }//faireAlertOK

  faireAlertEchoue(){
      let prompt = this.alertCtrl.create({
      title: 'Modification échouée, veuillez recommencer',
      //message: "Modification échouée, veuillez recommencer",
      buttons: [
        {
          text: 'Fermer',
        }
      ]
    });
    prompt.present();
  }//faireAlertEchoue

}//MonprofilPage