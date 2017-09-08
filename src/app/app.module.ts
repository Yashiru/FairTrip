import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { PlaceDetailsPage } from '../pages/placeDetails/placeDetails';

import { NativeHeader } from '../components/native-header/native-header'; 
import { NativeFooter } from '../components/native-footer/native-footer'; 

import { Searchbar } from '../components/searchbar/searchbar'
import { StatusBar } from '@ionic-native/status-bar';
import { Icon } from '../components/icon/icon';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { LieuxService } from '../services/lieux.service';
import { I18n } from '../services/i18n/i18n';
import { Globalization } from '@ionic-native/globalization';
import {HttpModule} from '@angular/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { IonicStorageModule } from '@ionic/storage';
import { environment } from '../environments/environment';
import { Network } from '@ionic-native/network';
import { AddPlace } from '../pages/addPlace/addPlace';
import { Transfer } from '@ionic-native/transfer';
import { Camera } from '@ionic-native/camera';
import { EventData } from '../services/event-data';
import { FirebaseImage } from '../services/firebase-image';
import { LocalStorage } from '../services/local-storage';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PlaceDetailsPage,
    NativeHeader,
    NativeFooter,
    Searchbar,
    Icon,
    AddPlace,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, 
    AngularFireAuthModule, 
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PlaceDetailsPage,
    NativeHeader,
    NativeFooter,
    Searchbar,
    Icon,
    AddPlace
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LieuxService,
    Network,
    Globalization,
    I18n,
    Transfer,
    Camera,
    EventData,
    FirebaseImage,
    LocalStorage
  ]
})
export class AppModule {}
