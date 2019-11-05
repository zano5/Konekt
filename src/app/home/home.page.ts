import { Platform } from '@ionic/angular';
import { ProfileService } from './../services/profile.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  loginForm: FormGroup;
  data = true;



  // tslint:disable-next-line:max-line-length
  constructor(private route: Router, private fb: FormBuilder, private loginService:  LoginService, private facebook: Facebook, private  afAuth: AngularFireAuth, private googlePlus: GooglePlus, private platform: Platform) {



    this.loginForm =  this.fb.group({

      email: ['', Validators.compose([
        Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$') ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6)])]




  });




  }


  formSubmit({value, valid}: {value: Login, valid: boolean})  {



   this.loginService.signIn(value.email, value.password, this.route);


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





}
