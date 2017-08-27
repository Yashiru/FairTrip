import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'native-footer',
  templateUrl: 'native-footer.html'
})

export class NativeFooter {
  private lastIndex: number = -1;

  @Input()
  title?: string;

  @Output()
  clickIcon: any = new EventEmitter();

  constructor(public navCtrl: NavController) {

  }

  private emit(index: number)
  {
    if(this.lastIndex == index)
    {
      this.clickIcon.emit(); 
      this.lastIndex = -1;
    }
    else
    {
      this.clickIcon.emit(index);
      this.lastIndex = index;
    }
      
  }

}
