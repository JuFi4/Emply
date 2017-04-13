import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// Pages
import { MeshorairesPage } from '../meshoraires/meshoraires';
import { MeshorairesfutursPage } from '../meshorairesfuturs/meshorairesfuturs';
/*
  Generated class for the Tabs page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
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
  }

}
