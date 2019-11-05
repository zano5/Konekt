import { AngularFireAuth } from '@angular/fire/auth';
import { PostJobService } from './../services/post-job.service';

import { Component, OnInit } from '@angular/core';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { LoadingController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-post-job-media',
  templateUrl: './post-job-media.page.html',
  styleUrls: ['./post-job-media.page.scss'],
})
export class PostJobMediaPage implements OnInit {

  pictures = [];
  imageUri;
  loading;
  details;
  data;

  job = {

    name:  '',
    description:  '',
    type: '',
    period: '',
    amount: 0,
    userUrl: '',
    created: '',
    userID: ''


};



selectedVideo: string;
uploadedVideo: string;

isUploading = false;
uploadPercent = 0;
loader;


  // tslint:disable-next-line:max-line-length
  constructor(private mediaCapture: MediaCapture, private camera: Camera, private loadingCtrl: LoadingController, private alertController: AlertController, private jobPost: PostJobService, private route: ActivatedRoute, private router: Router, private authUser: AngularFireAuth, private file: File) {

    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.data = JSON.parse(params.special);
      }
    });

  console.log(this.data);

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


  takeVideo() {

    const options: CaptureVideoOptions = { limit: 1 };
this.mediaCapture.captureVideo(options)
  .then(
    (data: MediaFile[]) => console.log(data),
    (err: CaptureError) => console.error(err)
  );

  }






  async videoAlert() {
    const alert = await this.alertController.create({
      header: 'Video',
      message: 'Choose Your Video Option',
      buttons: [
        {
          text: 'Capture',
          cssClass: 'secondary',
          handler: (blah) => {
            this.takeVideo();
          }
        }, {
          text: 'Upload',
          handler: () => {




          }
        }
      ]

    }

    );
    await alert.present();
}






submit() {
   this.job.name = this.data.name;
   this.job.description = this.data.description;
   this.job.type = this.data.type;
   this.job.period = this.data.period;
   this.job.amount = this.data.amount;
   this.job.userID = this.authUser.auth.currentUser.uid;
  this.job.created =  new Date().toISOString();



  this.jobPost.postJob(this.data, this.router);

}



  async showLoader() {

  const alert = await this.alertController.create({
    header: 'Alert',
    subHeader: 'Subtitle',
    message: 'This is an alert message.',
    buttons: ['OK']
  });

  await alert.present();


}

dismissLoader() {
  this.loader.dismiss();
}

  async presentAlert(title, message) {
  const alert = await this.alertController.create({
    header: 'Alert',
    subHeader: title,
    message: message,
    buttons: ['Dismiss']
  });

  await alert.present();


}

cancelSelection() {
  this.selectedVideo = null;
  this.uploadedVideo = null;
}

selectVideo() {
  const options: CameraOptions = {
    mediaType: this.camera.MediaType.VIDEO,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  };

  this.camera.getPicture(options)
    .then( async (videoUrl) => {
      if (videoUrl) {
        this.showLoader();
        this.uploadedVideo = null;

        const filename = videoUrl.substr(videoUrl.lastIndexOf('/') + 1);
        let dirpath = videoUrl.substr(0, videoUrl.lastIndexOf('/') + 1);

        dirpath = dirpath.includes('file://') ? dirpath : 'file://' + dirpath;

        try {
          const dirUrl = await this.file.resolveDirectoryUrl(dirpath);
          // const retrievedFile = await this.file.getFile(dirUrl, filename, {});

        } catch (err) {
          this.dismissLoader();
          return this.presentAlert('Error', 'Something went wrong.');
        }

      }
    },
    (err) => {
      console.log(err);
    });
}

uploadVideo() {


}

cancelUpload() {
  this.uploadPercent = 0;
}



async presentAlerts() {
  const alert = await this.alertController.create({
    header: 'Alert',
    subHeader: 'Subtitle',
    message: 'This is an alert message.',
    buttons: ['OK']
  });

  await alert.present();
}







}
