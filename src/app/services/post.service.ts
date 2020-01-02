import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import * as _ from "lodash";
import * as firebase from 'firebase';
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
  currentuser


  constructor(
    private fireStore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private auth: AngularFireAuth) {
    this.currentuser = this.auth.auth.currentUser

  }


  post(feed, alert) {

    this.writePost = this.fireStore.collection<any>('Feeds');


    this.writePost.add(feed).then(() => {

      this.alert(alert);


    });

  }


  getFeed() {

    return this.fireStore.collection('Feeds', ref=>ref.orderBy('created')).snapshotChanges();

  }

  getReactions() {
    return this.fireStore.collection('reactions').snapshotChanges();
  }

  updateReaction(feedId, userid, reaction = 0) {
    const data = { [userid]: reaction }
    this.fireStore.collection('reactions').doc(feedId).update(data).then((data) => {

    }).catch(() => {
      this.fireStore.collection('reactions').doc(feedId).set(data)
    })
  }


  countReactions(reactions) {
    return _.mapValues(_.groupBy(reactions), 'length')
  }
  count(feedId) {
    return this.fireStore.collection('reactions').doc(feedId).valueChanges()
  }

 delete(){
  const path= 'reactions/me/re'
  firebase.firestore().collection(path).get()
    .then(querySnapshot => {
        querySnapshot.forEach(doc=> {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            firebase.firestore().collection('reactions').doc("me").collection("re").doc(doc.id).delete().then(()=>{
              firebase.firestore().collection('reactions').doc("me").delete();
            })
        });
    })
    .catch(error=> {
        console.log("Error getting documents: ", error);
    });
 }

  removeReaction(feedId, userid) {
    const data = { [userid]: firebase.firestore.FieldValue.delete() }
    return this.fireStore.collection('reactions').doc(feedId).update(data);
  }

  userReaction(reactions: Array<any>) {
    const userID =this.auth.auth.currentUser.uid;
    return _.get(reactions, userID)
  }
  async alert(alertInfo) {


    const alert = await alertInfo.create({
      header: 'Successful',
      subHeader: 'Feed',
      message: 'Feed Has Been Posted',
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


  uploadToStorage(information): AngularFireUploadTask {
    const newName = `${new Date().getTime()}.mp4`;

    return this.afStorage.ref(`files/${newName}`).putString(information);
  }



}
