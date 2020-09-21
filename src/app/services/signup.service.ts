import { ProfileService } from './profile.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SignupService {





  constructor(
    private firebaseAuth: AngularFireAuth, 
    public toastController: ToastController, 
    private profileService: ProfileService) {
  }


  async signUp(email, password) {
    return await this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
  }


  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Profile Successfully Created',
      duration: 2000
    });
    toast.present();
  }









}
