import { Injectable } from '@angular/core';
import { Lieux } from "../models/lieux";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { I18n } from './i18n/i18n';
import { OnInit } from '@angular/core';
import { LocalStorage } from './local-storage';
import { Network } from '@ionic-native/network';

@Injectable()
export class LieuxService {
    private lieux: Lieux[];
    private maxPredictionsCount: number = 5;
    private imageUrl: string;
    private isOnline: Boolean = false;

    constructor(private db: AngularFireDatabase, private i18n: I18n, private localStorage: LocalStorage, private ntw: Network) {

    }    

    ionViewWillEnter() {
        this.ntw.onConnect().subscribe(data => {
            this.isOnline = true;
        }, error => console.error(error));
       
        this.ntw.onDisconnect().subscribe(data => {
            this.isOnline = false;
        }, error => console.error(error));
      }

    public loadAllLieux(callback: (lieux: Lieux[]) => void): Lieux[]{
        var lieux: Lieux[] = [];
        this.i18n.setLanguage((table) => {
            if(this.isOnline){
                if(this.lieux == null)
                {
                    this.db.list(table, { preserveSnapshot: true})
                    .subscribe(snapshots=>{
                        snapshots.forEach(snapshot => {
                            var lieu: Lieux = new Lieux();
                            lieu.factorise(snapshot.val());
                            lieux.push(lieu);
                        });
                        this.lieux = lieux;
                        callback(lieux);
                        this.localStorage.setOfflinePlace(lieux);
                    })   
                }
                else{
                    callback(this.lieux)
                    lieux = this.lieux;
                }
            }
            else{
                this.localStorage.getOfflinePlace((places) => {
                    callback(places);
                });
            }
        });
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