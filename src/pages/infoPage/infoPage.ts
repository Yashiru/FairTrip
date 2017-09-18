import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Lieux } from '../../models/lieux';
import { SvgIcons } from '../../models/svgIcons';
import { FirebaseImage } from '../../services/firebase-image';
import { I18n } from '../../services/i18n/i18n';

@Component({
  selector: 'info-page',
  templateUrl: 'infoPage.html'
})
export class InfoPage {
  
  constructor(private navCtrl: NavController){

  }

  private backNav(){
    this.navCtrl.pop();
  }
}
