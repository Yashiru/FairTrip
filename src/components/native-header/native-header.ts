import { Component, Input, Output } from '@angular/core';
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

  private isSearchBarActive: Boolean = false;

  constructor(public navCtrl: NavController) {

  }

  private activeSeachBar(){
    this.isSearchBarActive = true;
  }

  private resetSearchBar(){
    this.isSearchBarActive = false;
  }

}
