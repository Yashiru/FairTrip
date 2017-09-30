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
    
    public removePlaceToMyPlace(place: Lieux, callback: (val) => void){
        this.storage.get('myPlaces').then((val) => {
            var i = 0;
            var indexToSplice: number;
            for(let lieu of val){
                console.log(place);
                if(place.nom == lieu.nom){
                    val.splice(i, 1);
                    callback(val);
                }
                i++;
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

    public toggleLike(lieu, callback?: (newVal) => void){
        this.storage.get('myLikes').then((val) => {
            var remove: Boolean = false;
            var index: number = 0;
            var indexToRemove: number = 0;

            if(val != null){
                for(var place of val){
                    if(place.nom == lieu.nom){
                        indexToRemove = index;
                        remove = true;
                        console.log(index);
                    }
                    index++;
                }
            }
            if(remove == true){
                console.log(indexToRemove);
                val.splice(indexToRemove, 1);
                if(callback != null){
                    callback(val);
                }
                this.storage.set('myLikes', val);
            }
            else{
                if(val != null){
                    val.push(lieu);
                    this.storage.set('myLikes', val);
                }
                else{
                    var newVal: Lieux[] = [lieu];
                    this.storage.set('myLikes', newVal);
                }
            }
        });
    }

    public getLikes(callback: (val) => void){
        this.storage.get('myLikes').then((val) => {
            callback(val);
        });
    }

    public isLiked(place: any, callback: (isLiked) => void){
        var like: Boolean = false;
        this.storage.get('myLikes').then((val) => {
            if(val != null){
                for(let lieu of val){
                    if(lieu.nom == place.nom){
                        like = true;
                        callback(like);
                    }
                }
            }
        });
    }

    public removeLike(lieu){
        this.storage.get('myLikes').then((val: Lieux[]) => {
            if(val != null){
                for(let lieu in val){
                    console.log(lieu);
                }
            }
            this.storage.set('myLikes', val);
        });
    }
}