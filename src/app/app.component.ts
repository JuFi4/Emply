import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, AlertController, NavController} from 'ionic-angular';
import { StatusBar } from 'ionic-native';

// Pages
import { LoginPage } from '../pages/login/login';
import { AccueilPage } from '../pages/accueil/accueil';
import { ValidationPage } from '../pages/validation/validation';
import { MeshorairesPage } from '../pages/meshoraires/meshoraires';
import { DemandesPage } from '../pages/demandes/demandes';
import { MonprofilPage } from '../pages/monprofil/monprofil';
import { ParametresPage } from '../pages/parametres/parametres';
import { TabsPage } from '../pages/tabs/tabs';
import { MeshorairesfutursPage } from '../pages/meshorairesfuturs/meshorairesfuturs';

// Providers
import { ApiBddService } from '../providers/api-bdd-service';
import { NotificationsLocalesService } from '../providers/notifications-locales-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage = LoginPage;
  pages: Array<{title: string, component: any}>;

  constructor( public platform: Platform, public menu: MenuController, public alertCtrl: AlertController, public abiBddCtrl: ApiBddService, public notificationsLocalesCtrl : NotificationsLocalesService) {
    this.initializeApp();

    this.pages = [
      //{title: 'Login', component: LoginPage },
      {title: 'Accueil', component: AccueilPage },
      {title: 'Validations', component: ValidationPage },
      {title: 'Mes horaires', component: TabsPage },
      {title: 'Mes demandes', component: DemandesPage },
      {title: 'Mon profil', component: MonprofilPage },
      {title: 'Paramètres', component: ParametresPage },
    ];
  }//constructor

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }//initializeApp

  openPage(page) {
    this.menu.close();
    this.nav.setRoot(page.component);
  }//openPage
  
  deconnecter() {
    let alert = this.alertCtrl.create({
    title: 'Déconnexion',
    message: 'Êtes-vous sûr(e) de vouloir vous déconnecter?',
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
        handler: () => {
          this.menu.close();
        }
      },
      {
        text: 'Confirmer',
        handler: () => {
          this.abiBddCtrl.deconnexion(window.localStorage.getItem('id'), window.localStorage.getItem('tokenBDD')).subscribe(
            data => {
              if(data) {}  // Déconnexion OK         
            });
          
          // On définit à "undefined" l'utilisateur et le motDePasse au lieu de faire clear -> afin de garder les données pour le mode hors connexion
          window.localStorage.setItem('utilisateur', "undefined");
          window.localStorage.setItem('motDePasse', "undefined");

          // On supprime les notifications locales -  elles vont être re-crées quand la personne se reconnectera et ira voir ses horaires  
           this.notificationsLocalesCtrl.resetNotification();

          this.menu.close();
          this.nav.push(LoginPage); //charge la page login
        }
      }
    ]
  });
  alert.present();
  }//deconnecter

}//MyApp
