import { Injectable } from '@angular/core';
import firebase from 'firebase';

var metadata = {
contentType: 'image/png'
};
var metadatapdf = {
contentType: 'application/pdf'
};
@Injectable()
export class EventData {
  public eventList: any;
  public RequestPictureRef: any;
  public requestList: any;
  public PictureRef: any;
  public subjectList: any;
  public userProfile: any;
  public TextbookResoursesRef:any;
  
  constructor() {
    this.RequestPictureRef = firebase.storage().ref('/requestpictures/');
    this.requestList = firebase.database().ref('/requestlist');
    this.userProfile = firebase.database().ref('/userProfile');
    this.PictureRef = firebase.storage().ref('/requestpictures/');
  }

  b64toBlob(b64Data, sliceSize,fileType) {

    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    let blob
    blob = new Blob(byteArrays, { type: fileType });
    // var url = URL.createObjectURL(blob);
    return blob;
  }

  makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

 createRequest(picturearray:any = null): any {
    return picturearray.forEach(snap => {
          this.RequestPictureRef.child("picturegallery").child(this.makeid()+".png")
          .put(snap, metadata).then((savedPicture) => {
              this.requestList.child("picturedatabase").child("picturegallery").push({
               picture: savedPicture.downloadURL
          });
      })
      })
   }
}