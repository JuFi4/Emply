import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, AlertController, NavController} from 'ionic-angular';
import { StatusBar } from 'ionic-native';

// Pages
import { LoginPage } from '../pages/login/login';
import { AccueilPage } from '../pages/accueil/accueil';
import { ControlePage } from '../pages/controle/controle';
import { MeshorairesPage } from '../pages/meshoraires/meshoraires';
import { DemandesPage } from '../pages/demandes/demandes';
import { MonprofilPage } from '../pages/monprofil/monprofil';

// Providers
import { ApiBddService } from '../providers/api-bdd-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage = LoginPage;
  pages: Array<{title: string, component: any}>;

  constructor( public platform: Platform, public menu: MenuController, public alertCtrl: AlertController, public abiBddCtrl: ApiBddService) {
    this.initializeApp();

    this.pages = [
      //{title: 'Login', component: LoginPage },
      {title: 'Accueil', component: AccueilPage },
      {title: 'Contrôle', component: ControlePage },
      {title: 'Mes horaires', component: MeshorairesPage },
      {title: 'Demandes', component: DemandesPage },
      {title: 'Mon profil', component: MonprofilPage },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      //Splashscreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
  
  deconnecter() {
    let alert = this.alertCtrl.create({
    title: 'Déconnexion',
    message: 'Êtes-vous sûr(e) de vouloir vous déconnecter?',
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
          this.menu.close();
        }
      },
      {
        text: 'Oui',
        handler: () => {
          this.abiBddCtrl.deconnexion(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD')).subscribe(
            data => {
              if(data) {}  // Déconnexion OK         
            });
          
          // On défini à "undefined"" utilisateur et  motDePasse au lieu de faire clear -> afin de garder les données pour le mode hors connexion
          //window.localStorage.clear();
          window.localStorage.setItem('utilisateur', "undefined");
          window.localStorage.setItem('motDePasse', "undefined");
          console.log('Logged out');
          console.log("Utilisateur: " + window.localStorage.getItem('utilisateur'));
          console.log("Mot de passe: " + window.localStorage.getItem('motDePasse'));
          console.log("Id: " + window.localStorage.getItem('id'));
          console.log("Token bdd: " + window.localStorage.getItem('tokenBDD'));
          this.menu.close();
          this.nav.push(LoginPage); //charge la page login
          //this.nav.popToRoot();
        }
      }
    ]
  });
  alert.present();
  }

}
