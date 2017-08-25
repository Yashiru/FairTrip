import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'searchbar',
  templateUrl: 'searchbar.html'
})
export class Searchbar {
  hideClose:Boolean = true;
  private value: string = "";

  constructor(public navCtrl: NavController) {

  }

  private change(){
    if(this.value != ""){
      this.hideClose = false;
    }
    else{
      this.hideClose = true;
    }
  }

  private close(){
    this.value = "";
    this.hideClose = true;
  }

}
