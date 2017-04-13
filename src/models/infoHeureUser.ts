export class InfoHeureUser {
    brut : String;   
    conge : string;
    net : string;
    pause : string;

    constructor(brut : String, pause : string, net : string, conge : string){
        this.brut = brut;
        this.conge = conge;
        this.pause = pause;
        this.net = net;
    }
}