import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Lieux } from '../../models/lieux';
import { SvgIcons } from '../../models/svgIcons';

@Component({
  selector: 'page-place-details',
  templateUrl: 'placeDetails.html'
})
export class PlaceDetailsPage {
  private placeSelected: Lieux;
  private svg: SvgIcons = new SvgIcons();
  private svgIcon;

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.placeSelected = this.navParams.get("selectedPlace");
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
  }

  ionViewDidLoad(){
    document.getElementById("svg-icon").innerHTML = this.svgIcon;
  }
}
