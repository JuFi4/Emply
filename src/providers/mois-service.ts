import {Injectable} from '@angular/core';
import {Mois} from '../models/mois';
import {MOIS} from '../pages/meshoraires/provisoirMock';
import {SEMAINES} from '../pages/meshoraires/provisoirMockSem';
import {Semaine} from '../models/semaine';

@Injectable()
export class MoisService{
    
 
getMois(): Promise<Mois[]> {
    return Promise.resolve(MOIS);
  }

getMoisSel(moisId: number): Promise<Mois> {
  return this.getMois()
             .then(moisListe => moisListe.find(mois => mois.moisId === moisId));
}

getSemaine(): Promise<Semaine[]> {
    return Promise.resolve(SEMAINES);
  }
}