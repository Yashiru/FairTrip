import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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

@Component({
  selector: 'add-place',
  templateUrl: 'addPlace.html'
})
export class AddPlace {
  private terms = {};
  private userLocation: any = {
    lat: "",
    lng: ""
  };
  private blobsToUpload = [];
  private b64Images = [];
  private isChoicePictureOpened: Boolean = false;
  private showSuccessMessage: Boolean = false;
  private buttonSendLoad: Boolean = false;
  private isImportLoading: Boolean = false;
  private numberOfEndedUploads: number = 0;
  private uploadProgress: number = 0;
  private placeToAdd: Lieux = new Lieux();
  private imagesToUpload: string[] = [];


  constructor(public navCtrl: NavController, 
              private i18n: I18n, 
              private geolocation: Geolocation, 
              private transfer: Transfer,
              private camera: Camera, 
              private eventData: EventData, 
              private imageService: FirebaseImage,
              private localStorage: LocalStorage,
              private lieuxService: LieuxService) {
    this.terms = i18n.terms;
    this.geolocation.getCurrentPosition().then((position) => {
      this.userLocation = { lat: Math.round(position.coords.latitude * 100000)/100000, lng: Math.round(position.coords.longitude * 100000)/100000}
    });
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
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: Camera.EncodingType.PNG,

      saveToPhotoAlbum: false
    }).then(imageData => {
      this.isChoicePictureOpened = false;
      this.isChoicePictureOpened = false;
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
  
    private savePlace(){
      if(this.placeToAdd.nom != null && this.placeToAdd.infos.description != null && this.placeToAdd.type != null)
      {
        this.placeToAdd.location.latitude = this.userLocation.lat;
        this.placeToAdd.location.longitude = this.userLocation.lng;
        this.placeToAdd.isValid = false;
        this.placeToAdd.isSended = false;
        this.localStorage.addPlaceToMyPlace(this.placeToAdd);
      }
    }

    private sendPlace(){
      this.buttonSendLoad = true;
      if(this.placeToAdd.nom != null && this.placeToAdd.infos.description != null && this.placeToAdd.type != null)
      {
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
            this.successUpload();
          }
        });
      }
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
  }

  private successUpload(){
    this.showSuccessMessage = true;
    setTimeout(()=> {
      this.showSuccessMessage = false;
      this.buttonSendLoad = false;
    }, 1400);
    setTimeout(()=> {
      this.navCtrl.pop();
    }, 1500);
  }

  private average(array){
    var n = array.length;  
    var somme = 0;
    for(var i=0; i<n; i++)
      somme += array[i];
    return Math.round(somme/n);
  }

}
