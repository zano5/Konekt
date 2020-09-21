import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController, NavController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import {of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  profileUser;
  user;
  profileList: Profile[];

  constructor(
    private fireStore: AngularFirestore, 
    private alert: AlertController, 
    private auth: AngularFireAuth,
    private navC:NavController
    ) {
      this.user = this.auth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.fireStore.doc(`Profile/${user.uid}`).valueChanges()
  
          } else {
            return of(null)
          }
        })
      )
      auth.auth.onAuthStateChanged((user) => {
        if (user) {
          this.navC.navigateForward("sidemenu/tabs/feed")
        }
      })

     }


  createProfile(profile, aert) {
    this.user = this.fireStore.collection<any>('Profile').doc(this.auth.auth.currentUser.uid);
    this.user.set(profile);
  }


  updateProfile(profile) {


    this.fireStore.doc<Profile>('Profile/' + profile.key).update(profile).then(() => {

      this.presentAlertSuccessful();
      this.navC.navigateForward("/sidemenu/tabs/profile")
    });

  }


  getProfiles() {
    return this.fireStore.collection('Profile').snapshotChanges();
  }

  // getFeed(userID) {
  //   return this.fireStore.collection('Feeds', ref=>ref.where('userID', '==' ,userID ).orderBy('created') ).snapshotChanges();
  // }

  getFeed(userID) {
    return this.fireStore.collection<any>('posts').doc(userID).collection('userPosts',ref=>ref.orderBy('created')).snapshotChanges();
  }

  async presentAlertSuccessful() {
    const alert = await this.alert.create({
      header: 'Profile Infomation',
      message:'Is Successful Update',
      buttons: [{
        text: 'ohk',
        handler: (blah) => {
        }
      }]
    });

    await alert.present();
  }

  getAccount(auth) {



    const user = auth.auth.currentUser;

    console.log(user);


    this.getProfiles().subscribe((data: any) => {


      this.profileList = data.map(e => {

        return {
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Profile;
      });


      console.log(this.profileList);



      for (const profileInfo of this.profileList) {


        if (this.user.uid === profileInfo.userId) {

          this.profileUser = profileInfo;

          console.log('Test', this.profileUser);

        }

      }

    });


    return this.profileUser;

  }

  updateImage(profile) {
    this.fireStore.doc<Profile>('Profile/' + profile.key).update(profile).then(() => {
      console.log('success');
    });

  }

  getUID(): string {
    return this.auth.auth.currentUser.uid;
  }
}
