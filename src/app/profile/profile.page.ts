import { AngularFireAuth } from '@angular/fire/auth';
import { ProfileService } from './../services/profile.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastController, AlertController, LoadingController, ActionSheetController, NavController } from '@ionic/angular';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import * as firebase from 'firebase';
import { File } from '@ionic-native/file/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Observable } from 'rxjs';
import { PostService } from '../services/post.service';
import * as moment from 'moment';
import { FollowService } from '../services/follow.service';
import { CommentService } from '../services/comment.service';




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

  profileUser: any;

  uploadFile = {
    name: '',
    downloadUrl: ''

  };


  myPhoto;


  fire = {
    downloadUrl: ''
  };

  public firebaseUploads = [];


  profileList: Profile[];
  uid

  prof: Profile;

  header;
  item;


  userInfo: boolean = true;


  valid = false;
  ProfileId: any;
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
    company: '',
    imageUrl: '',
    filename: '',

  };

  @ViewChild('userInput') userInputViewChild: ElementRef;

  userInputElement: HTMLInputElement;

  // selectedFile= null;
  uploadPercent: Observable<number>;
  downloadURL: any;
  uniqkey: any;
  today: any = new Date();
  dateTime = this.today.getDate() + "" + (this.today.getMonth() + 1) + "" + this.today.getFullYear() + this.today.getHours() + "" + this.today.getMinutes();
  feedList: any;
  reactionList: any;

  data = false;
  // tslint:disable-next-line:max-line-length

  slideOpts = {
    // initialSlide: 1,
    speed: 400,
  };

  isCurrentUser = true;
  isParams = false;

  feedData = false;

  following = false;
  followingCount: any;
  followersCount: any;
  constructor(
    private route: Router,
    private alertController: AlertController,
    private auth: AngularFireAuth,
    private profileService: ProfileService,
    private profilleService: ProfileService,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    private imagePicker: ImagePicker,
    private file: File,
    private photoLibrary: PhotoLibrary,
    private webview: WebView,
    private afStorage: AngularFireStorage,
    private actionsheetCtrl: ActionSheetController,
    private navC: NavController,
    private makePost: PostService,
    private commentService: CommentService,
    private Aroute: ActivatedRoute,
    private followService: FollowService
  ) {
    this.Aroute.queryParams
      .subscribe(params => {
        if (params && params.userID) {
          this.ProfileId = params.userID;
          this.isParams = Boolean(params.isParams);
        }
      });

    this.uid = this.auth.auth.currentUser;
  }

  ngOnInit() {
    if (this.isParams == true) {
      const currentUser = this.auth.auth.currentUser.uid;
      this.followService.checkIfFollowing(this.ProfileId, currentUser).then((doc: any) => {

        if (doc.exists) {
          this.following = true;
        } else {
          this.following = false;
          console.log('document not found');
        }
      })

    } else if (this.isParams == false) {
      this.ProfileId = this.uid.uid
    }

    this.followService.getUserFollowers(this.ProfileId).subscribe((data: any) => {
      this.followersCount = data.length;
    });

    this.followService.getUserFollowing(this.ProfileId).subscribe((data: any) => {
      this.followingCount = data.length;
    });

    this.profileService.getProfiles().subscribe((data: any) => {
      this.profileList = data.map(e => {
        return {
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Profile;
      });

      // console.log(this.profileList);

      for (const profileInfo of this.profileList) {

        if (this.ProfileId === profileInfo.userId) {
          this.userInfo = true;
          this.profileUser = profileInfo;
          // console.log('Test', this.profileUser);
        }

      }
    }
    );
    // console.log('email', this.user.email);
    this.profileService.getFeed(this.ProfileId).subscribe((data: any) => {
      this.feedList = data.map(e => {
        return {
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Feed;
      }).reverse();;
      // console.log(this.feedList);

      // tslint:disable-next-line:no-shadowed-variable
      this.profileService.getProfiles().subscribe((data: any) => {
        this.profileList = data.map(e => {
          return {
            key: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Profile;
        });
        // console.log(this.profileList);

        for (const profileInfo of this.profileList) {

          for (const feed of this.feedList) {
            if (profileInfo.userId === feed.userID) {
              feed.name = profileInfo.name;
              feed.userUrl = profileInfo.imageUrl;
            }
          }
        }

      });

      this.makePost.getReactions().subscribe((data: any) => {
        this.reactionList = data.map(e => {
          return {
            key: e.payload.doc.id,
            ...e.payload.doc.data()
          }
        });
        // console.log(this.reactionList)

        for (const reactionInfo of this.reactionList) {

          for (const feed of this.feedList) {
            if (reactionInfo.key === feed.key) {

              this.makePost.count(feed.key).subscribe((data: any) => {
                feed.reactionCount = this.makePost.countReactions(data)[0];
                feed.userReaction = this.makePost.userReaction(data);
              })
              this.commentService.getComments(feed.key).subscribe((data: any) => {
                feed.comment = data.length
              })
            }
          }
        }
      });
      this.feedData = true;
    });



    if (this.userInfo == false) {
      this.prof.userId = this.ProfileId;

      this.profileService.createProfile(this.prof, this.alertController);

    }
  }

  follow() {

    if (this.following == true) {
      this.following = false;
      const currentUserId = this.auth.auth.currentUser.uid;

      this.followService.unfollowUser(this.ProfileId, currentUserId)
    } else {
      this.following = true;
      const currentUserId = this.auth.auth.currentUser.uid;
      this.followService.followUser(this.ProfileId, currentUserId)
    }

  }

  ngAfterViewInit() {
    this.userInputElement = this.userInputViewChild.nativeElement;
  };
  profileEdit() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        profileUser: JSON.stringify(this.profileUser),

      }
    };
    this.navC.navigateForward(['profile-edit'], navigationExtras)
  }

  settings() {
    this.route.navigateByUrl('settings');
  }
  onPost(){
    this.navC.navigateForward('post-image')
  }
  async menu(feed) {
    let actionSheet = this.actionsheetCtrl.create({
      // header: 'Profile photo',
      cssClass: 'action-sheets-style',
      buttons: [
        {
          text: 'Edit post',
          icon: 'create',
          handler: () => {

            const navigationExtras: NavigationExtras = {
              queryParams: {
                postId: feed.key,
              }
            };
        
            this.navC.navigateForward(['/edit-post'], navigationExtras);
          }
        },
        {
          text: 'Delete post',
          icon: 'trash',
          handler: () => {
            this.deletePost(feed.key)
          }
        }
      ]
    });
    (await actionSheet).present();
  }
  async openMenuGroup() {
    let actionSheet = this.actionsheetCtrl.create({
      header: 'Profile photo',
      cssClass: 'action-sheets-style',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.pickImage()
            // console.log('camera');
          }
        },
        {
          text: 'Gallery',
          icon: 'image',
          handler: () => {
            this.userInputElement.click();
            // console.log('Gallery');
          }
        },
        {
          text: 'Remove photo',
          icon: 'trash',
          handler: () => {
            this.delete()
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    (await actionSheet).present();
  }

  async loadImageFromDevice1(event) {
    // console.log(event.target.files)

    const file = event.target.files[0];
    this.uniqkey = 'PIC' + this.dateTime;
    const filePath = 'images/' + this.uniqkey;
    const fileRef = this.afStorage.ref(filePath);
    const task = this.afStorage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();

    const loading = await this.loadingCtrl.create({
      message: 'Uploading, Please wait...',
      spinner: "crescent",
    });

    await loading.present();

    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL().subscribe(async url => {
          // console.log(url);
          this.profileUser.imageUrl = url;
          this.profileUser.filename = this.uniqkey
          // console.log('profile', this.profileUser.key);

          // console.log('downloadurl', url);
          // console.log('profile', this.profileUser);

          await loading.dismiss()

          this.profileService.updateImage(this.profileUser);
        });
      })
    ).subscribe();
  }

  async deletePost(key) {
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'Are use you want to delete this post',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'yes',
          handler: data => {
            this.makePost.deletePost(this.ProfileId, key)
          }
        }
      ]
    });

    await alert.present();

  }

  delete() {
    const storageRef = this.afStorage.storage.ref().child('images/' + this.profileUser.filename);
    storageRef.delete().then(() => {
      this.profileUser.imageUrl = '';
      this.profileUser.filename = ''
      this.profileService.updateImage(this.profileUser)
    }).catch(function (error) {
      // Uh-oh, an error occurred!
      console.log("Uh-oh, an error occurred!")
    });

  }

  timeFrameProfle(time) {
    return moment(time).format('MMMM YYYY');
  }

  timeFrame(time) {
    return moment(time).fromNow();
  }

  comment(feed) {

    const navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(feed)
      }
    };

    this.route.navigate(['comment'], navigationExtras);


  }


  react(key, val) {
    const userID = this.auth.auth.currentUser.uid;
    if (val != 0) {
      this.makePost.updateReaction(key, userID, 0)
    } else {
      this.makePost.removeReaction(key, userID)
    }
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


              if (type === 'Gender') {

                profile.gender = data.name1;
                // this.update(profile);

                console.log(profile);

                this.message = 'Successfully Updated Gender';

                this.update(profile);

              } else if (type === 'Dob') {

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

              } else if (type === 'Occupation') {


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
      this.item = 'DD-MM-YYYY';


      this.type = 'Dob';

      this.presentAlertPrompt(this.header, this.item, this.profileUser, this.type);


    } else if (option === 'name') {

      this.header = 'Name';
      this.item = 'Zanoxolo';

      this.type = 'Name';

      this.presentAlertPrompt(this.header, this.item, this.profileUser, this.type);

      this.update(this.profileUser);
    } else if (option === 'surname') {

      this.header = 'Surname';
      this.item = 'Mngadi';

      this.type = 'Surname';

      this.presentAlertPrompt(this.header, this.item, this.profileUser, this.type);

    } else if (option === 'occupation') {

      this.header = 'Occupation';
      this.type = 'Occupation';


      this.presentAlertPrompt(this.header, this.item, this.profileUser, this.type);

    } else if (option === 'company') {


      this.header = 'Company';
      this.type = 'Company';

    }

  }

  update(profile) {
    this.profileService.updateProfile(profile);
  }



  async pickImage() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true
    };

    try {
      const cameraInfo = await this.camera.getPicture(options);
      const blobInfo = await this.makeFileIntoBlob(cameraInfo);
      const uploadInfo: any = await this.uploadToFirebase(blobInfo);

    } catch (e) {
      // console.log(e.message);

    }
  }

  // FILE STUFF
  makeFileIntoBlob(_imagePath) {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      let fileName = '';
      this.file
        .resolveLocalFilesystemUrl(_imagePath)
        .then(fileEntry => {
          const { name, nativeURL } = fileEntry;

          // get the path..
          const path = nativeURL.substring(0, nativeURL.lastIndexOf('/'));
          // console.log('path', path);
          // console.log('fileName', name);

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
          // console.log(imgBlob.type, imgBlob.size);
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
    // console.log('uploadToFirebase');
    return new Promise(async (resolve, reject) => {
      const fileRef = this.afStorage.ref('images/' + _imageBlobInfo.fileName);
      const uploadTask = fileRef.put(_imageBlobInfo.imgBlob);
      let filename = _imageBlobInfo.fileName
      uploadTask.percentageChanges();
      const loading = await this.loadingCtrl.create({
        message: 'Uploading, Please wait...',
        spinner: "crescent",
      });
      await loading.present();
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {

            this.profileUser.filename = filename
            this.profileUser.imageUrl = url;
            // console.log('profile', this.profileUser.key);
            // console.log('downloadurl', url);


            // console.log('profile', this.profileUser);

            this.profileService.updateImage(this.profileUser);

            loading.dismiss();
          });
        })
      ).subscribe();

    });
  }




}
