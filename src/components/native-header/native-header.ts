import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'native-header',
  templateUrl: 'native-header.html'
})
export class NativeHeader {
  @Input()
  title?: string;

  @Input()
  searchBar?: Boolean;

  @Input()
  predictions: any;

  @Input()
  isSearchBarActive?: Boolean;

  @Input()
  displayLoader: Boolean;
  
  @Output()
  changeModelUp: any = new EventEmitter();
  
  @Output()
  changeMapPosition: any = new EventEmitter();

  @Output()
  updateSearchBarStat: any = new EventEmitter();
  

  constructor(public navCtrl: NavController) {
    if(this.isSearchBarActive != true && this.isSearchBarActive != false){
      this.isSearchBarActive == false;
    }
  }

  private activeSeachBar(){
    this.isSearchBarActive = true;
    this.updateSearchBarStat.emit(true);
  }

  private resetSearchBar(){
    this.isSearchBarActive = false;
    this.updateSearchBarStat.emit(false);
  }

  changeModel(value){
    this.changeModelUp.emit(value);
  }

  googleSearch(lieu) {
    this.changeMapPosition.emit(lieu);
  }

}
