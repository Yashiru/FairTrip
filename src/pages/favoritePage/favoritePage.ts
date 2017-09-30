import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { I18n } from '../../services/i18n/i18n';
import { LocalStorage } from '../../services/local-storage';
import { Lieux } from '../../models/lieux';
import { SvgIcons } from '../../models/svgIcons';
import { PlaceDetailsPage } from '../placeDetails/placeDetails';
import { MyPlaces } from '../myPlace/myPlace';

@Component({
  selector: 'favorite-page',
  templateUrl: 'favoritePage.html'
})
export class FavoritePage {
  private terms: any;
  private likes: Lieux[] = [];
  private svgIcons: SvgIcons = new SvgIcons();

  constructor(private navCtrl: NavController, private i18n: I18n, private localStorage: LocalStorage, private tc: ToastController){
    this.terms = i18n.terms;

    var lieu = new Lieux("test");
    lieu.nom == "testLike";
    this.localStorage.getLikes((val) => {
      this.likes = val;
    });
  }

  ionViewWillEnter(){
    this.localStorage.getLikes((val) => {
      this.likes = val;
    });
  }

  private toggleLike(e, place){
    e.stopPropagation();
    this.localStorage.toggleLike(place, (newVal)=>{
      this.likes = newVal;
    });


    let toast = this.tc.create({
      message: this.i18n.terms.myPlaceDeleted,
      duration: 1500,
      position: 'top'
    });
  
    toast.present();
  }

  private getLogo(place){
    var img;
    switch(place.type.toLowerCase()){
      case "restaurant": 
        img = this.svgIcons.coloredIcons.restaurant;
        break;
      case "hotel": 
        img = this.svgIcons.coloredIcons.hotel;
        break;
      case "ngo": 
        img = this.svgIcons.coloredIcons.ngo;        
        break;
      case "experience": 
        img = this.svgIcons.coloredIcons.experience;
        break;
    }

    var boxText = document.createElement("div");
    boxText.id = "info";
    boxText.innerHTML = img;
    

    document.getElementById(place.nom).innerHTML = img+place.nom;
    return "";
  }

  private backNav(){
    this.navCtrl.pop();
  }

  private openFavoritePlaceDetails(place){
    var lieux: Lieux = new Lieux();
    lieux.factorise(place);
    this.navCtrl.push(PlaceDetailsPage, {
      "selectedPlace": lieux
    });
  }
}
