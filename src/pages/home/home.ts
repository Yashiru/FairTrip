import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LieuxService } from '../../services/lieux.service';
import { Lieux } from "../../models/lieux";
import { PlaceDetailsPage } from '../placeDetails/placeDetails';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SvgIcons } from '../../models/svgIcons';
import { ToastController } from 'ionic-angular';
import { I18n } from '../../services/i18n/i18n';
import { AddPlace } from '../addPlace/addPlace';
import { FirebaseImage } from '../../services/firebase-image';
import { LocalStorage } from '../../services/local-storage';
import { InfoPage } from '../infoPage/infoPage';
import * as Leaflet from 'leaflet';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import { Vibration } from '@ionic-native/vibration';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  private isSearchBarActive = false;
  private lieux: Lieux[];
  private clickedTypes: Boolean[] = [false, false, false, false];
  private searchBar: Boolean = true;
  private isHudHidden: Boolean = false;
  private isLoadingMap: Boolean = true;
  private markers = [];
  private boxList = [];
  private infoWindows: any[] = [];
  private svgIcons: SvgIcons = new SvgIcons();
  private searchText: string = "";
  private service: any;
  private predictions: any = [];
  private displayLoader: Boolean = false;
  private lastSearchedMarker: any;
  private userLocation: any;
  private userLocationAddPlace: any;

  private types = ["restaurant", "hotel", "experience", "ngo"];

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  private mapbox: any;
  private geocoder = new google.maps.Geocoder;
  private userLocationMarker: any = new google.maps.Marker({});
  private myPlaceMarker: any = new google.maps.Marker({});

  static gotToLocation: Lieux;
 
  constructor(private i18n: I18n, 
              public toastCtrl: ToastController, 
              public navCtrl: NavController, 
              public geolocation: Geolocation, 
              private lieuxService: LieuxService, 
              private SplashScreen: SplashScreen, 
              private imageService: FirebaseImage,
              private localStorage: LocalStorage,
              private vibration: Vibration) {
    this.lieux = this.lieuxService.loadAllLieux((lieux) => {
      if(this.map == null){
        this.loadMap(lieux)
      }
    });
  }

  clearMarkers(){
    for(let marker of this.markers){
      marker.setMap();
    }
    this.markers = [];
  }
 

  ionViewDidEnter(){
    google.maps.event.trigger(this.map, 'resize');
    if(HomePage.gotToLocation != null){
      var pos = HomePage.gotToLocation.location;
      var place = HomePage.gotToLocation;
      let latLng = {lat: pos.latitude, lng: pos.longitude};
      console.log(pos);
      console.log(latLng);
      this.map.setCenter(latLng);
      this.map.setZoom(15);
      this.myPlaceMarker = new google.maps.Marker({
        position: latLng,
        map: this.map,
      });
    }
    
  }

  ionViewDidLeave(){
    if(HomePage.gotToLocation != null){
      this.myPlaceMarker.setMap(null);
    }

    HomePage.gotToLocation = null;
  }
 
  loadMap(lieux: Lieux[]){
    this.lieux = lieux;
    var homePage = this;
    if(this.lieuxService.isConnected == true)
    {
      let mapOptions = {
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.MAP_TYPE_NONE,
        zoomControl: false,
        mapTypeControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: false
      }
      var map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map = map;
      let longpress: Boolean;
      let start, end;

      this.map.addListener('click', function (e) {
        (longpress) ? homePage.addPlace(e.latLng) : console.log("Short Press");
      });

      this.map.addListener('mousedown', function(e){
          start = new Date().getTime();           
      });

      this.map.addListener('mouseup', function(e){
        end = new Date().getTime();
        longpress = (end - start < 500) ? false : true;         
      });

      var types = document.getElementById('type-selector');
      var options = {
        types: ['establishment']
      };
      /*this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);*/
      
      this.loadMarkersOnMap(lieux, () => {
        this.isHudHidden = true;
        this.SplashScreen.hide();
      });

      if (navigator.geolocation) {
        let homePage = this;
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          var markerImage = new google.maps.MarkerImage("assets/pins/locate.png",
            new google.maps.Size(60, 60),
            new google.maps.Point(0, 0),
            new google.maps.Point(30, 30));

          homePage.userLocationMarker = new google.maps.Marker({
            position: pos,
            map: homePage.map,
            icon: markerImage
          });

          let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          homePage.userLocationAddPlace = position.coords;
          homePage.userLocation = latLng;

          map.setCenter(latLng);
          homePage.isLoadingMap = false;
        }, function() {

        }, {
          enableHighAccuracy: true,
          timeout: Infinity,
          maximumAge: 0	
        });
      } else {
        // Browser doesn't support Geolocation
      }
    }
    else{
      mapboxgl.accessToken = 'pk.eyJ1IjoiZmFzYW5vbCIsImEiOiJjajd0NGdzZzQ0ZGpjMzNudXVrN2IwMDBrIn0.jLc3yYl9OnkyyQTvrssQzg';
      this.mapbox = new mapboxgl.Map({
        style: 'mapbox://styles/mapbox/light-v9',
        center: [2.3387, 48.8665],
        zoom: 8,
        maxZoom: 17,
        minZoom: 4,
        container: 'map'
      });

      this.isHudHidden = true;
      this.SplashScreen.hide();

      this.loadMarkersOnMapbox(lieux, () => {
        
      });
    }

  }


  private addMarkerToList(marker){
    if(marker)
      this.markers.push(marker);
  }

  private loadMarkersOnMapbox(lieux: Lieux[], callback: () => void){
    let i: number = 0;    
    for(let lieu of lieux){
      let markerElement = document.createElement('div');
      markerElement.className = 'mapbox-marker';
      markerElement.style.backgroundImage = 'url(assets/pins/'+lieu.type.toLowerCase()+'.png)';
      markerElement.style.width = '45px';
      markerElement.style.height = '45px';

      let infoWindowElement = document.createElement('div');
      infoWindowElement.className = 'mapbox-infoWindow';
      infoWindowElement.style.backgroundColor = 'white';
      infoWindowElement.style.width = '50px';
      infoWindowElement.style.height = '45px';

      
      let popup = new mapboxgl.Popup()
        .setHTML(this.getContentString(lieu, i).innerHTML);
  
      let marker = new mapboxgl.Marker(markerElement)
        .setLngLat([lieu.location.longitude, lieu.location.latitude])
        .setPopup(popup)
        .addTo(this.mapbox);
      i++;
    }
  }

  private loadMarkersOnMap(lieux: Lieux[], callback?: () => void, choice?: number){
    let i: number = 0;
    var homePage = this;
    for(let lieu of lieux)
      {
        let infowindow = new google.maps.InfoWindow({
          content: this.getContentString(lieu, i),
          maxWidth: 240
        });
        this.infoWindows.push(infowindow);
        let marker;
  
        let pos: any = {lat: +lieu.location.latitude, lng: +lieu.location.longitude}; 
        if(choice != null){
          if(this.types[choice] == lieu.type.toLowerCase())
          {
            let infoWindows = this.infoWindows;
            let navCtrl = this.navCtrl;
            marker = new google.maps.Marker({
              position: pos,
              map: this.map,
              icon: "assets/pins/"+lieu.type.toLowerCase()+".png"
            });
            
            marker.addListener('click', function() {
              console.log(marker.getPosition());
              for(let infoWindow of infoWindows){
                infoWindow.close();
              }
              infowindow.open(this.map, marker);
              document.getElementById("info").addEventListener("click", (e) => {
                e.stopPropagation();
                let selectedPlace = lieu;
                if(navCtrl.getActive().component.name == "HomePage")
                  navCtrl.push(PlaceDetailsPage, {selectedPlace: selectedPlace});
              });

              homePage.map.setCenter(marker.getPosition());
            }); 
          }
        }
        else
        {
          let infoWindows = this.infoWindows;
          let navCtrl = this.navCtrl;
          marker = new google.maps.Marker({
            position: pos,
            map: this.map,
            icon: "assets/pins/"+lieu.type.toLowerCase()+".png"
          });
          
          marker.addListener('click', function() {
            console.log(marker.getPosition());
            homePage.map.panTo(marker.getPosition());            
            for(let infoWindow of infoWindows){
              infoWindow.close();
            }
            infowindow.open(this.map, marker);
            homePage.getImage(lieu, (url)=>{
              if(url != null)
                document.getElementById("info").getElementsByTagName("img")[0].src = url;
            });
            document.getElementById("info").addEventListener("click", (e) => {
              e.stopPropagation();
              let selectedPlace = lieu;     
              if(navCtrl.getActive().component.name == "HomePage")
                navCtrl.push(PlaceDetailsPage, {selectedPlace: selectedPlace});
            });
          });

        }
        this.addMarkerToList(marker);
        i++;
      }
      if(callback != null)
      {
        callback();
      }
  }

  private resetSearchBar(){
    this.isSearchBarActive = false;
  }

  private getContentString(lieu: Lieux, index: number){
    let img: string = "<div class='info'>";
    switch(lieu.type.toLowerCase()){
      case "restaurant": 
        img = this.svgIcons.coloredIcons.restaurant;
        break;
      case "hotel": 
        img = this.svgIcons.coloredIcons.hotel;
        break;
      case "ngo": 
        img = this.svgIcons.coloredIcons.ngo;        
        break;
      case "experience": 
        img = this.svgIcons.coloredIcons.experience;
        break;
    }

    var boxText = document.createElement("div");
    boxText.id = "info";
    boxText.className = "info-window info-"+index;
    let stars = '<img src="assets/icon/star-outline-icon.png" /><img src="assets/icon/star-outline-icon.png" /><img src="assets/icon/star-outline-icon.png" /><img src="assets/icon/star-outline-icon.png" /><img src="assets/icon/star-outline-icon.png" />';
    var divInfo = '<div class="info">        <h2>'+lieu.nom+'</h2>        <h3>'+lieu.categorie+'</h3>        <div color="black"> '+stars+' </div>    </div></div>';
    boxText.innerHTML = img+divInfo;
    return boxText;
  }

  private getImage(place: Lieux, callback: (imageUrl)=>void){
    let name: string = place.nom;
    var folder = name;
    this.imageService.getImageUrl(folder, name, (url) => {
      if(url == ""){
        callback(null);
      } 
      else{
        callback(url);
      }
    });
  }

  private triMap(index?){
    this.clickedTypes = [false, false, false, false];
    if(index != null)
    {
      this.clickedTypes[index] = !this.clickedTypes[index];
      for(let marker of this.markers){
        switch(marker.getIcon()){
          case "assets/pins/restaurant.png":
            if(index != 0)
              marker.setVisible(false);
            if(index == 0)
              marker.setVisible(true);
            break;
          case "assets/pins/hotel.png":
            if(index != 1)
              marker.setVisible(false);
            if(index == 1)
              marker.setVisible(true);
            break;
          case "assets/pins/experience.png":
            if(index != 2)
              marker.setVisible(false);
            if(index == 2)
              marker.setVisible(true);
            break;
          case "assets/pins/ngo.png":
          if(index != 3)
              marker.setVisible(false);
            if(index == 3)
              marker.setVisible(true);
            break;
        }
      }
    }
    else if(index == null && this.markers.length == 0){
      this.loadMarkersOnMap(this.lieux, ()=>{}, index);
    }
    else if(index == null){
      for(let marker of this.markers){
        marker.setVisible(true);
      }
    }

  }

  private mapClick(){
    for(let infoWindow of this.infoWindows){
      infoWindow.close();
    }
    document.getElementById("search-map").blur();
  }

  private changeSearchString(value){
    this.displayLoader = true;
    this.searchText = value;
    let HomePage = this;
    this.predictions = [];
    if(value != "" && this.lieuxService.isConnected)
    {
      this.service = new google.maps.places.AutocompleteService();
      this.service.getQueryPredictions({ input: value }, (predictions, status) => {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
          this.predictions.push({
            nom: HomePage.i18n.terms.noresult,
            type: "none"

          });
          this.displayLoader = false;
          return;
        }
        let googlePredictions = predictions;
        HomePage.setPredictions(googlePredictions, (selector: Boolean) => {
          this.displayLoader = selector;
        });
      });
    }
    else{
      this.displayLoader = false;
      this.setPredictions();
    }
  }

  public setPredictions(googlePredictions?: any, callback?: (selector: Boolean) => void){
    if(googlePredictions != null && callback != null)
    {
      this.predictions = [];
      let appPredictions = this.lieuxService.searchLieu(this.searchText);
  
      for(let appPrediction of appPredictions){
        this.predictions.push(appPrediction);
      }
  
      if(this.predictions.length == 0){
        for(let googlePrediction of googlePredictions ){
          this.predictions.push(googlePrediction)
        }
      }
  
      callback(false);
    }
    else{
      this.predictions = [];
    }
    
  }

  private changeMapPosition(lieu) { 
    var infowindow = new google.maps.InfoWindow;
    var map = this.map;
    var HomePage = this;

    if(this.lastSearchedMarker){
      this.lastSearchedMarker.setMap();
    }

    this.geocoder.geocode({'placeId': lieu.place_id}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          map.setZoom(13);
          map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
          });
          infowindow.setContent(lieu.description);
          infowindow.open(map, marker);
          HomePage.infoWindows.push(infowindow);
          HomePage.lastSearchedMarker = marker;
        } else {
          let toast = this.toastCtrl.create({
            message: 'Aucune localisation a afficher',
            duration: 2000
          });
          toast.present();
        }
      } else {
        let toast = this.toastCtrl.create({
          message: 'Geocoder failed due to: ' + status,
          duration: 2000
        });
        toast.present();
      }
    });
    
  }
  
  private updateSearchBarStat(isSearchBaractive){
    this.isSearchBarActive = isSearchBaractive;
  }

  private addPlace(longPressPos? : any) {
    if(longPressPos == null){
      this.navCtrl.push(AddPlace, {"userLocation": this.userLocationAddPlace || {latitude: 0, longitude: 0}});
    }
    else{
      this.vibration.vibrate(30);    
      var pos = {latitude: longPressPos.lat(), longitude: longPressPos.lng()};
      this.navCtrl.push(AddPlace, {"userLocation": pos || {latitude: 0, longitude: 0}});      
    }
  }

  private goToInfo(){
    this.navCtrl.push(InfoPage);
  }

  private goToUserLocation() {
    this.map.setCenter(this.userLocation);
    this.map.setZoom(15);
  }
  

}
