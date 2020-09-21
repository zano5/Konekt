import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import * as _ from "lodash";
import * as firebase from 'firebase';
import { ProfileService } from './profile.service';
import { NavController } from '@ionic/angular';
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
    private auth: AngularFireAuth,
    private profileService: ProfileService,
    private navC: NavController
  ) {

    this.currentuser = this.auth.auth.currentUser

  }


  post(feed, alert) {
    const currentUserId = this.auth.auth.currentUser.uid;
    this.writePost = this.fireStore.collection<any>('posts').doc(currentUserId).collection('userPosts');
    this.writePost.add(feed).then((res: any) => {

      //Add post to current user's timeline
      this.fireStore
        .collection<any>('timeline')
        .doc(currentUserId)
        .collection('timelinePosts')
        .doc(res.id)
        .set(feed)

      //create current user reaction collection
      this.fireStore
        .collection('reactions')
        .doc(res.id)
        .set({})

      //create current user Comments collection
      this.fireStore
        .collection("Comments")
        .doc(res.id)
        .collection('userComments')
        // .add({})

      console.log(res.id)
      this.alert(alert);
    });

  }
  getPostToEdit(postId) {
    const currentUserId = this.auth.auth.currentUser.uid;
    return this.fireStore.collection('posts').doc(currentUserId).collection('userPosts').doc(postId).valueChanges();
  }

  updatePost(post, postId) {
    return this.fireStore.collection('posts').doc(post.userID).collection('userPosts').doc(postId).update(post);
  }

  deletePost(currentUserId, postId) {
    return this.fireStore.collection('posts').doc(currentUserId).collection('userPosts').doc(postId).delete();
  }
  deleteImageOnly(imageName) {
    return this.afStorage.storage.ref().child('images/' + imageName).delete()
  }
  deleteImage(post, postId, imageName) {
    this.afStorage.storage.ref()
      .child('images/' + imageName)
      .delete().then(() => {
        firebase.firestore().collection('posts').doc(post.userID).collection('userPosts').doc(postId).update(post).then(() => {
          console.log(" File deleted successfully")
        })
      }).catch(function (error) {
        // Uh-oh, an error occurred!
        console.log("Uh-oh, an error occurred!")
      });
  }
  getFeed(currentUserId) {
    return this.fireStore.collection<any>('timeline').doc(currentUserId).collection('timelinePosts', ref => ref.orderBy('created')).snapshotChanges();
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

  delete() {
    const path = 'reactions/me/re'
    firebase.firestore().collection(path).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          firebase.firestore().collection('reactions').doc("me").collection("re").doc(doc.id).delete().then(() => {
            firebase.firestore().collection('reactions').doc("me").delete();
          })
        });
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
      });
  }

  removeReaction(feedId, userid) {
    const data = { [userid]: firebase.firestore.FieldValue.delete() }
    return this.fireStore.collection('reactions').doc(feedId).update(data);
  }

  userReaction(reactions: Array<any>) {
    const userID = this.auth.auth.currentUser.uid;
    return _.get(reactions, userID)
  }
  async alert(alertInfo) {


    const alert = await alertInfo.create({
      header: 'Post',
      message: 'Has Been Successful Posted',
      buttons: [{
        text: 'ohk',
        role: 'ohk',
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
