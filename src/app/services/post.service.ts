import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask  } from 'angularfire2/storage';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  item = {

  name: '',
  price: 0,
  type: ''

 };






  writePost;



  constructor(private fireStore: AngularFirestore, private afStorage: AngularFireStorage) {


  }


  post(feed, alert) {

    this.writePost = this.fireStore.collection<any>('Feeds');


    this.writePost.add(feed).then(() => {

      this.alert(alert);


    });

  }


  getFeed() {

    return this.fireStore.collection('Feeds').snapshotChanges();

  }



  async alert(alertInfo) {


     const alert =  await alertInfo.create({
      header: 'Successful',
      subHeader: 'Feed',
      message: 'Feed Has Been Posted',
      buttons: [ {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {


        } }]
    });

    await alert.present();

  }


  uploadToStorage(information): AngularFireUploadTask {
    const newName = `${new Date().getTime()}.mp4`;

    return this.afStorage.ref(`files/${newName}`).putString(information);
  }



}
