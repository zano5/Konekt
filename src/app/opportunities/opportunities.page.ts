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

  opportunityList: any;
  opportunityLoad
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  // tslint:disable-next-line:max-line-length
  constructor(private route: Router, private opportunities: PostOpportunityService, private profileService: ProfileService, private auth: AngularFireAuth) { }

  ngOnInit() {


    this.user = this.auth.auth.currentUser;

    this.opportunities.getOpportunities().subscribe((data: any) => {

      this.opportunityList = data.map(e => {
        return {
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        };

      }).reverse();

      this.opportunityLoad = data.map(e => {
        return {
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        };

      }).reverse();
      
      this.profileService.getProfiles().subscribe((data: any) => {
        this.profileList = data.map(e => {

          return {
            key: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Profile;
        });


        console.log(this.profileList);

        for (const profileInfo of this.profileList) {


          for (const opportunity of this.opportunityList) {
            if (profileInfo.userId === opportunity.userID) {
              console.log(profileInfo.name)
              opportunity.username = profileInfo.name;
              opportunity.userUrl = profileInfo.imageUrl;
            }
          }

        }

        for (const profileInfo of this.profileList) {


          for (const opportunity of this.opportunityLoad) {
            if (profileInfo.userId === opportunity.userID) {
              console.log(profileInfo.name)
              opportunity.username = profileInfo.name;
              opportunity.userUrl = profileInfo.imageUrl;
            }
          }

        }
      });

    });
  }

  initializeItems(): void {
    this.opportunityList = this.opportunityLoad;
  }

  filterList(evt) {
    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.opportunityList = this.opportunityList.filter(currentOpp => {
      if ((currentOpp.description && searchTerm) || (currentOpp.name && searchTerm)) {
        if ((currentOpp.description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) || (currentOpp.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)) {
          return true;
        }
        return false;
      }
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
