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
  

  constructor(public navCtrl: NavController) {
    if(this.isSearchBarActive != true && this.isSearchBarActive != false){
      this.isSearchBarActive == false;
    }
  }

  private activeSeachBar(){
    this.isSearchBarActive = true;
  }

  private resetSearchBar(){
    this.isSearchBarActive = false;
  }

  changeModel(value){
    this.changeModelUp.emit(value);
  }

}
