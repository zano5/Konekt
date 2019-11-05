import { PostService } from './../services/post.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController, LoadingController, IonicModule } from '@ionic/angular';
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


const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPE = 'video/mp4';


@Component({
  selector: 'app-post-image',
  templateUrl: './post-image.page.html',
  styleUrls: ['./post-image.page.scss'],
})
export class PostImagePage implements OnInit {


  pictures = [];
  options: any;
  videoUrl =  '';
selectedVideo: string;
uploadedVideo: string;

isUploading = false;

loader;

mediaFiles = [];
dirpath;




 // tslint:disable-next-line:max-line-length
 constructor(private route: Router, private alertController: AlertController,  private auth: AngularFireAuth, private profileService: ProfileService, private profilleService: ProfileService, private camera: Camera, public loadingCtrl: LoadingController, private f: File, private photoLibrary: PhotoLibrary, private imagePicker: ImagePicker, private file: File, private webview: WebView, private post: PostService,
   private afStorage: AngularFireStorage) {






}

  ngOnInit() {
  }


  remove(x) {
    this.pictures.splice(x, 1);
    this.presentToast('picture deleted');
  }
    presentToast(message) {
    }



    getImage() {

      this.options = {
        // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
        // selection of a single image, the plugin will return it.
        maximumImagesCount: 5,

        // max width and height to allow the images to be.  Will keep aspect
        // ratio no matter what.  So if both are 800, the returned image
        // will be at most 800 pixels wide and 800 pixels tall.  If the width is
        // 800 and height 0 the image will be 800 pixels wide if the source
        // is at least that wide.
        width: 200,

        // quality of resized image, defaults to 100
        quality: 25,
        outputType: 1
      };

      this.imagePicker.getPictures(this.options).then((results) => {
        for ( let i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
            this.pictures.push('data:image/jpeg;base64,' + results[i]);
        }
      }, (err) => {

        alert(err);

      });

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

          console.log('VideoUrl', videoUrl);
          if (videoUrl) {
            this.uploadedVideo = null;
            const filename = videoUrl.substr(videoUrl.lastIndexOf('/') + 1);
             this.dirpath = videoUrl.substr(0, videoUrl.lastIndexOf('/') + 1);

            this.dirpath = this.dirpath.includes('file://') ? this.dirpath : 'file://' + this.dirpath;

            try {
              const dirUrl = await this.file.resolveDirectoryUrl(this.dirpath);
              const retrievedFile = await this.file.getFile(dirUrl, filename, {});

              retrievedFile.file( data => {

                if (data.size > MAX_FILE_SIZE) { return this.presentAlert('Error', 'You cannot upload more than 5mb.'); }
                if (data.type !== ALLOWED_MIME_TYPE) { return this.presentAlert('Error', 'Incorrect file type.'); }
                  this.selectedVideo = this.webview.convertFileSrc(retrievedFile.nativeURL);
                  console.log('selected video', this.selectedVideo);

                  this.mediaFiles.push(this.selectedVideo);

                  console.log(this.mediaFiles);
            });

            } catch (err) {
              this.dismissLoader();
              return this.presentAlerts('Error', 'Something went wrong.');
            }

          }
        },
        (err) => {
          console.log(err);
        });
    }

    async uploadVideo() {




       const blobInfo = await this.makeFileIntoBlob(this.dirpath);
       const uploadInfo: any  = await this.uploadToFirebase(blobInfo);




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


    // FILE STUFF
makeFileIntoBlob(_videoPath) {
  // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
  return new Promise((resolve, reject) => {
    let fileName = '';
    this.f
      .resolveLocalFilesystemUrl(_videoPath)
      .then(fileEntry => {
        const { name, nativeURL } = fileEntry;

        // get the path..
        const path = nativeURL.substring(0, nativeURL.lastIndexOf('/'));
        console.log('path', path);
        console.log('fileName', name);

        fileName = name;

        // we are provided the name, so now read the file into
        // a buffer
        return this.f.readAsArrayBuffer(path, name);
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
uploadToFirebase(_imageBlobInfo) {
  console.log('uploadToFirebase');
  return new Promise((resolve, reject) => {
    const fileRef = firebase.storage().ref('videos/' + _imageBlobInfo.fileName);






    const uploadTask = fileRef.put(_imageBlobInfo.imgBlob);

    uploadTask.on(
      'state_changed',
      (_snapshot: any) => {

        console.log(
          'snapshot progess ' +
            (_snapshot.bytesTransferred / _snapshot.totalBytes) * 100
        );

        const progress = (_snapshot.bytesTransferred / _snapshot.totalBytes) * 100;


        if (progress === 100) {


          fileRef.getDownloadURL().then(uri => {


             // console.log('profile', this.profileUser.key);
           console.log('downloadurl',  uri);





          });


        }
      },
      _error => {
        console.log(_error);
        reject(_error);
      },
      () => {
        // completion...
        resolve(uploadTask.snapshot);
      }
    );
  });
}



uploadToStorage(information): AngularFireUploadTask {
  const newName = `${new Date().getTime()}.mp4`;

  return this.afStorage.ref(`vidoes/${newName}`).putString(information);
}




  }
