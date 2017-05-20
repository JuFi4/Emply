//Tabs page

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// Pages
import { MeshorairesPage } from '../meshoraires/meshoraires';
import { MeshorairesfutursPage } from '../meshorairesfuturs/meshorairesfuturs';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = MeshorairesPage;
  tab2Root = MeshorairesfutursPage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('Hello Tabs Page');
  }//ionViewDidLoad

}//TabsPage
