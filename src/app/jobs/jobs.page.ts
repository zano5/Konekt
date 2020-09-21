import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PostJobService } from '../services/post-job.service';
import * as moment from 'moment';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProfileService } from '../services/profile.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss'],
})
export class JobsPage implements OnInit {


  user;
  profileUser;


  profileList: Profile[];
  
  jobsList: any;
  jobsListLoad;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  // tslint:disable-next-line:max-line-length
  constructor(
    private jobs: PostJobService, 
    private profileService: ProfileService, 
    private auth: AngularFireAuth, 
    private route: Router,
    private navC: NavController
    ) { 

    }

  ngOnInit() {


    this.user = this.auth.auth.currentUser;

    console.log('email', this.user.email);

    this.jobs.getJob().subscribe((data:any) => {

      this.jobsList = data.map(e => {
        return {
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Job;
      }).reverse();

      this.jobsListLoad = data.map(e => {
        return {
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Job;
      }).reverse();

      this.profileService.getProfiles().subscribe((data:any) => {
        this.profileList = data.map(e => {
  
          return {
            key: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Profile;
        });
  
        console.log(this.profileList);
  
  
        for (const profileInfo of this.profileList) {
  
  
          for (const job of this.jobsList) {
            if (profileInfo.userId === job.userID) {
              console.log(profileInfo.name)
              job.username = profileInfo.name;
              job.userUrl = profileInfo.imageUrl;
            }
          }
  
          for (const job of this.jobsListLoad) {
            if (profileInfo.userId === job.userID) {
              console.log(profileInfo.name)
              job.username = profileInfo.name;
              job.userUrl = profileInfo.imageUrl;
            }
          }
        }
  
      });
    });
  
  }

  initializeItems(): void {
    this.jobsList = this.jobsListLoad;
  }

  filterList(evt) {
    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.jobsList = this.jobsListLoad.filter(currentOpp => {
      if ((currentOpp.description && searchTerm) || (currentOpp.name && searchTerm)) {
        if ((currentOpp.description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) || (currentOpp.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)) {
          return true;
        }
        return false;
      }
    });

  }

  viewProfile(feed){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        isParams: true,
        userID: feed.userID
      }
    };

    this.navC.navigateForward(['/profile'], navigationExtras);
  }
  timeFrame(time) {
    return moment(time).fromNow();
  }




}
