import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProfileService } from './profile.service';
import * as firebase from 'firebase'
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private afs: AngularFirestore,
    private profileService: ProfileService
  ) {


  }

  getNotifications() {

    return this.afs
    .collection('notifications')
    .doc(this.profileService.getUID())
    .collection('userNotifications',ref =>  ref.orderBy('created'))
    .snapshotChanges();
    
  }
  getNotificationsTabs() {

    return this.afs
    .collection('notifications')
    .doc(this.profileService.getUID())
    .collection('userNotifications', ref => ref.where("seen", "==", "false").orderBy('created'))
    .snapshotChanges();
  }

  deleteNotication(key) {
    return this.afs
      .collection('notifications')
      .doc(this.profileService.getUID())
      .collection('userNotifications')
      .doc(key)
      .delete();

  }
  isRead(key) {
    return this.afs
      .collection('notifications')
      .doc(this.profileService.getUID())
      .collection('userNotifications')
      .doc(key)
      .update({
        isRead: "true"
      });
  }
  markNoticationAsSeen() {
    firebase.firestore()
      .collection('notifications')
      .doc(this.profileService.getUID())
      .collection('userNotifications')
      .where("seen", "==", "false")
      .orderBy('created')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {

          const key = doc.id
          firebase.firestore()
            .collection('notifications')
            .doc(this.profileService.getUID())
            .collection('userNotifications')
            .doc(key).update({ seen: "true" })

        });
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
      });
  }

}
