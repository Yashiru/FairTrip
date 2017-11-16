import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { I18n } from '../../services/i18n/i18n';

@Component({
  selector: 'about-page',
  templateUrl: 'aboutPage.html'
})
export class AboutPage {
  private terms: any;

  constructor(private navCtrl: NavController, private i18n: I18n){
    this.terms = i18n.terms;
  }

  private backNav(){
    this.navCtrl.pop();
  }
}
