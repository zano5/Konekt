import { ProfileService } from './../services/profile.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupService } from '../services/signup.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {


  signUpForm: FormGroup;

  profile = {


    userId: '' ,
    surname: '',
    dob: '',
    gender: '',
    occupation: '',
    imageUrl: ''
  };


  // tslint:disable-next-line:max-line-length
  constructor(private fb: FormBuilder, private signupService: SignupService, public alertController: AlertController, private route: Router, private profileService: ProfileService, private toast: ToastController ) {

    this.signUpForm =  this.fb.group({

      email: ['', Validators.email],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]




  });



  }

  ngOnInit() {

  }


  onSignUp() {




  }

  formSubmit({value, valid}: {value: Signup, valid: boolean})  {



     if (value.password === value.confirmPassword ) {




    this.signupService.signUp(value.email, value.password, this.route, this.toast, this.profile);


     } else {


             this.presentAlert();

     }
  }


  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Password',
      message: 'Password Do Not Match',
      buttons: ['OK']
    });

    await alert.present();
  }





}
