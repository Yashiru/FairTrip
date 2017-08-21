import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  Home: string = "home";

  constructor(public navCtrl: NavController) {

  }

}
