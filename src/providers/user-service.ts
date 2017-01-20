import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { User } from '../pages/models/user';

@Injectable()
export class ServiceUsers {
  githubApiUrl = 'http://ctrl-ccnt.ch/assets/php/api/apiBdd.php?type=getProfil';

  constructor(public http: Http) { }

  // Load all github users
  getUser(id : number, token: string): Observable<User> {
    console.log(token);
    return this.http.get(`${this.githubApiUrl}&UserId=${id}&token=${token}`)
      .map(res => <User>(res.json()))
  }

  setUser(id : number, token: string,nom : string, prenom : string, dateNaissance : String, adresse : string,suppAdresse : string, codePostal : number, ville : string, telFix : string,telMobile: string){
    return this.http.get(`${this.githubApiUrl}&UserId=${id}&token=${token}&nom=${nom}&prenom=${prenom}&dateNaissance=${dateNaissance}&adresse=${adresse}&suppAdresse=${suppAdresse}&codePostal=${codePostal}&ville=${ville}&telFix=${telFix}`)
  }
}
