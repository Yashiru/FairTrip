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

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { IonicStorageModule } from '@ionic/storage';
import { environment } from '../environments/environment';
import { Network } from '@ionic-native/network';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PlaceDetailsPage,
    NativeHeader,
    NativeFooter,
    Searchbar,
    Icon,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, 
    AngularFireAuthModule, 
    IonicStorageModule.forRoot(),
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
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LieuxService,
    Network  
  ]
})
export class AppModule {}
