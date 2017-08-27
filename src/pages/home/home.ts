import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LieuxService } from '../../services/lieux.service';
import { Lieux } from "../../models/lieux";

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  private isSearchBarActive = false;
  private lieux: Lieux[];
  private searchBar: Boolean = true;
  private markers = [];

  private types = ["restaurant", "hotel", "experience", "ngo"];

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  
 
  constructor(public navCtrl: NavController, public geolocation: Geolocation, private lieuxService: LieuxService) {
    this.lieux = this.lieuxService.getAllLieux((lieux) => {
      this.loadMap(lieux)
    });
  }

  clearMarkers(){
    for(let marker of this.markers){
      marker.setMap();
    }
    this.markers = [];
  }
 
  ionViewDidLoad(){
  }
 
  loadMap(lieux: Lieux[]){
    this.lieux = lieux;
    this.geolocation.getCurrentPosition().then((position) => {

    let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.map = map;
    
    var input = /** @type {!HTMLInputElement} */(
      document.getElementById('search-map'));

    var types = document.getElementById('type-selector');
    /*this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);*/

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', this.map);
    
    autocomplete.addListener('place_changed', function() {
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
      }

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
    });

    this.loadMarkersOnMap(lieux);

    }, (err) => {
      console.log(err);
    });
  }

  private addMarkerToList(marker){
    if(marker)
      this.markers.push(marker);
  }

  private loadMarkersOnMap(lieux: Lieux[], choice?: number){
    for(let lieu of lieux)
      {
        let infowindow = new google.maps.InfoWindow({
          content: this.getContentString(lieu)
        });
        let marker;
  
        var pos: any = {lat: +lieu.location.latitude, lng: +lieu.location.longitude}; 
        if(choice != null){
          if(this.types[choice] == lieu.type.toLowerCase())
          {
            marker = new google.maps.Marker({
              position: pos,
              map: this.map,
              icon: "assets/pins/"+lieu.type.toLowerCase()+".png"
            });
            
            marker.addListener('click', function() {
              infowindow.open(this.map, marker);
            });
          }
        }
        else
        {
          marker = new google.maps.Marker({
            position: pos,
            map: this.map,
            icon: "assets/pins/"+lieu.type.toLowerCase()+".png"
          });
          
          marker.addListener('click', function() {
            infowindow.open(this.map, marker);
          });
        }
        this.addMarkerToList(marker);
      }
  }

  private resetSearchBar(){
    this.isSearchBarActive = false;
  }

  private getContentString(lieu: Lieux): string{
    let img: string;
    switch(lieu.type.toLowerCase()){
      case "restaurant": 
        img = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg"        width="76.000000pt" height="73.000000pt" viewBox="0 0 76.000000 73.000000"        preserveAspectRatio="xMidYMid meet">              <g transform="translate(0.000000,73.000000) scale(0.100000,-0.100000)"    fill="#e98815"  stroke="none">       <path d="M296 654 c-226 -72 -298 -337 -141 -512 62 -69 127 -97 230 -96 96 0       147 21 218 90 58 58 87 130 87 218 0 84 -23 146 -76 205 -82 91 -210 129 -318       95z m92 -172 c2 -39 -2 -69 -9 -78 -11 -13 -11 -41 -5 -229 1 -34 -2 -40 -19       -40 -24 0 -33 45 -34 169 -1 55 -6 84 -16 96 -17 19 -29 137 -14 142 6 2 29 3       52 3 l42 0 3 -63z m78 33 c17 -41 19 -138 3 -167 -6 -11 -12 -64 -12 -117 -2       -77 -5 -96 -17 -96 -9 0 -17 14 -21 40 -9 53 -11 360 -2 368 15 16 35 5 49       -28z"/>       </g>       </svg>';
        break;
      case "hotel": 
        img = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg"        width="76.000000pt" height="73.000000pt" viewBox="0 0 76.000000 73.000000"        preserveAspectRatio="xMidYMid meet">              <g transform="translate(0.000000,73.000000) scale(0.100000,-0.100000)"       fill="#2f76c4" stroke="none">       <path d="M300 657 c-95 -27 -185 -109 -214 -194 -24 -71 -21 -177 8 -239 110       -237 446 -244 565 -12 29 57 33 75 33 140 0 54 -6 88 -21 124 -27 62 -100 136       -163 164 -59 26 -150 33 -208 17z m192 -122 c79 -92 95 -122 58 -110 -11 4       -20 3 -19 -2 7 -38 -3 -293 -11 -293 -6 0 -10 64 -10 173 l0 174 -52 59 c-28       32 -58 59 -66 59 -7 0 -45 -27 -83 -60 l-69 -60 0 -172 c0 -109 -4 -173 -10       -173 -6 0 -10 58 -10 155 0 141 -6 176 -25 145 -8 -13 -25 -13 -25 0 0 11 133       141 182 176 18 14 39 23 47 22 9 -2 50 -44 93 -93z m-27 -352 c0 -39 -19 -45       -23 -8 -5 36 -32 32 -32 -5 0 -20 -5 -30 -15 -30 -10 0 -15 10 -15 33 0 43 6       49 50 45 32 -3 35 -6 35 -35z"/>       </g>       </svg>';
        break;
      case "ngo": 
        img = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg"        width="76.000000pt" height="73.000000pt" viewBox="0 0 76.000000 73.000000"        preserveAspectRatio="xMidYMid meet">              <g transform="translate(0.000000,73.000000) scale(0.100000,-0.100000)"       fill="#408b26" stroke="none">       <path d="M280 655 c-75 -24 -141 -82 -179 -157 -29 -57 -33 -75 -33 -140 0       -94 26 -158 90 -221 67 -66 129 -91 223 -91 97 1 168 32 233 105 54 61 76 121       76 213 0 120 -66 223 -175 276 -60 29 -170 36 -235 15z m-100 -174 c0 -14 16       -39 39 -62 32 -33 45 -39 80 -39 31 0 48 -6 67 -25 l25 -25 26 20 c17 13 41       20 70 20 24 0 53 5 64 10 24 13 49 61 49 95 0 18 5 25 20 25 25 0 25 -15 -1       -65 -30 -56 -57 -83 -88 -87 -25 -3 -26 -6 -26 -64 0 -49 5 -68 28 -102 28       -44 35 -76 15 -70 -12 4 -50 71 -64 113 -5 16 -12 6 -31 -45 -28 -75 -38 -89       -54 -73 -7 7 -1 28 19 69 30 59 59 161 49 170 -10 10 -47 -21 -58 -49 -15 -35       -29 -31 -44 12 -11 32 -40 58 -48 44 -2 -5 -7 -29 -11 -54 -7 -49 13 -129 40       -160 19 -22 18 -41 -3 -37 -11 2 -27 27 -42 66 l-25 63 -27 -61 c-15 -33 -33       -60 -39 -60 -19 0 -23 30 -7 48 19 21 61 112 75 165 9 33 9 37 -9 37 -49 0       -152 140 -119 160 17 11 30 -5 30 -39z m164 13 c22 -21 20 -50 -4 -74 -24 -24       -43 -25 -75 -4 -29 19 -33 55 -9 78 20 20 68 20 88 0z m185 -13 c34 -34 5 -91       -45 -91 -48 0 -70 55 -37 92 21 23 58 23 82 -1z"/>       </g>       </svg>       "';        
        break;
      case "experience": 
        img = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg"        width="76.000000pt" height="73.000000pt" viewBox="0 0 76.000000 73.000000"        preserveAspectRatio="xMidYMid meet">              <g transform="translate(0.000000,73.000000) scale(0.100000,-0.100000)"       fill="#cf000a" stroke="none">       <path d="M277 656 c-89 -32 -158 -100 -193 -192 -25 -67 -16 -197 18 -255 36       -61 83 -106 143 -137 43 -23 63 -27 135 -27 70 0 94 4 135 24 64 32 124 93       155 156 33 69 35 189 4 256 -54 116 -166 189 -289 189 -38 -1 -87 -7 -108 -14z       m221 -73 c2 -20 -7 -51 -25 -85 -15 -29 -30 -57 -32 -61 -2 -5 29 -5 68 -1 99       9 102 5 96 -113 -4 -86 -7 -97 -34 -132 -46 -58 -142 -78 -219 -46 -62 26       -161 96 -168 118 -17 50 5 151 36 167 10 6 32 10 49 10 40 0 93 47 122 108 31       67 38 73 73 70 27 -3 31 -7 34 -35z"/>       <path d="M444 602 c-6 -4 -22 -27 -34 -52 -41 -82 -102 -140 -147 -140 -31 0       -53 -37 -53 -90 0 -40 5 -51 38 -82 61 -59 122 -88 181 -88 48 0 121 21 121       35 0 3 -35 4 -77 1 -62 -4 -70 -3 -38 4 22 5 57 12 77 15 42 6 84 36 74 53 -4       7 -17 8 -39 1 -17 -5 -52 -9 -77 -8 l-45 1 63 14 c82 18 102 29 102 59 0 23       -1 23 -77 20 -81 -4 -81 -1 -1 10 50 6 78 25 78 52 0 14 -12 15 -84 9 -55 -5       -87 -3 -91 4 -3 5 10 37 30 69 25 39 35 68 33 87 -3 29 -16 39 -34 26z"/>       </g>       </svg>';
        break;
    }

    let stars = '<img src="assets/icon/star-outline-icon.png" /><img src="assets/icon/star-outline-icon.png" /><img src="assets/icon/star-outline-icon.png" /><img src="assets/icon/star-outline-icon.png" /><img src="assets/icon/star-outline-icon.png" />';

    var divInfo = '<div class="info">        <h2>'+lieu.nom+'</h2>        <h3>'+lieu.categorie+'</h3>        <div color="black"> '+stars+' </div>    </div></div>';
    return "<div class='info-window'>"+img+divInfo;
  }

  private triMap(index?){
    /*if(index != null)
      this.lieux = this.lieuxService.getAllLieux((lieux) => {
        this.loadMap(lieux, index)
      });
    else
      this.lieux = this.lieuxService.getAllLieux((lieux) => {
        this.loadMap(lieux)
      });
      console.log(this.lieux[0]);*/
    this.clearMarkers();
    this.loadMarkersOnMap(this.lieux, index);
  }

}
