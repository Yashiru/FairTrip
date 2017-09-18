import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'native-footer',
  templateUrl: 'native-footer.html'
})

export class NativeFooter {
  private lastIndex: number = -1;
  private selectedButtons: Boolean[] = [false, false, false, false];
  private isActiveButtonsDefined: Boolean = false;

  @Input()
  title?: string;
  

  @Output()
  clickIcon: any = new EventEmitter();

  constructor(public navCtrl: NavController) {

  }

  ngOnInit(){
    this.isActiveButtonsDefined = true;
  }

  private emit(index: number)
  {
    if(index != undefined){
      this.selectedButtons[index] = !this.selectedButtons[index];
    }

    for(var i = 0; i < this.selectedButtons.length; i++){
      if(i != index){
        this.selectedButtons[i] = false;
      }
    }
    setTimeout(()=>{
      this.emitIndex(index);
    }, 20)
    
  }

  private emitIndex(index: number){
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
