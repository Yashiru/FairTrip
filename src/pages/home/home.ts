import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LieuxService } from '../../services/lieux.service';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  private isSearchBarActive = false;
  searchBar: Boolean = true;
  Home: string = "home";
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  
 
  constructor(public navCtrl: NavController, public geolocation: Geolocation, private lieuxService: LieuxService) {
    console.log(lieuxService.getAllLieux());
  }
 
  ionViewDidLoad(){
    this.loadMap();
  }
 
  loadMap(){
    
       this.geolocation.getCurrentPosition().then((position) => {
    
         let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    
         let mapOptions = {
           center: latLng,
           zoom: 15,
           mapTypeId: google.maps.MapTypeId.ROADMAP
         }
    
         this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    
       }, (err) => {
         console.log(err);
       });
    
     }

     private resetSearchBar(){
       this.isSearchBarActive = false;
     }

}
