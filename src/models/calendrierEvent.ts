export class CalendrierEvent {
    title : string;
    location : string;
    notes : string;
    startDate : Date;
    endDate : Date;
    id : string;

    constructor(title,location, notes,startDate, endDate, id){
        this.title = title; 
        this.location = location, 
        this.notes = notes; 
        this.startDate = startDate; 
        this.endDate = endDate;
        this.id = id;
    }//constructor
}//CalendrierEvent
