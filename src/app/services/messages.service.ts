import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  commentPost;

  constructor(private fireStore: AngularFirestore,  private alert: AlertController) {




   }



   postMessage(comment) {

    this.commentPost=this.fireStore.collection("Feeds").doc(comment.feedId).collection<any>('Comments');
    // this.commentPost = this.fireStore.collection<any>('Comments');


    this.commentPost.add(comment);


   }

  getComments(feedId) {

    return this.fireStore.collection("Feeds").doc(feedId).collection('Comments', ref=>ref.orderBy('created')).snapshotChanges();

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




}
