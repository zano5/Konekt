import { AlertController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFireAuth } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class PostJobService {

 jobPost;

  constructor(
    private fireStore: AngularFirestore, 
    private alert: AlertController, 
    private afStorage: AngularFireStorage,
    private auth: AngularFireAuth
    ) {

   }

   postJob(job, router) {
    this.jobPost = this.fireStore.collection<any>('Jobs');

    this.jobPost.add(job).then(() => {
      this.presentAlertSuccess(router);
    });


   }


   async presentAlertSuccess(router) {
    const alert = await this.alert.create({
      header: 'Successful',
      subHeader: 'Job Post',
      message: 'Job Post Successfully Posted',
      buttons: [ {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {

          router.navigate(['settings']);
        } }]
    });

    await alert.present();
  }



  getJob() {

   return this.fireStore.collection('Jobs' ,ref=>ref.orderBy('created')).snapshotChanges();

  }
  getJobUser(){
    const userID =this.auth.auth.currentUser.uid;
    return this.fireStore.collection('Jobs', ref=>ref.where('userID', '==' ,userID ).orderBy('created')).snapshotChanges();
  }

  updateJob(job , header, message) {

    this.fireStore.doc<Job>('Jobs/' + job.key).update(job).then(() => {

      this.presentAlertSuccessful(header, message);
    });

  }


  deleteJob(job)  {

    this.fireStore.doc<Job>('Jobs/' + job.key).delete();
  }


  async presentAlertSuccessful(header, message) {
    const alert = await this.alert.create({
      header: 'Successful',
      subHeader: header,
      message: message ,
      buttons: [ {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {


        } }]
    });

    await alert.present();
  }


  async presentDelete(job) {
    const alert = await this.alert.create({
      header: 'Delete',
      message:   'Do you want to delete job? ' ,
      buttons: [ {
        text: 'Yes',
        role: 'okay',
        cssClass: 'secondary',
        handler: (blah) => {

          this.deleteJob(job);

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

  uploadToStorage(information): AngularFireUploadTask {
    const newName = `${new Date().getTime()}.txt`;

    return this.afStorage.ref(`files/${newName}`).putString(information);
  }








}
