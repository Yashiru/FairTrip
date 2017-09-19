import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { HomePage } from '../pages/home/home';
import { I18n } from '../services/i18n/i18n';
import { Keyboard } from '@ionic-native/keyboard';
import { Network } from '@ionic-native/network';
import { LieuxService } from '../services/lieux.service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, private i18n: I18n, private keyboard: Keyboard, private network: Network, private lieuxService: LieuxService) {
    if(this.network.type != "none")
    {
      this.lieuxService.isConnected = true;
    }
    else{
      this.lieuxService.isConnected = false;
    }
    console.log(this.lieuxService.isConnected);
    platform.ready().then(() => {
      this.keyboard.disableScroll(true);
      statusBar.backgroundColorByHexString("#440096");
    });
  }
}
