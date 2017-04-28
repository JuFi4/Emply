import { Component, } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

// Providers
import { ApiBddService } from '../../providers/api-bdd-service';
import { ConnectivityService } from '../../providers/connectivity-service';
import { AlertsToasts } from '../../providers/alerts-toasts';

//Models
import { Utilisateur } from '../../models/utilisateur';

@Component({
  selector: 'page-monprofil',
  templateUrl: 'monprofil.html'
})

export class MonprofilPage {
  user: any = [];
  inputDisabled: boolean;
  isHorsLigne: boolean;
  isMdpok: boolean;
  isMailOk: boolean;

  constructor(public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, private abiBddCtrl: ApiBddService, public alertCtrl: AlertController, private connectivityService: ConnectivityService, private AlertsToasts: AlertsToasts) {
    this.isHorsLigne = window.localStorage.getItem('noNetwork') === '1' || connectivityService.isOffline();
    if (!this.isHorsLigne) { // Mode normal : vérification de la connexion en ligne
      abiBddCtrl.getProfil(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD')).subscribe(
        user => {
          if (user) { // OK     
            this.user = user
            window.localStorage.setItem('getProfil', JSON.stringify(this.user));  // Création de la sauvegarde locale
          } else { // Erreur
            this.AlertsToasts.faireAlertConnexionEchouee();
          }
        });
    } else { // Mode hors ligne
      console.log("Mode hors ligne");
      this.user = JSON.parse(window.localStorage.getItem('getProfil'));
    }
    this.user.mail = window.localStorage.getItem('utilisateur');
    this.inputDisabled = true; // On désactive les champs du formulaire
  }//constructor  

  modifier() {
    this.inputDisabled = false; // On active les champs du formulaire
  }//modifier

  enregistrer() {
    /* Modèle de la fonction: setProfil(userId : string, token: string, nom : string, prenom : string, dateNaissance : string, adresse : string, suppAdresse : string, 
            codePostal : number, ville : string, telFix : string, telMobile: string) */
    this.abiBddCtrl.setProfil(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), this.user.nom.trim(), this.user.prenom.trim(), this.user.dateNaissance, this.user.adresse.trim(), this.user.suppAdresse.trim(), this.user.codePostal.trim(), this.user.ville.trim(), this.user.telFix.trim(), this.user.telMobile.trim()).subscribe(
      data => {
        if (data) {  // OK        
          console.log("Modifications profil enregsitrées");
          this.AlertsToasts.faireToastModificationEnregistree();
        } else { // Erreur
          this.AlertsToasts.faireAlertConnexionEchouee();
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
            this.faireCheck(data.mdpNew.trim(), data.mdpNew2.trim());
            if (this.isMdpok) {
              this.modifierMotDePasse(data.mdpActuel.trim(), data.mdpNew.trim());
              console.log('Changement ok');
            } else {
              this.AlertsToasts.faireAlertMdpPasValide();
              console.log('Changement pas ok');
            }
          }
        }
      ]
    });
    prompt.present();
  }//faireChangementMDP

  faireCheck(MDP1, MDP2) {
    console.log('doCheck');
    if (MDP1 === MDP2) {
      this.isMdpok = true;
    } else {
      this.isMdpok = false;
    }
  }//faireCheck

  modifierMotDePasse(MDPOld, MDPNew) {
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
    this.abiBddCtrl.setPassword(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD'), MDPOld, MDPNew).subscribe(
      data => {
        if (data) {  // OK         
          console.log("Modifications mot de passe enregsitrées");
          this.AlertsToasts.faireToastModificationEnregistree();
        } else { // Erreur
          console.log("Connexion échouée : mauvais mot de passe, token ou ID");
          this.AlertsToasts.faireAlertConnexionEchouee();
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
            this.verifierMail(data.newMail.trim());
            if (this.isMailOk) {
              this.modifierEmail(data.newMail.trim());
              console.log('Changement confirmé');
            } else{
              this.AlertsToasts.faireAlertMailPasValide();
            }
          }
        }
      ]
    });
    prompt.present();
  }//faireChangementMail

  verifierMail(newMail) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log(re.test(newMail));
    if (re.test(newMail) === true) {
      this.isMailOk = true;
    } else {
      this.isMailOk = false;
    }
  }

  modifierEmail(newMail) {
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
        if (data) { // OK     
          console.log("Modifications de l'adresse email enregsitrées");
          this.AlertsToasts.faireToastModificationEnregistree();
          this.user.mail = newMail; // Affichage du nouvel email
        } else { // Erreur
          console.log("Connexion échouée : mauvais mot de passe, token ou ID");
          this.AlertsToasts.faireAlertConnexionEchouee();
        }
      });
  }//modifierEmail

}//MonprofilPage