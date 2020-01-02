import { MessagesService } from './../services/messages.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { AngularFireAuth } from '@angular/fire/auth';
import * as moment from 'moment';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage implements OnInit {

  data;
  commentForm: FormGroup;

  profileUser;
  profileList = [];
  message = '';

  commentList: any;
  feedCommentList;

  comments = {

    message: '',
    feedId: '',
    userID: '',
    username: '',
    created:''
  };


  user;

  // tslint:disable-next-line:max-line-length
  constructor(
    private route: ActivatedRoute, 
    private fb: FormBuilder, 
    private profileService: ProfileService, 
    private auth: AngularFireAuth, 
    private commentService: MessagesService
    ) {


    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.data = JSON.parse(params.special);
      }
    });


    console.log(this.data.key);


    this.user = this.auth.auth.currentUser;

    console.log('email', this.user.email);

    this.profileService.getProfiles().subscribe((data:any) => {


      this.profileList = data.map(e => {

        return {
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Profile;
      });

      console.log(this.profileList);

      //  for (const profileInfo of this.profileList) {

      //    if (this.user.uid === profileInfo.userId) {

      //      this.profileUser =   profileInfo;

      //      console.log('Test', this.profileUser);

      //     }

      //  }





    });


    this.commentService.getComments(this.data.key).subscribe((data:any) => {


      this.commentList = data.map(e => {

        return {
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Comments;
      });







      for (const info of this.commentList) {




        if (this.data.key === info.feedId) {




          for (const profileInfo of this.profileList) {


            if (info.userID === profileInfo.userId) {
              this.profileUser = profileInfo;


              info.username = profileInfo.name + ' ' + profileInfo.surname;
              this.commentList.username=profileInfo.name + ' ' + profileInfo.surname;



              console.log('Test', this.profileUser);

            }

          }






        }
      }

    });
    this.feedCommentList=[]
  }

  ngOnInit() {
  }

  formSubmit({ value, valid }: { value: Comments, valid: boolean }) {
    // this.commentService.postMessage(this.comments);
  }



  addComment() {
    if (this.message != '') {
      this.comments.message = this.message;
      this.comments.userID = this.user.uid;
      this.comments.feedId = this.data.key;
      this.comments.created=moment().format(),
      console.log(this.comments.feedId);

      this.commentService.postMessage(this.comments);
    }
    this.message = "";
  }

  timeFrame(time) {

    // return moment(time).calendar("HH:mm");
    var otherDates = moment(time).fromNow();
    var calback= function () {
       return '['+otherDates+']';
    }
    return moment(time).calendar(null,{
       sameDay: 'HH:mm',
       nextDay:calback,
       nextWeek: calback,
       lastDay: "[Yesterday]",
       lastWeek: calback,
       sameElse: 'DD/MM/YYYY'
   });
  }
}
