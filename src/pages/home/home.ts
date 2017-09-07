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



declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  private isSearchBarActive = false;
  private lieux: Lieux[];
  private searchBar: Boolean = true;
  private isHudHidden: Boolean = false;
  private markers = [];
  private boxList = [];
  private infoWindows: any[] = [];
  private svgIcons: SvgIcons = new SvgIcons();
  private searchText: string = "";
  private service = new google.maps.places.AutocompleteService();
  private predictions: any = [];
  private displayLoader: Boolean = false;
  private lastSearchedMarker: any;
  

  private types = ["restaurant", "hotel", "experience", "ngo"];

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  private geocoder = new google.maps.Geocoder;
  
  
 
  constructor(private i18n: I18n, public toastCtrl: ToastController, public navCtrl: NavController, public geolocation: Geolocation, private lieuxService: LieuxService, private SplashScreen: SplashScreen, private imageService: FirebaseImage) {
    this.lieux = this.lieuxService.loadAllLieux((lieux) => {
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
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      }
      var map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map = map;

      var types = document.getElementById('type-selector');
      var options = {
        types: ['establishment']
      };
      /*this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);*/
      
      this.loadMarkersOnMap(lieux, () => {

      });
      this.isHudHidden = true;
      this.SplashScreen.hide();

    }, (err) => {
      console.log("Erreur de connexion home.ts line 82 (catch error and make a splashscreen)");
      console.log(err);
    });
  }

  private addMarkerToList(marker){
    if(marker)
      this.markers.push(marker);
  }

  private loadMarkersOnMap(lieux: Lieux[], callback?: () => void, choice?: number){
    let i: number = 0;
    for(let lieu of lieux)
      {
        let infowindow = new google.maps.InfoWindow({
          content: this.getContentString(lieu, i)
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

  private triMap(index?){
    this.clearMarkers();
    this.loadMarkersOnMap(this.lieux, ()=>{}, index);
  }

  private mapClick(){
    for(let infoWindow of this.infoWindows){
      infoWindow.close();
    }
    document.getElementById("search-map").blur();
  }

  changeSearchString(value){
    this.displayLoader = true;
    this.searchText = value;
    let HomePage = this;
    this.predictions = [];
    if(value != "")
    {
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
    console.log(lieu);
  }
  
  private updateSearchBarStat(isSearchBaractive){
    this.isSearchBarActive = isSearchBaractive;
  }

  private addPlace() {
    this.navCtrl.push(AddPlace);
  }

}
