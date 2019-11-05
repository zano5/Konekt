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
    this.commentPost = this.fireStore.collection<any>('Comments');


    this.commentPost.add(comment);


   }




  getComments() {

    return this.fireStore.collection('Comments').snapshotChanges();

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
