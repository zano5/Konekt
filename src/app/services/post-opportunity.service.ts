import { OpportunitiesPage } from './../opportunities/opportunities.page';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PostOpportunityService {

  jobPost;

  constructor(private fireStore: AngularFirestore, private alert: AlertController) {


   }

   postOpportunity(opportunity, router, header, message ) {
    this.jobPost = this.fireStore.collection<any>('Opportunities');


    this.jobPost.add(opportunity).then(() => {



      this.presentAlertSuccess(router, header, message);

    });


   }


   async presentAlertSuccess(router, header , message) {
    const alert = await this.alert.create({
      header: 'Successful',
      subHeader: header,
      message: message,
      buttons: [ {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {

          if ( header === 'Opportunity Post') {

          router.navigate(['settings']);
        }


        } }]
    });

    await alert.present();
  }



  getOpportunities() {

   return this.fireStore.collection('Opportunities').snapshotChanges();

  }


  updateOpportunity(opportunity, header, message) {

    this.fireStore.doc<Opportunity>('Opportunities/' + opportunity.key).update(opportunity).then(() => {

      this.presentAlertSuccessful(header, message);

    });

  }

  deleteOpportunity(opportunity)  {

    this.fireStore.doc<Job>('Opportunities/' + opportunity.key).delete();
  }



  async presentAlertSuccessful(header , message) {
    const alert = await this.alert.create({
      header: 'Successful',
      subHeader: header,
      message: message,
      buttons: [ {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {



        } }]
    });

    await alert.present();
  }


  async presentDelete(opportunity) {
    const alert = await this.alert.create({
      header: 'Delete',
      message:   'Do you want to delete job? ' ,
      buttons: [ {
        text: 'Yes',
        role: 'okay',
        cssClass: 'secondary',
        handler: (blah) => {

          this.deleteOpportunity(opportunity);

        }
         },
         {
          text: 'No',
          role: 'cancel',
          cssClass: 'danger',
          handler: (blah) => {

            alert.dismiss();
          }}]
    });

    await alert.present();
  }




}
