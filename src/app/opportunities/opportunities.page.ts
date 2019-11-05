import { AngularFireAuth } from '@angular/fire/auth';
import { ProfileService } from './../services/profile.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostOpportunityService } from '../services/post-opportunity.service';
import * as moment from 'moment';

@Component({
  selector: 'app-opportunities',
  templateUrl: './opportunities.page.html',
  styleUrls: ['./opportunities.page.scss'],
})
export class OpportunitiesPage implements OnInit {


  user;
  profileUser;




  profileList: Profile[];


  time;

  opportunityList: Opportunity[];
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  // tslint:disable-next-line:max-line-length
  constructor(private route: Router, private opportunities: PostOpportunityService, private  profileService: ProfileService, private auth: AngularFireAuth) { }

  ngOnInit() {


    this.user = this.auth.auth.currentUser;



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

          this.profileUser =   profileInfo;

          console.log('Test', this.profileUser);

         }

      }

  }
  );




    this.opportunities.getOpportunities().subscribe(data => {

      this.opportunityList = data.map(e => {



        return{
          key:  e.payload.doc.id,
          ...e.payload.doc.data()
        } as Opportunity;
      }

      );
    });



  }


  onView() {


    this.route.navigateByUrl('op-view');

  }


  addOpportunties() {


    this.route.navigateByUrl('post-opportunity');
  }


  timeFrame(time) {

    return moment(time).fromNow();
  }

}
