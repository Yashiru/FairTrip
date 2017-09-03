import { Injectable } from '@angular/core';
import { Lieux } from "../models/lieux";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class LieuxService {
    private lieux: Lieux[];
    private maxPredictionsCount: number = 10;

    constructor(private db: AngularFireDatabase) {
        
    }        

    public loadAllLieux(callback: (lieux: Lieux[]) => void): Lieux[]{
        var lieux: Lieux[] = [];
        
        if(this.lieux == null)
        {
            this.db.list('/lieux', { preserveSnapshot: true})
            .subscribe(snapshots=>{
                snapshots.forEach(snapshot => {
                  var lieu: Lieux = new Lieux();
                  lieu.factorise(snapshot.val());
                  lieux.push(lieu);
                });
                this.lieux = lieux;
                callback(lieux);
            })   
        }
        else{
            callback(this.lieux)
            lieux = this.lieux;
        }

        return lieux;
    }

    public searchLieu(searchString: string): Lieux[]{
        let lieux: Lieux[] = [];
        let words = searchString.split(" ");
        for(var i = 0; i < this.lieux.length; i++){
            if(lieux.length < this.maxPredictionsCount)
            {
                //for(let word of words){
                if(this.lieux[i].nom.toLowerCase().indexOf(/*word*/searchString.toLowerCase()) != -1){
                    lieux.push(this.lieux[i]);
                }
                //}
            }
        }
        return lieux;
    }
}