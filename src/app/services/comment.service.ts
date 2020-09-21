import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  commentPost;

  constructor(
    private fireStore: AngularFirestore,
    private alert: AlertController
  ) {
  }



  postComment(comment) {
   return this.fireStore.collection("Comments").doc(comment.feedId).collection<any>('userComments').add(comment);
  }

  getComments(feedId) {
    return this.fireStore.collection("Comments").doc(feedId).collection('userComments', ref => ref.orderBy('created')).snapshotChanges();
  }


  async presentAlertSuccessful(header, message) {
    const alert = await this.alert.create({
      header: 'Successful',
      subHeader: header,
      message: message,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {



        }
      }]
    });

    await alert.present();
  }
}
