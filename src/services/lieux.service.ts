import { Injectable } from '@angular/core';
import { Lieux } from "../models/lieux";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class LieuxService {
    constructor(private db: AngularFireDatabase) {
        
    }        

    public getAllLieux(): Lieux[]{
        var lieux: Lieux[] = [];
        this.db.list('/lieux', { preserveSnapshot: true})
        .subscribe(snapshots=>{
            snapshots.forEach(snapshot => {
              var lieu: Lieux = new Lieux();
              lieu.factorise(snapshot.val());
              lieux.push(lieu);
            });
        })   
        return lieux;
    }
}
