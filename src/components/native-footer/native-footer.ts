import { Component, Input, Output } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'native-footer',
  templateUrl: 'native-footer.html'
})

export class NativeFooter {
  @Input()
  title?: string;

  @Output()
  clickIcon?: any;

  constructor(public navCtrl: NavController) {

  }

}
