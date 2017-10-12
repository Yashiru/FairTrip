import { Component, EventEmitter } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { Lieux } from '../../models/lieux';
import { SvgIcons } from '../../models/svgIcons';
import { FirebaseImage } from '../../services/firebase-image';
import { I18n } from '../../services/i18n/i18n';
import { CallNumber } from '@ionic-native/call-number';
import { LocalStorage } from '../../services/local-storage';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LaunchNavigator, LaunchNavigatorOptions } from 'ionic-native';
import { Avis } from '../../models/avis';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AddAdvice } from '../../components/add-advice/add-advice';
import { ReportService } from '../../services/report-service';

@Component({
  selector: 'page-place-details',
  templateUrl: 'placeDetails.html'
})
export class PlaceDetailsPage {
  private placeSelected: Lieux;
  private svg: SvgIcons = new SvgIcons();
  private svgIcon;
  private terms: any;
  private imagesUrl: string[] = [];
  private showImageLoader: Boolean = true;
  private showErrorMsg: Boolean = false;
  private isLikedPlace: Boolean = false;
  private starString: string[];
  private shareInfos: any = {
    message: "",
    subject: "", 
    file: "", 
    url: ""
  };
  private formReport: any = {
    IdPlaceReported: "",
    EmailContact: "",
    reportMessage: ""
  };
  private images: string[] = [];
  private note: number = 0;
  private globalAdvice: Avis = new Avis();
  private noImageFoundUrl: String = "";
  private areMultipleImages: Boolean = false;
  private showReportPopup: Boolean = false;;
  private emailColor: string = "#555";
  private messageColor: string = "#555";

  constructor(private callNumber: CallNumber, 
              public navCtrl: NavController, 
              private navParams: NavParams, 
              private imageService: FirebaseImage, 
              private i18n: I18n,
              private ls: LocalStorage, 
              private tc: ToastController,
              private social: SocialSharing, 
              private iab: InAppBrowser,
              private modalCtrl: ModalController,
              private reportService: ReportService) {
    console.log(this.imagesUrl.length);
    this.terms = i18n.terms;
    this.placeSelected = this.navParams.get("selectedPlace");
    this.formReport.IdPlaceReported = this.placeSelected.key;
    this.note = this.placeSelected.getAverageNote();
    this.globalAdvice.setStarsString(this.note);
    this.starString = this.globalAdvice.stars;
    for(let advice of this.placeSelected.avis){
      advice.setStarsString(advice.note);
    }
    
    var lang = this.i18n.lang;
    this.noImageFoundUrl = "assets/images/noImageFound/"+lang+"/add"+this.placeSelected.type.toLowerCase()+".png";
    this.setIsLikedPlace();
    this.initShareInfo();
    this.getImage();
    switch(this.placeSelected.type.toLowerCase()){
      case "restaurant":
        this.svgIcon = this.svg.icons.restaurant;
        break;

      case "experience":
        this.svgIcon = this.svg.icons.experience;
        break;

      case "hotel":
        this.svgIcon = this.svg.icons.hotel;
        break;

      case "ngo":
        this.svgIcon = this.svg.icons.ngo;
        break;
    }
  }

  private addAdvice(){
    var place: Lieux = this.placeSelected;
    const profileModal = this.modalCtrl.create(AddAdvice, { place: place });
    profileModal.present();
  }

  private initShareInfo(){
    this.shareInfos.message = this.placeSelected.nom + "\n" + this.placeSelected.location.adresse.details;
    this.shareInfos.subject = "FairTrip place";
    this.shareInfos.file = "";
    this.shareInfos.url = this.placeSelected.infos.website || "www.FairTrip.org/";
  }

  private navigate(){
    let options: LaunchNavigatorOptions = {
      start: ""
    };

    LaunchNavigator.navigate(this.placeSelected.location.adresse.details, options)
        .then(
            success => alert('Launched navigator'),
            error => alert('Error launching navigator: ' + error)
    );
  }

  private share(){
    this.social.share(this.shareInfos.message, this.shareInfos.subject, this.shareInfos.file, this.shareInfos.url);
  }

  private likePlace(){
    this.isLikedPlace = !this.isLikedPlace;
    var msg = "";

    if(this.isLikedPlace == true){
      msg = this.i18n.terms.addLike;
    }
    else{
      msg = this.i18n.terms.rmLike;
    }

    let toast = this.tc.create({
      message: msg,
      duration: 1000,
      position: 'top'
    });
    
    toast.present();
  
    this.ls.toggleLike(this.placeSelected);
  }

  private setIsLikedPlace(){
    this.ls.isLiked(this.placeSelected, (isLiked) => {
      this.isLikedPlace = isLiked;
    });
  }

  private getImage(){
    let name: string;
    for(var index = 0; index <= 5; index ++){
      if(index > 0){
        name = this.placeSelected.nom+index;
      }
      else{
        name = this.placeSelected.nom;
      }
      var folder = this.placeSelected.nom;
      this.imageService.getImageUrl(folder, name, (url) => {
        if(url != ""){
          this.imagesUrl.push("url("+url+")");
          this.images.push(url);
        }
        this.showImageLoader = false;
        if(this.imagesUrl.length > 1){
          this.areMultipleImages = true;
          console.log(true);
        }
      });
    }
  }

  private reportProblem(){
    this.showReportPopup = true;

    this.emailColor = "#555";
    this.messageColor = "#555";
    
    this.formReport = {
      IdPlaceReported: this.placeSelected.key,
      EmailContact: "",
      reportMessage: ""
    };
  }

  private backNav(){
    this.navCtrl.pop();
  }

  ionViewDidLoad(){
    document.getElementById("svg-icon").innerHTML = this.svgIcon;
  }

  private call(){
    this.callNumber.callNumber(this.placeSelected.infos.tel, true)
    .then(() => console.log('Launched dialer!'))
    .catch(() => console.log('Error launching dialer'));
  }

  private contact(){
    this.social.shareViaEmail('', '', [this.placeSelected.infos.mail]).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }

  private webSite(){
    var website = this.iab.create(this.placeSelected.infos.website);      
    website.show();
  }

  private closeReportForm(){
    this.showReportPopup = false;
  }

  private reportFormClick(e){
    e.stopPropagation();
  }

  private sendReport(){
    let toastSended = this.tc.create({
      message: this.terms.reportSended,
      duration: 1000,
      position: 'top'
    });

    let toastEmail = this.tc.create({
      message: this.terms.emailWrong,
      duration: 1000,
      position: 'top'
    });

    let toastMessage = this.tc.create({
      message: this.terms.noMessage,
      duration: 1000,
      position: 'top'
    });

    console.log(this.validateEmail(this.formReport.EmailContact))
    if(this.validateEmail(this.formReport.EmailContact) && this.formReport.reportMessage.length > 0){
      this.reportService.sendReport(this.formReport);

    
      toastSended.present();
      this.closeReportForm();
    }
      else{
        if(!this.validateEmail(this.formReport.EmailContact)){
          toastEmail.present();
        }
        if(this.formReport.reportMessage.length == 0){
          toastMessage.present();
          
        }
    }
  }

  private validateEmail(email) {
    console.log(email)
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  }
}
