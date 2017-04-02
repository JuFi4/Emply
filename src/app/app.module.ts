// Modules ionic
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

// Pages
import { LoginPage } from '../pages/login/login';
import { AccueilPage } from '../pages/accueil/accueil';
import { ControlePage } from '../pages/controle/controle';
import { MeshorairesPage } from '../pages/meshoraires/meshoraires';
import { DemandesPage } from '../pages/demandes/demandes';
import { MonprofilPage } from '../pages/monprofil/monprofil';
import { SaisiedemandePage } from '../pages/saisiedemande/saisiedemande';

// Providers
import { NotificationsLocalesService } from '../providers/notifications-locales-service';
import { ApiBddService } from '../providers/api-bdd-service';
import {MoisService} from '../providers/mois-service';
import { ConnectivityService } from '../providers/connectivity-service';
import { ApiPdfService } from '../providers/api-pdf-service';
import {pushHoraireFin} from '../providers/affichageValidationHoraire-service';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    AccueilPage,
    ControlePage,
    MeshorairesPage,
    DemandesPage,
    MonprofilPage,
    SaisiedemandePage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    AccueilPage,
    ControlePage,
    MeshorairesPage,
    DemandesPage,
    MonprofilPage,
    SaisiedemandePage
  ],
  providers: [
    NotificationsLocalesService, 
    ConnectivityService, 
    ApiBddService, 
    ApiPdfService, 
    MoisService,
    pushHoraireFin
    ]
})
export class AppModule {}
