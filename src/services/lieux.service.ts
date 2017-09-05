import { Injectable } from '@angular/core';
import { Lieux } from "../models/lieux";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { I18n } from './i18n/i18n';
import { OnInit } from '@angular/core';

@Injectable()
export class LieuxService {
    private lieux: Lieux[];
    private maxPredictionsCount: number = 5;
    private imageUrl: string;

    constructor(private db: AngularFireDatabase, private i18n: I18n) {

    }    

    public loadAllLieux(callback: (lieux: Lieux[]) => void): Lieux[]{
        var lieux: Lieux[] = [];
        
        if(this.lieux == null)
        {
            this.i18n.setLanguage((table) => {
                this.db.list(table, { preserveSnapshot: true})
                .subscribe(snapshots=>{
                    snapshots.forEach(snapshot => {
                      var lieu: Lieux = new Lieux();
                      lieu.factorise(snapshot.val());
                      lieux.push(lieu);
                    });
                    this.lieux = lieux;
                    callback(lieux);
                })   
            });
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

    public getImageUrl(imageName: string){
        const storageRef = this.db.app.storage().ref().child('path/'+imageName+'.png');
        storageRef.getDownloadURL().then(url => this.imageUrl = url);
    }

    public uploadImage(){
        var storageRef = this.db.app.storage().ref();
        var file = ... // use the Blob or File API
        ref.put(file).then(function(snapshot) {
          console.log('Uploaded a blob or file!');
        });
    }
}