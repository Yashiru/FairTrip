import { Component, Input, Output } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'native-header',
  templateUrl: 'native-header.html'
})
export class NativeHeader {
  @Input()
  title: string;

  constructor(public navCtrl: NavController) {

  }

}
