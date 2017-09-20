import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Lieux } from '../../models/lieux';
import { SvgIcons } from '../../models/svgIcons';
import { FirebaseImage } from '../../services/firebase-image';
import { I18n } from '../../services/i18n/i18n';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'page-place-details',
  templateUrl: 'placeDetails.html'
})
export class PlaceDetailsPage {
  private placeSelected: Lieux;
  private svg: SvgIcons = new SvgIcons();
  private svgIcon;
  private terms: any;
  private imagesUrl: string[] = [];
  private showImageLoader: Boolean = true;
  private showErrorMsg: Boolean = false;
  private stars: string[] = ["ios-star-outline", "ios-star-outline", "ios-star-outline", "ios-star-outline", "ios-star-outline"];

  constructor(private callNumber: CallNumber, public navCtrl: NavController, private navParams: NavParams, private imageService: FirebaseImage, private i18n: I18n) {
    this.terms = i18n.terms;
    this.stars = [];
    this.placeSelected = this.navParams.get("selectedPlace");
    this.getImage(0);
    switch(this.placeSelected.type.toLowerCase()){
      case "restaurant":
        this.svgIcon = this.svg.icons.restaurant;
        break;

      case "experience":
        this.svgIcon = this.svg.icons.experience;
        break;

      case "hotel":
        this.svgIcon = this.svg.icons.hotel;
        break;

      case "ngo":
        this.svgIcon = this.svg.icons.ngo;
        break;
    }

    for(var i = 0; i < 5; i++){
      if(i <= this.placeSelected.getAverageNote())
        this.stars[i] = "ios-star";
      else
        this.stars[i] = "ios-star-outline";
    }
  }

  private getImage(index: number){
    let name: string;
    if(index > 0){
      name = this.placeSelected.nom+index;
    }
    else{
      name = this.placeSelected.nom;
    }
    var folder = name;
    this.imageService.getImageUrl(folder, name, (url) => {
      if(url == ""){
        this.showErrorMsg = true;
      } 
      else{
        this.imagesUrl.push("url("+url+")");
      }
      this.showImageLoader = false;
    });
  }

  private changeImage(){

  }

  private backNav(){
    this.navCtrl.pop();
  }

  ionViewDidLoad(){
    document.getElementById("svg-icon").innerHTML = this.svgIcon;
  }

  private call(){
    this.callNumber.callNumber(this.placeSelected.infos.tel, true)
    .then(() => console.log('Launched dialer!'))
    .catch(() => console.log('Error launching dialer'));
  }
}
