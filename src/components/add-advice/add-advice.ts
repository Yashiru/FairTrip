import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { Lieux } from '../../models/lieux';
import { I18n } from '../../services/i18n/i18n';
import { Avis } from '../../models/avis';
import { LieuxService } from '../../services/lieux.service';

@Component({
  selector: 'add-advice',
  templateUrl: 'add-advice.html'
})
export class AddAdvice {
  private placeToAdvice: Lieux;
  private terms: any;
  private stars: string[] = [
    "ios-star-outline",
    "ios-star-outline",
    "ios-star-outline",
    "ios-star-outline",
    "ios-star-outline"
  ];
  private advice: Avis = new Avis();

  constructor(private params: NavParams, 
              private navCtrl: NavController,
              private i18n: I18n,
              private tc: ToastController,
              private lieuxService: LieuxService,
              private viewCtrl: ViewController){
    this.terms = this.i18n.terms;
    this.placeToAdvice = this.params.get("place");
  }

  private back(){
    this.navCtrl.pop();
  }

  private mark(index: number){
    this.advice.note = index;
    for(var i = 0; i <= 4; i++){
      this.stars[i] = "ios-star-outline";
    }
    for(var i = 0; i < index; i++){
      this.stars[i] = "ios-star";
    }
  }

  private send(){
    if(this.advice.posterName != null && this.advice.posterName != "" && 
       this.advice.content != null && this.advice.content != "" && 
       this.advice.note != null){
      this.lieuxService.advice(this.placeToAdvice, this.advice, () => {
        this.viewCtrl.dismiss(null);
      });
    }
    else{
      let toast = this.tc.create({
        message: this.i18n.terms.completeForm,
        duration: 2500,
        position: 'bottom'
      });
    
      toast.present();
      
    }
  }

}

