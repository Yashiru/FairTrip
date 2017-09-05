import { Component, Output, EventEmitter, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SvgIcons } from '../../models/svgIcons';
import { Icon } from '../icon/icon';
import { PlaceDetailsPage } from '../../pages/placeDetails/placeDetails';

@Component({
  selector: 'searchbar',
  templateUrl: 'searchbar.html'
})
export class Searchbar {
  @Output()
  changeModelUp: any = new EventEmitter();

  @Output()
  googleSearch: any = new EventEmitter();

  @Input()
  predictions: any = [];

  @Input()
  displayLoader: Boolean;
  
  hideClose:Boolean = true;
  private value: string = "";
  private svgIcons = new SvgIcons();
  private icons = this.svgIcons.icons;
  private isPredictionOpened: Boolean = false;

  constructor(public navCtrl: NavController) {
  }

  private close(){
    this.value = "";
    this.hideClose = true;
    document.getElementById("search-map").focus();
    this.changeModelUp.emit("");
  }

  private changeModel(){
    if(this.value != ""){
      this.hideClose = false;
      this.changeModelUp.emit(this.value);
      this.isPredictionOpened = true;
    }
    else{
      this.hideClose = true;
      this.changeModelUp.emit("");
      this.isPredictionOpened = false;
    }

  }

  private goToGooglePlace(lieu) {
    this.isPredictionOpened = false;
    this.googleSearch.emit(lieu);
  }

  private displayLieu(lieu){
    this.isPredictionOpened = false;
    if(this.navCtrl.getActive().component.name == "HomePage")      
      this.navCtrl.push(PlaceDetailsPage, {
        selectedPlace: lieu
      });
  }

}
