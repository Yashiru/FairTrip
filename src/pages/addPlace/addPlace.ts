import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { I18n } from '../../services/i18n/i18n';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { EventData } from '../../services/event-data';
import { FirebaseImage } from '../../services/firebase-image';
import { Lieux } from '../../models/lieux';

@Component({
  selector: 'add-place',
  templateUrl: 'addPlace.html'
})
export class AddPlace {
  private terms;
  private userLocation: any = {
    lat: "",
    lng: ""
  };
  private blobsToUpload = [];
  private b64Images = [];
  private isChoicePictureOpened: Boolean = false;
  private uploadProgress: number = 0;
  private placeToAdd: Lieux = new Lieux();


  constructor(public navCtrl: NavController, private i18n: I18n, private geolocation: Geolocation, private transfer: Transfer,private camera: Camera, private eventData: EventData, private imageService: FirebaseImage) {
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
      this.blobsToUpload.push(blob);
    }, error => {
      console.log("Error while "+error);
    });
  }

  private grabPicture(event) {
    event.stopPropagation();
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
      var blob = this.eventData.b64toBlob(imageData, 512,"image/png");
      this.blobsToUpload.push(blob);
      
    }, error => {
    
    });
  }
  
    private savePlace(){
      this.placeToAdd.location.latitude = this.userLocation.lat;
      this.placeToAdd.location.longitude = this.userLocation.lng;
      this.placeToAdd.isValid = false;
    }

    private sendPlace(){
      this.uploadBlobs(this.blobsToUpload);
    }

  private uploadBlobs(blobs){
    var i = 1;
    for(let blob of blobs){
      this.imageService.upload(this.placeToAdd.nom+i, blob, (progress, isUploadRunning) => {
        if(progress >= 0){
          this.uploadProgress = progress / blobs.length * i;
        }
        else{
          //error when uploading
        }
      });
    }
  }

}
