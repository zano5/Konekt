import { AngularFireAuth } from '@angular/fire/auth';
import { ProfileService } from './../services/profile.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import * as firebase from 'firebase';
import { File } from '@ionic-native/file/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';




@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {


  public uploads = [];

  media = '';

  imageURI;
  proceed;

  loader;


  image = '';
  progress: any;
  url: string;

  profileUser;

  uploadFile = {
    name: '',
    downloadUrl: ''

  };


  myPhoto;




// files = {
//   picture: '',
//   audio: '',
//   video: '',
//   media: ''

// };


fire = {
  downloadUrl: ''
};

public firebaseUploads = [];


  profileList: Profile[];


  prof: Profile;

  header;
  item;


  userInfo = false;


  valid = false;
  user;
  type;
  subheader;
  message;







  profileClass = {
    userId: '',
    name: '',
    surname: '',
    dob: '',
    gender: '',
    occupation: '',
    imageUrl: '',
  };



  // tslint:disable-next-line:max-line-length
  constructor(private route: Router,  private alertController: AlertController, private auth: AngularFireAuth, private profileService: ProfileService, private profilleService: ProfileService, private camera: Camera, public loadingCtrl: LoadingController, private f: File, private photoLibrary: PhotoLibrary, private webview: WebView,  private afStorage: AngularFireStorage) {






   }

  ngOnInit() {



   this.user = this.auth.auth.currentUser;

   console.log('email', this.user.email);

   this.profileService.getProfiles().subscribe(data => {


    this.profileList = data.map ( e => {

      return{
        key: e.payload.doc.id,
        ...e.payload.doc.data()
      } as Profile;
    });


    console.log(this.profileList);



      for (const profileInfo of this.profileList) {


        if (this.user.uid === profileInfo.userId) {


          this.userInfo = true;

          this.profileUser =   profileInfo;


          console.log('Test', this.profileUser);

         }

      }

  }
  );






  if (this.userInfo === false) {


    this.prof.userId = this.user.uid;

    this.profileService.createProfile(this.prof, this.alertController);


  }





}


  settings() {

    this.route.navigateByUrl('settings');

  }





  async presentAlertPrompt(header, item, profile, type) {
    const alert = await this.alertController.create({
      header: header,
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: item
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: data => {
            if (typeof data != null) {


              if (type === 'Gender')  {

                profile.gender = data.name1;
                // this.update(profile);

                console.log(profile);

                this.message = 'Successfully Updated Gender';

                this.update(profile);

              } else if ( type === 'Dob') {

                profile.dob = data.name1;

                console.log(profile);

                this.message = 'Successfully Updated Date Of Birth';

                this.update(profile);

              } else if (type === 'Name') {

                profile.name = data.name1;



                this.message = 'Successfully Updated Name';

                console.log(profile);
                this.update(profile);

              } else if (type === 'Surname') {

                profile.surname = data.name1;



                this.message = 'Successfully Updated Surname';

                console.log(profile);

                this.update(profile);

              } else if  (type === 'Occupation') {


                this.message = 'Successfully Updated Occupation';

                console.log(profile);

                this.update(profile);


              } else if (type === 'Company') {


                this.message = 'Successfully Updated Company';

                console.log(profile);

                this.update(profile);


              }


            }
        }
        }
      ]
    });

    await alert.present();
  }


  profile(option) {

    if (option === 'gender') {

      this.header = 'Gender';
      this.item = 'Male';

      this.type = 'Gender';



      console.log(this.profileUser);

     this.presentAlertPrompt(this.header, this.item, this.profileUser, this.type);



    } else if (option === 'dob') {

      this.header = 'Date Of Birth';
      this.item =  'DD-MM-YYYY';


      this.type = 'Dob';

      this.presentAlertPrompt(this.header, this.item, this.profileUser, this.type);


    } else if (option === 'name') {

      this.header = 'Name';
      this.item =  'Zanoxolo';

      this.type = 'Name';

      this.presentAlertPrompt(this.header, this.item, this.profileUser, this.type);

      this.update(this.profileUser);
    } else if (option === 'surname') {

      this.header = 'Surname';
      this.item =  'Mngadi';

      this.type = 'Surname';

      this.presentAlertPrompt(this.header, this.item, this.profileUser, this.type);

    } else if (option === 'occupation')  {

      this.header = 'Occupation';
      this.type =  'Occupation';


      this.presentAlertPrompt(this.header, this.item, this.profileUser, this.type);

    } else if (option === 'company') {


      this.header = 'Company';
      this.type =  'Company';

    }

  }

  update(profile) {



    this.profileService.updateProfile(profile, this.header, this.message);



  }



async pickImage() {
  const options: CameraOptions = {
    quality: 80,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  try {
    const cameraInfo = await this.camera.getPicture(options);
    const blobInfo = await this.makeFileIntoBlob(cameraInfo);
    const uploadInfo: any = await this.uploadToFirebase(blobInfo);

    alert('File Upload Success ' + uploadInfo.fileName);
  } catch (e) {
    console.log(e.message);
    alert('File Upload Error ' + e.message);
  }
}

// FILE STUFF
makeFileIntoBlob(_imagePath) {
  // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
  return new Promise((resolve, reject) => {
    let fileName = '';
    this.f
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
    const fileRef = firebase.storage().ref('images/' + _imageBlobInfo.fileName);






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

            this.profileUser.imageUrl = uri;
             // console.log('profile', this.profileUser.key);
           console.log('downloadurl',  uri);


           console.log('profile', this.profileUser);

         this.profileService.updateImage(this.profileUser);


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




}
