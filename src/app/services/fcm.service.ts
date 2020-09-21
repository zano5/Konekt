import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
// import { FCM } from '@ionic-native/fcm/ngx';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    public afs: AngularFirestore,
    private platform: Platform,
    // private fcm: FCM,
    private auth: AngularFireAuth
  ) { }

  // Get permission from the user
  // async getTokendevice() {
  //   let token;

  //   // if (this.platform.is('android')) {
  //   //   token = await this.firebaseNative.getToken()
  //   // } 

  //   // if (this.platform.is('ios')) {
  //   //   token = await this.firebaseNative.getToken();
  //   //   await this.firebaseNative.grantPermission();
  //   // } 
  //   this.fcm.getToken().then(tokens => {
  //     console.log("service token " + token)
  //     token = tokens
  //   })


  //   this.saveTokenToFirestore(token)
  // }

  // // Save the token to firestore
  // saveTokenToFirestore(token) {
  //   console.log("service token " + token)
  //   if (!token) return;

  //   const devicesRef = this.afs.collection('devices')

  //   const docData = {
  //     token,
  //     sender: this.auth.auth.currentUser.uid,
  //     receiveNotifications:'true'
  //   }

  //   return devicesRef.doc(token).set(docData)
  // }
}
