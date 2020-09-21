import { AngularFireAuth } from '@angular/fire/auth';
import { PostJobService } from './../services/post-job.service';

import { Component, OnInit } from '@angular/core';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
declare var window: any;
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
    name: '',
    description: '',
    type: '',
    period: '',
    amount: 0,
    userUrl: '',
    created: '',
    userID: '',
    pictures: [],
    vidUrl: '',
    notificationType:"jobs"
  };



  selectedVideo: string;
  uploadedVideo: string;

  isUploading = false;
  uploadPercent = 0;
  loader;

  filename;
  size;
  fileext;
  task;
  // tslint:disable-next-line:max-line-length
  constructor(
    private mediaCapture: MediaCapture,
    private camera: Camera,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private jobPost: PostJobService,
    private route: ActivatedRoute,
    private router: Router,
    private authUser: AngularFireAuth,
    private file: File,
    private storage: AngularFireStorage,
    public toastController: ToastController

  ) {

    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.data = JSON.parse(params.special);
      }
    });

    console.log(this.data);

  }

  ngOnInit() {
  }


  async takePicture() {

    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.ALLMEDIA,
      saveToPhotoAlbum: false,
      // correctOrientation: true,
      cameraDirection: 0,
      targetWidth: 640,
      targetHeight: 640,

    };

    try {
      const cameraInfo = await this.camera.getPicture(options);
      if (this.pictures.length <= 5) {
        const blobInfo = await this.makeFileIntoBlob(cameraInfo);
        const uploadInfo: any = await this.uploadToFirebase(blobInfo);

        alert('File Upload Success ' + uploadInfo.fileName);
      } else {
        this.presentToast('You can only add 6 images');
      }

    } catch (e) {
      console.log(e.message);
      alert('File Upload Error ' + e.message);
    }
  }
  makeFileIntoBlob(_imagePath) {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file

    return new Promise((resolve, reject) => {
      console.log("hello")
      let fileName = '';
      this.file
        .resolveLocalFilesystemUrl(_imagePath)
        .then(fileEntry => {
          const { name, nativeURL } = fileEntry;

          // get the path..
          const path = nativeURL.substring(0, nativeURL.lastIndexOf('/'));
          console.log('path', path);
          console.log('fileName', name);

          fileName = name;

          // we are provided the name, so now read the file into
          // a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          const imgBlob = new Blob([buffer], {
            type: 'image/jpeg'
          });
          console.log(imgBlob.type, imgBlob.size);
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => reject(e));
    });
  }

  uploadToFirebase(_imageBlobInfo) {
    console.log('uploadToFirebase');
    return new Promise(async (resolve, reject) => {
      const fileRef = this.storage.ref('images/' + _imageBlobInfo.fileName);
      const uploadTask = fileRef.put(_imageBlobInfo.imgBlob);

      uploadTask.percentageChanges();
      const loading = await this.loadingCtrl.create({
        duration: 2000,
        spinner: 'crescent',
      });
      await loading.present();
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.pictures.push({
              name: _imageBlobInfo.fileName,
              url: url
            });
            console.log("pic" + this.pictures)
            console.log(url);

            this.uploadPercent = null;
            loading.dismiss();
          });
        })
      ).subscribe();

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

 
  async selectVideoV() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.VIDEO
    };
    try {
      const cameraInfo = await this.camera.getPicture(options);
      const blobInfo = await this.makeFileIntoBlobV(cameraInfo);
      const uploadInfo: any = await this.uploadToFirebaseV(blobInfo);

      alert('File Upload Success ' + uploadInfo.fileName);
    } catch (e) {
      console.log(e.message);
      alert('File Upload Error ' + e.message);
    }

  }

  // FILE STUFF
  makeFileIntoBlobV(_videoPath) {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      let fileName = '';
      this.file
        .resolveLocalFilesystemUrl('file:///'+_videoPath)
        .then(fileEntry => {
          const { name, nativeURL } = fileEntry;

          // get the path..
          const path = nativeURL.substring(0, nativeURL.lastIndexOf('/'));
          console.log('path', path);
          console.log('fileName', name);

          fileName = name;

          // we are provided the name, so now read the file into
          // a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          const imgBlob = new Blob([buffer], {
            type: 'video/mp4'
          });
          console.log(imgBlob.type, imgBlob.size);
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => reject(e));
    });
  }

  /**
  *
  
  */
 uploadToFirebaseV(_imageBlobInfo) {
  console.log('uploadToFirebase');
  return new Promise(async (resolve, reject) => {
    const fileRef = this.storage.ref('Video/' + Math.random().toString(36).substring(2) + _imageBlobInfo.fileName );
    const uploadTask = fileRef.put(_imageBlobInfo.imgBlob);

    uploadTask.percentageChanges();
    const loading = await this.loadingCtrl.create({  
      spinner: 'crescent',
    });
    await loading.present();
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(urlfile => {
          this.job.vidUrl = urlfile
          this.selectedVideo = urlfile
          console.log(urlfile);

          this.uploadPercent = null;
          loading.dismiss();
        });
      })
    ).subscribe();

  });
}
  

  submit() {
    this.job.name = this.data.name;
    this.job.description = this.data.description;
    this.job.type = this.data.type;
    this.job.period = this.data.period;
    this.job.amount = this.data.amount;
    this.job.userID = this.authUser.auth.currentUser.uid;
    this.job.pictures = this.pictures;
    this.job.created = new Date().toISOString();

    console.log("job " + this.job)
    console.log("job " + JSON.stringify(this.job))
    this.jobPost.postJob(this.job, this.router);

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
