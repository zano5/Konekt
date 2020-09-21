import { Platform, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ProfileService } from './../services/profile.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFirestore } from 'angularfire2/firestore';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
 
  // tslint:disable-next-line:max-line-length
  constructor(
    private route: Router,
    private fb: FormBuilder,
    private loginService: LoginService,
    private facebook: Facebook,
    private afAuth: AngularFireAuth,
    private googlePlus: GooglePlus,
    private platform: Platform,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    private afs: AngularFirestore
  ) {

  }


  loginForm = new FormGroup({
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.email,
      Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")
    ])),
    password: new FormControl('', Validators.compose([
      Validators.required,
      // Validators.minLength(6), 
      // Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z0-9\d$@$!%*?&].{5,}")
    ])),

  });

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required!' },
      { type: 'pattern', message: 'Invalid Email!' },
    ],
    'password': [
      { type: 'required', message: 'Password is required!' },
      // { type: 'minlength', message: 'Password should contain atleast 6 characters!' },
      // { type: 'pattern', message: 'Password should contain characters, numbers, lowercase and uppercase letters!' },
    ],

  };
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  async formSubmit() {


    if (this.loginForm.valid) {

      const loading = this.loadingCtrl.create({
        message: 'Signing in, Please wait...',
        // showBackdrop: false,
        cssClass: 'custom-loader',
        spinner: "crescent",
      });

      (await loading).present();

      this.loginService.signIn(this.loginForm.value.email, this.loginForm.value.password).then(async () => {
        this.afs.firestore.enableNetwork();
        (await loading).dismiss();
        this.presentToast();
        localStorage.setItem("Konektuser", this.loginForm.value.email);
        this.route.navigateByUrl('sidemenu/tabs/feed');

      }).catch(async (err) => {

        (await loading).dismiss();
        console.log(err.message);
        this.alert(err)
      });


    } else {
      this.validateAllFormFields(this.loginForm);
    }
  }



  onSignUp() {


    this.route.navigateByUrl('sign-up');


  }

  signInWithFacebook() {
    this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(res => {



        this.route.navigateByUrl('sidemenu/feed');

      });
  }


  signInWithGoogle() {

    if (this.platform.is('cordova')) {

      this.nativeGoogleLogin();

    } else {

      this.webGoogleLogin();
    }

  }


  async nativeGoogleLogin() {

    try {

      const gplusUser = await this.googlePlus.login({
        'webClientId:': '15860602087-s19i2r9bre86hvkvu0ptkmjebqk0uq0d.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      });


      return await this.afAuth.auth.signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)
      );
    } catch (err) {

      console.log(err);

    }

  }

  async webGoogleLogin() {

    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
    } catch (err) {

      console.log(err);
    }
  }



  alert(err) {

    this.alertCtrl.create({
      message: err.message,
      buttons: ['Ok'],
      cssClass: 'custom-alert',
    }).then(
      alert => alert.present()
    );
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Welcome To Konekt!',
      duration: 2000
    });
    toast.present();
  }
}
