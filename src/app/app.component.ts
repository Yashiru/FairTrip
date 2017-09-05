import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { HomePage } from '../pages/home/home';
import { I18n } from '../services/i18n/i18n';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, private i18n: I18n) {
    platform.ready().then(() => {
      statusBar.backgroundColorByHexString("#440096");
    });
  }
}
