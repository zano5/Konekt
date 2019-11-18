import { ProfileService } from './../services/profile.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { PostService } from '../services/post.service';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';

import { PostImagePage } from '../post-image/post-image.page';
import { ModalController, AlertController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  data = false;
  feedList: Feed[];
  message = '';
  currentUser;

  feed = {

    message: '',
    userID: '',
    created: '',
    name: ''

  };

  user;
  profileList: Profile[];
  profileUser;

  feedListProfile: Feed[];





  // tslint:disable-next-line:max-line-length
  constructor(
    private route: Router, 
    private makePost: PostService, 
    private mediaCapture: MediaCapture, 
    private alertCtrl: AlertController, 
    private modalCtrl: ModalController, 
    private auth: AngularFireAuth, 
    private profileService: ProfileService) {

    this.currentUser = this.auth.auth.currentUser;
    this.user = this.auth.auth.currentUser;
    
  }

  ngOnInit() {
    this.makePost.getFeed().subscribe(data => {
      this.feedList = data.map(e => {
        return {
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Feed;
      });
      console.log(this.feedList);

      // tslint:disable-next-line:no-shadowed-variable
      this.profileService.getProfiles().subscribe(data => {
        this.profileList = data.map(e => {
          return {
            key: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Profile;
        });

        console.log(this.profileList);

        for (const profileInfo of this.profileList) {

          for (const feed of this.feedList) {
            if (profileInfo.userId === feed.userID) {
              feed.name = profileInfo.name;
            }
          }
        }

      });

      this.data = true;
    });

  }


  onSignOut() {
    this.route.navigateByUrl('home');
  }

  onPost() {


    this.feed.message = this.message;
    this.feed.userID = this.currentUser.uid;
    this.feed.created = new Date().toISOString();

    this.makePost.post(this.feed, this.alertCtrl);
    this.message = '';

  }


  onMedia() {

    const options: CaptureImageOptions = { limit: 5 };
    this.mediaCapture.captureImage(options)
      .then(
        (data: MediaFile[]) => console.log(data),
        (err: CaptureError) => console.error(err)
      );
  }


  async postImage() {


    this.route.navigateByUrl('post-image');


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





}
