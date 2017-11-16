import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class ReportService {
    private firebaseList: any;
    private reportTable: string = "ReportedProblems";

    constructor(private db: AngularFireDatabase) { 
        this.firebaseList = this.db.list(this.reportTable);        
    }

    public sendReport(report: any){
        var firebaseList = this.firebaseList;
        firebaseList.push(report);
    }   
}