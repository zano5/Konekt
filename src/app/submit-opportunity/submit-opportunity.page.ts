import { AngularFireAuth } from '@angular/fire/auth';
import { PostOpportunityService } from './../services/post-opportunity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-submit-opportunity',
  templateUrl: './submit-opportunity.page.html',
  styleUrls: ['./submit-opportunity.page.scss'],
})
export class SubmitOpportunityPage implements OnInit {

opportunity = {
  name: '',
  description: '',
  amount: '',
  duration: '',
  userUrl: '',
  created: '',
  userID: ''
};

  pictures = [];
  imageUri;
  loading;
  details;
  data;
  header = 'Opportunity Post';
      message = 'Opportunity Post Successfully Posted';

  // tslint:disable-next-line:max-line-length
  constructor(private camera: Camera, private loadingCtrl: LoadingController, private route: ActivatedRoute, private postOpportunity: PostOpportunityService, private router: Router, private authUser: AngularFireAuth) {



    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.data = JSON.parse(params.special);
      }
    });
  }

  ngOnInit() {
  }



  takePicture() {

    const options: CameraOptions = {
      quality: 25,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum : false,
      cameraDirection : 0,
      targetWidth : 640,
      targetHeight : 640,
      allowEdit : true

    };

    this.camera.getPicture(options).then((imageData) => {

      this.imageUri = 'data:image/jpeg;base64,' + imageData;
      this.details =  'img' + Date.now().toString() + '.jpeg';
      this.loading = this.loadingCtrl.create({
        message: 'Optimizing image. please wait...'
      });

      this.loading.present();
      if (this.pictures.length <= 5) {
        this.pictures.push({
          name : this.details,
          uri : this.imageUri
        });
        this.loading.dismiss();
      } else {
        this.presentToast('You can only add 6 images');
        this.loading.dismiss();
      }
      console.log(this.pictures);

     }, (err) => {
      console.log(err);
      this.loading.dismiss();
     });
  }

remove(x) {
  this.pictures.splice(x, 1);
  this.presentToast('picture deleted');
}
  presentToast(message) {
  }


  submit() {



    this.opportunity.name = this.data.name;
    this.opportunity.description = this.data.description;
    this.opportunity.amount = this.data.amount;
    this.opportunity.duration = this.data.duration;
    this.opportunity.userID = this.authUser.auth.currentUser.uid;


    this.opportunity.created =  new Date().toISOString();

   console.log( this.opportunity.created);


      this.postOpportunity.postOpportunity(this.opportunity, this.router, this.header, this.message);

  }



}
