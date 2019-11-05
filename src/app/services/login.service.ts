import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { ProfileService } from './profile.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private authFirebase: AngularFireAuth, public toastController: ToastController ) { }



  signIn(email, password, route) {


    this.authFirebase.auth.signInWithEmailAndPassword(email, password).then( () => {



          route.navigateByUrl('sidemenu/tabs/feed');
          this.presentToast();
    }).catch((err) => {

        console.log(err.message);

    });
  }

  signOut(route) {

    this.authFirebase.auth.signOut().then(() => {

      route.navigateByUrl('home');

    });

  }


  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Welcome To Konekt!',
      duration: 2000
    });
    toast.present();
  }
}
