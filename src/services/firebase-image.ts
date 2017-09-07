import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { environment } from '../environments/environment';
 
declare var firebase;


@Injectable()
export class FirebaseImage {
    private imageUrl: string;
    private folder: string = "images";
    private storage: any;
    constructor(private db: AngularFireDatabase) {   
        firebase.initializeApp(environment.firebase);    
        this.storage = firebase.storage();        
    }

    public getImageUrl(imageName: string, callback: (url: string)=> void){
        const storageRef = this.db.app.storage().ref().child('path/'+imageName+'.png');
        storageRef.getDownloadURL().then(url => callback(url));
    }

    public upload(name: string, blob: any, callback: (progress: number, isRunning: Boolean) => void) {  
        var storageRef = firebase.storage().ref();    
        console.log(storageRef);
        var uploadTask = storageRef.child('images/'+name+'/'+name+'.jpg').put(blob);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                callback(progress, false);
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                callback(progress, true);
                break;
            }
        }, function(error) {
            callback(-1, false);
            switch (error.code) {
                case 'storage/unauthorized':
                console.log("User doesn't have permission to access the object");
                break;
            
                case 'storage/canceled':
                console.log("User canceled the upload");
                break;
            
                case 'storage/unknown':
                console.log("Unknown error occurred, inspect error.serverResponse");
                break;
        }
        }, function() {
            var downloadURL = uploadTask.snapshot.downloadURL;
            console.log("Upload completed successfully, now we can get the download URL\n"+downloadURL);
        });
    }
}