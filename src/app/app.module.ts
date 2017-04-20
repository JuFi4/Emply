// Modules ionic
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

// Pages
import { LoginPage } from '../pages/login/login';
import { AccueilPage } from '../pages/accueil/accueil';
import { ValidationPage } from '../pages/validation/validation';
import { MeshorairesPage } from '../pages/meshoraires/meshoraires';
import { DemandesPage } from '../pages/demandes/demandes';
import { MonprofilPage } from '../pages/monprofil/monprofil';
import { ParametresPage } from '../pages/parametres/parametres';
import {TabsPage} from '../pages/tabs/tabs';
import { MeshorairesfutursPage } from '../pages/meshorairesfuturs/meshorairesfuturs';

// Providers
import { NotificationsLocalesService } from '../providers/notifications-locales-service';
import { ApiBddService } from '../providers/api-bdd-service';
import { MoisService } from '../providers/mois-service';
import { ConnectivityService } from '../providers/connectivity-service';
import { ApiPdfService } from '../providers/api-pdf-service';
import {AffichageValidationHoraireService} from '../providers/affichage-validation-horaire-service';
import {SyncHorairesService} from '../providers/sync-horaires-service';
import {AlertsToasts} from '../providers/alerts-toasts';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    AccueilPage,
    ValidationPage,
    TabsPage,
    MeshorairesPage,
    MeshorairesfutursPage,
    DemandesPage,
    MonprofilPage,
    ParametresPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    AccueilPage,
    ValidationPage,
    TabsPage,
    MeshorairesPage,
    MeshorairesfutursPage,
    DemandesPage,
    MonprofilPage,
    ParametresPage
  ],
  providers: [
    NotificationsLocalesService, 
    ConnectivityService, 
    ApiBddService, 
    ApiPdfService, 
    MoisService,
    AffichageValidationHoraireService,
    SyncHorairesService,
    AlertsToasts
    ]
})
export class AppModule {}
