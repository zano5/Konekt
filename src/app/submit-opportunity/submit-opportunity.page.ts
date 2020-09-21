import { AngularFireAuth } from '@angular/fire/auth';
import { PostOpportunityService } from './../services/post-opportunity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { File } from '@ionic-native/file/ngx';
import { AngularFireStorage } from 'angularfire2/storage';
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
    userID: '',
    pictures: [],
    notificationType:"opportunities"
  };


  pictures = [];
  imageUri;
  loading;
  uploadPercent = 0;
  details;
  data;
  header = 'Opportunity Post';
  message = 'Opportunity Post Successfully Posted';

  // tslint:disable-next-line:max-line-length
  constructor(
    private camera: Camera,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private postOpportunity: PostOpportunityService,
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


  submit() {

    this.opportunity.name = this.data.name;
    this.opportunity.description = this.data.description;
    this.opportunity.amount = this.data.amount;
    this.opportunity.duration = this.data.duration;
    this.opportunity.userID = this.authUser.auth.currentUser.uid;
    this.opportunity.pictures = this.pictures;
    this.opportunity.created = new Date().toISOString();

    console.log(this.opportunity.created);
    this.postOpportunity.postOpportunity(this.opportunity, this.router, this.header, this.message);

  }



}
