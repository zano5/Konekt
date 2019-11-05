import { ProfileService } from './profile.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SignupService {





  constructor(private firebaseAuth: AngularFireAuth, public toastController: ToastController, private profileService: ProfileService) {




  }


  signUp(email, password, route, alert, profile) {


    this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password).then(data => {




      profile.userId = data.user.uid;


      this.profileService.createProfile(profile, alert);

      this. presentToast();

      route.navigateByUrl('home');

    });





  }


  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Profile Successfully Created',
      duration: 2000
    });
    toast.present();
  }









}
