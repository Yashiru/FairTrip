import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { I18n } from '../../services/i18n/i18n';
import { LocalStorage } from '../../services/local-storage';
import { SvgIcons } from '../../models/svgIcons';
import { LieuxService } from '../../services/lieux.service';

@Component({
  selector: 'myplace-page',
  templateUrl: 'myPlace.html'
})
export class MyPlaces {
  private terms: any;
  private myPlaces: any[];
  private svgIcons: SvgIcons = new SvgIcons();
  

  constructor(private navCtrl: NavController, 
              private i18n: I18n, 
              private ls: LocalStorage, 
              private lieuxService: LieuxService, 
              private tc: ToastController){
    this.terms = i18n.terms;

    this.ls.getMyPlaces((val) => {
      this.myPlaces = val;
      console.log(val);
    });
  }

  private backNav(){
    this.navCtrl.pop();
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



  private send(placeToAdd){
    if(placeToAdd.nom != null && placeToAdd.infos.description != null && placeToAdd.type != null)
    {
      this.lieuxService.addLieu(placeToAdd);
      if(this.myPlaces.indexOf(placeToAdd) != -1){
        this.myPlaces[this.myPlaces.indexOf(placeToAdd)].isSended = true;
        this.ls.setMyPlace(this.myPlaces);
        
        let toast = this.tc.create({
          message: this.i18n.terms.successUpload,
          duration: 3000,
          position: 'top'
        });
      
        toast.present();
      }
    }
  }

}
