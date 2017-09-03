import { Component, Output, EventEmitter, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SvgIcons } from '../../models/svgIcons';
import { Icon } from '../icon/icon';

@Component({
  selector: 'searchbar',
  templateUrl: 'searchbar.html'
})
export class Searchbar {
  @Output()
  changeModelUp: any = new EventEmitter();

  @Input()
  predictions: any = [];

  @Input()
  displayLoader: Boolean;
  
  hideClose:Boolean = true;
  private value: string = "";
  private svgIcons = new SvgIcons();
  private icons = this.svgIcons.icons;

  constructor(public navCtrl: NavController) {
  }

  private close(){
    this.value = "";
    this.hideClose = true;
    document.getElementById("search-map").focus();
  }

  private changeModel(){
    if(this.value != ""){
      this.hideClose = false;
      this.changeModelUp.emit(this.value);
    }
    else{
      this.hideClose = true;
      this.changeModelUp.emit("");
    }

  }

}
