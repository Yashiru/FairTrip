import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Lieux } from '../../models/lieux';
import { SvgIcons } from '../../models/svgIcons';
import { FirebaseImage } from '../../services/firebase-image';
import { I18n } from '../../services/i18n/i18n';
import { AboutPage } from '../aboutPage/aboutPage';
import { MyPlaces } from '../myPlace/myPlace';
import { HelpPage } from '../helpPage/helpPage';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'info-page',
  templateUrl: 'infoPage.html'
})
export class InfoPage {
  private terms: any; 

  constructor(private navCtrl: NavController, private i18n: I18n, private socialSharing: SocialSharing, private iab: InAppBrowser){
    this.terms = i18n.terms;
  }

  private backNav(){
    this.navCtrl.pop();
  }
  
  private myPlaces(){
    this.navCtrl.push(MyPlaces);
  }

  private help(){
    this.navCtrl.push(HelpPage);
  }

  private about(){
    this.navCtrl.push(AboutPage);
  }

  private contact(){
    this.socialSharing.shareViaEmail('', '', ['recipient@example.org']).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }

  private webSite(){
    var website = this.iab.create('https://www.fairtrip.org/');      
    website.show();
  }
  
  private fb(){
    var fbPage = this.iab.create('https://www.facebook.com/fairtrip.org/');  
    fbPage.show();
  }

  private twitter(){
    var twitterPage = this.iab.create('https://twitter.com/fairtrip_app');  
    twitterPage.show();
  }

  private insta(){
    var instaPage = this.iab.create('https://www.instagram.com/fairtrip_app/'); 
    instaPage.show();
  }
}
