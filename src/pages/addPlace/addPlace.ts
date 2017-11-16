import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { I18n } from '../../services/i18n/i18n';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { EventData } from '../../services/event-data';
import { FirebaseImage } from '../../services/firebase-image';
import { Lieux } from '../../models/lieux';
import { LocalStorage } from '../../services/local-storage';
import { LieuxService } from '../../services/lieux.service';
import { Adresse } from '../../models/adresse';
import { ToastController } from 'ionic-angular';


@Component({
  selector: 'add-place',
  templateUrl: 'addPlace.html'
})
export class AddPlace {
  private terms = this.i18n.terms;
  private userLocation: any = {
    lat: "",
    lng: ""
  };
  private blobsToUpload = [];
  private b64Images = [];
  private isChoicePictureOpened: Boolean = false;
  private buttonSendLoad: Boolean = false;
  private isImportLoading: Boolean = false;
  private showSuccessMessage: Boolean = false;
  private numberOfEndedUploads: number = 0;
  private uploadProgress: number = 0;
  private placeToAdd: Lieux = new Lieux();
  private imagesToUpload: string[] = [];
  private success: string = "";


  constructor(public navCtrl: NavController,
              private navParams: NavParams, 
              private i18n: I18n, 
              private geolocation: Geolocation, 
              private transfer: Transfer,
              private camera: Camera, 
              private eventData: EventData, 
              private imageService: FirebaseImage,
              private localStorage: LocalStorage,
              private lieuxService: LieuxService,
              private toastCtrl: ToastController) {
    this.terms = i18n.terms;
    if(this.navParams.get("userLocation").latitude != 0 && this.navParams.get("userLocation").longitude != 0)
    {
      this.userLocation.lat = Math.round(this.navParams.get("userLocation").latitude * 100000)/100000;
      this.userLocation.lng = Math.round(this.navParams.get("userLocation").longitude * 100000)/100000;
    }
    else{
      this.reloadUserLocation();
    }
  }

  private importPicture(){
    this.isChoicePictureOpened = true;
  }

  private closeChoiceOverlay() {
    this.isChoicePictureOpened = false;

  }

  private takePicture(event) {
    event.stopPropagation();
    setTimeout(()=>{
      this.isImportLoading = true;
    }, 500);
    let Camera = this.camera;
    Camera.getPicture({
      quality: 15,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: Camera.EncodingType.PNG,

      saveToPhotoAlbum: false
    }).then(imageData => {
      this.isChoicePictureOpened = false;
      this.isChoicePictureOpened = false;
      console.log(imageData);
      var blob = this.eventData.b64toBlob(imageData, 512,"image/png");
      this.imagesToUpload.push(imageData);
      this.blobsToUpload.push(blob);
      this.isImportLoading = false;
    }, error => {
      console.log("Error while "+error);
    });
  }

  private grabPicture(event) {
    event.stopPropagation();
    setTimeout(()=>{
      this.isImportLoading = true;
    }, 500);
    let Camera = this.camera;    
    Camera.getPicture({
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,

      allowEdit: false,
      encodingType: Camera.EncodingType.PNG,
      saveToPhotoAlbum: false
    }).then(imageData => {
      this.isChoicePictureOpened = false;
      this.imagesToUpload.push(imageData);
      var blob = this.eventData.b64toBlob(imageData, 512,"image/png");
      this.blobsToUpload.push(blob);
      this.isImportLoading = false;
    }, error => {
    
    });
  }
  
    private savePlace(isSended?: Boolean){
      if(this.placeToAdd.nom != null && this.placeToAdd.infos.description != null && this.placeToAdd.type != null)
      {
        this.placeToAdd.location.latitude = this.userLocation.lat;
        this.placeToAdd.location.longitude = this.userLocation.lng;
        this.placeToAdd.isValid = false;
        this.placeToAdd.isSended = isSended || false;
        this.localStorage.addPlaceToMyPlace(this.placeToAdd);
        this.successUpload(this.i18n.terms.succesSave);
      }
      else{
        this.completeForm();        
      }
    }

    private sendPlace(){
      if(this.placeToAdd.nom != null && this.placeToAdd.infos.description != null && this.placeToAdd.type != null)
      {
        this.buttonSendLoad = true;
        this.placeToAdd.location.latitude = this.userLocation.lat;
        this.placeToAdd.location.longitude = this.userLocation.lng;
        this.placeToAdd.isValid = false;
        this.placeToAdd.location.adresse = new Adresse(); 
        this.lieuxService.addLieu(this.placeToAdd);
        this.uploadBlobs(this.blobsToUpload, () => {
          this.numberOfEndedUploads++;
          console.log(this.numberOfEndedUploads+" upload finished");

          if(this.numberOfEndedUploads == this.blobsToUpload.length){
            console.log(this.numberOfEndedUploads == this.blobsToUpload.length);
            this.successUpload(this.i18n.terms.successUpload);
          }
        });
        this.savePlace(true);
      }
      else{
        this.completeForm();
      }
    }

    private completeForm(){
      let toast = this.toastCtrl.create({
        message: this.i18n.terms.completeForm,
        duration: 3000,
        position: 'bottom'
      });
    
      toast.present();
    }

  private uploadBlobs(blobs, callback: () => void){
    let i = 0;
    for(let blob of blobs){
      var inc: string;
      if(i == 0)
        inc = "";
      else
        inc = i+1+"";

      var folder = this.placeToAdd.nom;
      this.imageService.upload(folder, this.placeToAdd.nom+inc, blob, (progress, isUploadRunning, url) => {
        if(progress >= 0){
          if(url){
            callback()
          }
        }
        else{
          //error when uploading
        }
      });
      i++;
    }
    if(this.blobsToUpload.length == 0)
      this.successUpload(this.i18n.terms.successUpload);
  }

  private successUpload(msg){
    this.success = msg;

    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
  
    toast.present();
    setTimeout(()=> {
      this.navCtrl.pop();
    }, 500);
  }

  private average(array){
    var n = array.length;  
    var somme = 0;
    for(var i=0; i<n; i++)
      somme += array[i];
    return Math.round(somme/n);
  }

  private reloadUserLocation() {
    this.userLocation = {lat: "", lng: ""};
    this.geolocation.getCurrentPosition().then((position) => {
      this.userLocation = { lat: Math.round(position.coords.latitude * 100000)/100000, lng: Math.round(position.coords.longitude * 100000)/100000}
    });
  }

}
