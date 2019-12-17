import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  profileUser;
  user;
  profileList: Profile[];

  constructor(private fireStore: AngularFirestore, private alert: AlertController, private auth: AngularFireAuth) { }



  createProfile(profile, aert) {




    this.user = this.fireStore.collection<any>('Profile').doc(this.auth.auth.currentUser.uid);


    this.user.set(profile);



  }


  updateProfile(profile, header, message) {


    this.fireStore.doc<Profile>('Profile/' + profile.key).update(profile).then(() => {

      this.presentAlertSuccessful(header, message);

    });

  }


  getProfiles() {


    return this.fireStore.collection('Profile').snapshotChanges();
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

}
