import { PostService } from './../services/post.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController, LoadingController, IonicModule, ToastController } from '@ionic/angular';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { ProfileService } from '../services/profile.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import * as firebase from 'firebase';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';


const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPE = 'video/mp4';
@Component({
  selector: 'app-post-image',
  templateUrl: './post-image.page.html',
  styleUrls: ['./post-image.page.scss'],
})
export class PostImagePage implements OnInit {

  feed = {

    message: '',
    userID: '',
    created: '',
    name: '',
    pictures: [],
    vidUrl: '',
    notificationType: "feed"
  };

  pictures = [];
  options: any;
  videoUrl = '';
  selectedVideo: string;
  uploadedVideo: string;

  isUploading = false;

  loader;

  mediaFiles = [];
  dirpath;
  uploadPercent = 0

  message = '';

  // tslint:disable-next-line:max-line-length

  currentUser

  filename;
  size;
  fileext;
  task;
  constructor(
    private route: Router,
    private alertController: AlertController,
    private auth: AngularFireAuth,
    private profileService: ProfileService,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    private imagePicker: ImagePicker,
    private file: File,
    private storage: AngularFireStorage,
    private makePost: PostService,
    private toastController: ToastController,
    private webview: WebView,) {
    this.currentUser = this.auth.auth.currentUser;
  }

  ngOnInit() {
  }


  remove(x, thumb) {
    this.pictures.splice(x, 1);
    this.makePost.deleteImageOnly(thumb.name).then(() => {
      this.presentToast('picture deleted');
    }).catch(function (error) {
      console.log("Uh-oh, an error occurred!")
    });
   
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }



  getImage() {

    this.imagePicker.hasReadPermission().then(
      (result) => {
        if (result == false) {
          // no callbacks required as this opens a popup which returns async
          this.imagePicker.requestReadPermission();
        }
        else if (result == true) {
          this.imagePicker.getPictures({
            maximumImagesCount: 5
          }).then(
            (results) => {
              for (var i = 0; i < results.length; i++) {

                this.makeFileIntoBlob(results[i])

              }
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });

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
          const image = resolve({
            fileName,
            imgBlob
          });

          this.uploadToFirebase(fileName, imgBlob)
        })
        .catch(e => reject(e));
    });
  }

  uploadToFirebase(fileName, imgBlob) {
    console.log('uploadToFirebase');

    return new Promise(async (resolve, reject) => {
      const fileRef = this.storage.ref('images/' + fileName);
      const uploadTask = fileRef.put(imgBlob);

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
              name: fileName,
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
        .resolveLocalFilesystemUrl('file:///' + _videoPath)
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

      const fileRef = this.storage.ref('Video/' + Math.random().toString(36).substring(2) + _imageBlobInfo.fileName);
      const uploadTask = fileRef.put(_imageBlobInfo.imgBlob);

      uploadTask.percentageChanges();
      const loading = await this.loadingCtrl.create({

        spinner: 'crescent',
      });
      await loading.present();
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(urlfile => {
            this.feed.vidUrl = urlfile
            this.selectedVideo = urlfile
            console.log(urlfile);

            this.uploadPercent = null;
            loading.dismiss();
          });
        })
      ).subscribe();

    });
  }

  onPost() {

    this.feed.message = this.message;
    this.feed.userID = this.currentUser.uid;
    this.feed.created = new Date().toISOString();
    this.feed.pictures = this.pictures;
    this.makePost.post(this.feed, this.alertController);
    this.message = '';
    this.feed.vidUrl = '';
    this.selectedVideo = ''
    this.pictures = [];

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



  async uploadVideo() {
  }

  cancelUpload() {

  }

  async presentAlerts(subTitle, message) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: subTitle,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }








  uploadToStorage(information): AngularFireUploadTask {
    const newName = `${new Date().getTime()}.mp4`;

    return this.storage.ref(`vidoes/${newName}`).putString(information);
  }




}
