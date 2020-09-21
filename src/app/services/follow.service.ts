import { Injectable } from '@angular/core';
import * as firebase from 'firebase'
import { AngularFirestore } from 'angularfire2/firestore';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(
    private afs: AngularFirestore
  ) { }


  checkIfFollowing(userId, currentUserId) {
    return firebase.firestore()
      .collection('followers')
      .doc(userId)
      .collection("userFollowers")
      .doc(currentUserId)
      .get()
  }

  followUser(ProfileId, currentUserId) {
    // make auth user follower of another user (and update their followers colloction)
    firebase.firestore()
      .collection('followers')
      .doc(ProfileId)
      .collection("userFollowers")
      .doc(currentUserId)
      .set({
        userId: currentUserId
      })

    // put That user on your following collection (update your following  collection)
    firebase.firestore()
      .collection('following')
      .doc(currentUserId)
      .collection("userFollowing")
      .doc(ProfileId)
      .set({
        userId: ProfileId
      })
    //add activity feed item  for users to notify about new followers
  }

  unfollowUser(ProfileId, currentUserId) {
    // remove follower
    firebase.firestore()
      .collection('followers')
      .doc(ProfileId)
      .collection("userFollowers")
      .doc(currentUserId)
      .get().then((doc) => {
        if (doc.exists) {
          doc.ref.delete()
        }
      })

    // remove following
    firebase.firestore()
      .collection('following')
      .doc(currentUserId)
      .collection("userFollowing")
      .doc(ProfileId)
      .get().then((doc) => {
        if (doc.exists) {
          doc.ref.delete()
        }
      })
    //add activity feed item  for users to notify about new followers
  }

  getUserFollowers(userId) {
    return this.afs.collection('followers').doc(userId).collection('userFollowers').snapshotChanges();
  }

  getUserFollowing(userId) {
    return this.afs.collection('following').doc(userId).collection('userFollowing').snapshotChanges();
  }

  getUserFollowersAndFollowing(uid) {
    return combineLatest(
      this.afs.collection('followers').doc(uid).collection('userFollowers').snapshotChanges(),
      this.afs.collection('following').doc(uid).collection('userFollowing').snapshotChanges(),
    ).pipe(
      map(arr => arr.reduce((acc, cur) => acc.concat(cur)))
    )
  }
  searchFriends(name) {
    return this.afs.collection('Profile', ref => ref.where('name', '>=', name)).snapshotChanges();
  }
}
