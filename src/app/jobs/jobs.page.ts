import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PostJobService } from '../services/post-job.service';
import * as moment from 'moment';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss'],
})
export class JobsPage implements OnInit {


  user;
  profileUser;




  profileList: Profile[];



  jobsList: Job[];
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  // tslint:disable-next-line:max-line-length
  constructor(private jobs: PostJobService, private profileService: ProfileService, private auth: AngularFireAuth, private route: Router) { }

  ngOnInit() {


    this.user = this.auth.auth.currentUser;

    console.log('email', this.user.email);

    this.profileService.getProfiles().subscribe(data => {
      this.profileList = data.map(e => {

        return {
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Profile;
      });

      console.log(this.profileList);


      for (const profileInfo of this.profileList) {


        if (this.user.uid === profileInfo.userId) {

          this.profileUser = profileInfo;

          console.log('Test', this.profileUser);

        }

      }

    }
    );

    this.jobs.getJob().subscribe(data => {


      this.jobsList = data.map(e => {

        return {
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Job;
      });
    });
  }



  timeFrame(time) {

    return moment(time).fromNow();
  }




}
