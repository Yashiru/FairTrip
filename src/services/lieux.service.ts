import { Injectable } from '@angular/core';
import { Lieux } from '../models/lieux';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { I18n } from './i18n/i18n';
import { OnInit } from '@angular/core';
import { LocalStorage } from './local-storage';
import { Network } from '@ionic-native/network';
import { Http, Response } from '@angular/http';
import { Location } from '../models/location';
import { Adresse } from '../models/adresse';

@Injectable()
export class LieuxService {
    private lieux: Lieux[];
    private maxPredictionsCount: number = 5;
    private imageUrl: string;
    private isOnline: Boolean = false;
    private firebaseList: any;
    private table: string;
    
    public isConnected: Boolean;

    constructor(private db: AngularFireDatabase, 
                private i18n: I18n, 
                private localStorage: LocalStorage, 
                private ntw: Network,
                private http: Http) {
    }    

    public loadAllLieux(callback: (lieux: Lieux[], isConnected: Boolean) => void): Lieux[]{
        var lieux: Lieux[] = [];
        this.i18n.setLanguage((table) => {
            if(this.lieux == null && this.isConnected == true)
            {
                this.table = table;
                this.firebaseList = this.db.list(table);
                this.db.list(table, { preserveSnapshot: true})
                .subscribe(snapshots=>{
                    snapshots.forEach(snapshot => {
                        var lieu: Lieux = new Lieux();
                        lieu.factorise(snapshot.val());
                        if(lieu.isValid)
                            lieux.push(lieu);
                    });
                    this.lieux = lieux;
                    callback(lieux, this.isConnected);
                    this.localStorage.setOfflinePlace(lieux);
                });
            }
            else if(this.isConnected == false){
                this.localStorage.getOfflinePlace((places) => {
                    callback(places, this.isConnected)
                    this.lieux = places;
                    lieux = this.lieux;
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

    public addLieu(lieu: Lieux) {
        this.getAdressFormLocation(lieu, (lieuWithAdress) => {
            this.firebaseList.push(lieuWithAdress);            
        });
    }

    public getAdressFormLocation(lieu: Lieux, callback: (loc: Lieux)=>void){
        this.http.get("https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCOfwCdYvCssMuc2Pom-0r4VZMkEkAVh7E&latlng="+lieu.location.latitude+","+lieu.location.longitude+"&sensor=true/false")
        .subscribe(function(response: Response) {
            var res = response.json().results[0];
            var location: Location = new Location();
            var adresse: Adresse = new Adresse();
            console.log(res);

            adresse.pays = res.address_components[5].long_name;
            adresse.details = res.formatted_address;

            lieu.location.adresse = adresse;

            callback(lieu);
        });
    }
}