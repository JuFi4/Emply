//ConnectivityService

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Network } from 'ionic-native';
import { Platform } from 'ionic-angular';

declare var Connection;
@Injectable()
export class ConnectivityService {

  onDevice: boolean;
 
  constructor(public platform: Platform){
    this.onDevice = this.platform.is('cordova');
  }//constructor
 
  isOnline(): boolean {
    return true;
  }//isOnline
 
  isOffline(): boolean {
   return false;
  }//isOffline
}//ConnectivityService