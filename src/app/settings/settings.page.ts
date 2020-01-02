import { PostOpportunityService } from './../services/post-opportunity.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { PostJobService } from './../services/post-job.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  settings =  'job';
  jobsList: Job[];
  opportunityList: Opportunity[];



  // tslint:disable-next-line:max-line-length
  constructor(
    private route: Router, 
    private jobs: PostJobService, 
    private opportunities: PostOpportunityService
    ) {

   }

  ngOnInit() {

    this.jobs.getJobUser().subscribe((data:any) => {

      this.jobsList = data.map ( e => {
        return{
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Job;
      }).reverse();

    });



    this.opportunities.getOpportunitiesUser().subscribe((data:any) => {

      this.opportunityList = data.map(e => {
        return{
          key:  e.payload.doc.id,
          ...e.payload.doc.data()
        } as Opportunity;
      }).reverse();

    });

  }


  addJob() {

    this.route.navigateByUrl('post-jobs');
  }


  addOpportunity() {

    this.route.navigateByUrl('post-opportunity');
  }

addOption() {

  if (this.settings === 'job')  {

    this.addJob();

  } else {

     this.addOpportunity();
  }

}



viewJob(job) {


  const navigationExtras: NavigationExtras = {
    queryParams: {
      special: JSON.stringify(job)
    }
  };

  this.route.navigate(['detail-job'], navigationExtras);

}

viewOpportunity(opportunity) {

  const navigationExtras: NavigationExtras = {
    queryParams: {
      special: JSON.stringify(opportunity)
    }
  };

  this.route.navigate(['detail-opportunity'], navigationExtras);

}


deleteJob(job) {

  this.jobs.presentDelete(job);
}


deleteOpportunity(opportunity) {

  this.opportunities.presentDelete(opportunity);
}



editJob(job) {

  const navigationExtras: NavigationExtras = {
    queryParams: {
      special: JSON.stringify(job)
    }
  };



  this.route.navigate(['edit-job'], navigationExtras);
}

editOpportunity(opportunity) {

  const navigationExtras: NavigationExtras = {
    queryParams: {
      special: JSON.stringify(opportunity)
    }
  };


  this.route.navigate(['edit-opportunity'], navigationExtras);

}



}
