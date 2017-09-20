import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Lieux } from '../models/lieux';

@Injectable()
export class LocalStorage {

    constructor(private storage: Storage) { }
    
    public setOfflinePlace(places: any){
        this.storage.set('offlinePlaces', places);
    }
    
    public getOfflinePlace(callback: (val: any) => void){
        this.storage.get('offlinePlaces').then((val) => {
            callback(val);
        });
    }

    public addPlaceToMyPlace(place: Lieux){
        this.storage.get('myPlaces').then((val) => {
            if(val){
                val.push(place);
            }
            else{
                val = [place];
            }
            this.storage.set('myPlaces', val);
        });
    }

    public setMyPlace(places: any){
        this.storage.set('myPlaces', places);
    }

    public getMyPlaces(callback: (val: any)=>void){
        this.storage.get('myPlaces').then((val) => {
            callback(val);
        });
    }
}