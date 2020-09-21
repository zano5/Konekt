import { ProfileService } from './../services/profile.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SignupService } from '../services/signup.service';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {


  // signUpForm: FormGroup;

  profile = {
    userId: '',
    surname: '',
    dob: '',
    gender: '',
    occupation: '',
    imageUrl: '',
    name: '',
    created: '',
  };


  // tslint:disable-next-line:max-line-length
  constructor(
    private fb: FormBuilder,
    private signupService: SignupService,
    public alertController: AlertController,
    private route: Router,
    private profileService: ProfileService,
    private toast: ToastController,
    public loadingCtrl: LoadingController,
  ) {
    //   this.signUpForm =  this.fb.group({
    //     email: ['', Validators.email],
    //     password: ['', Validators.required],
    //     confirmPassword: ['', Validators.required]
    // });
  }

  signUpForm = new FormGroup({
    name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern("^[A-Za-z ]*$"), Validators.maxLength(30)])),
    email: new FormControl('', Validators.compose([Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")])),
    password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
    cpassword: new FormControl('', Validators.required)
  }, {
    validators: this.passwordMatcher.bind(this)
  });


  passwordMatcher(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password')
    const { value: cpassword } = formGroup.get('cpassword')
    const matchingControl = formGroup.controls['cpassword'];
    if (matchingControl.errors && !matchingControl.errors.passwordMatcher) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    return password === cpassword ? null : matchingControl.setErrors({ passwordMatcher: true })
  }
  validation_messages = {
    'name': [
      { type: 'required', message: 'Name is required!' },
      { type: 'pattern', message: 'Name should contain letters only!' },
      { type: 'minlength', message: 'Name should contain atleast 3 letters!' },
      { type: 'maxlength', message: 'Name should contain  30 letters!' },
    ],
    'surname': [
      { type: 'required', message: 'Surname is required!' },
      { type: 'pattern', message: 'Surname should contain letters only!' },
      { type: 'minlength', message: 'Surname should contain atleast 3 letters!' },
    ],
    'email': [
      { type: 'required', message: 'Email is required!' },
      { type: 'pattern', message: 'Invalid Email!' },
    ],
    'password': [
      { type: 'required', message: 'Password is required!' },
      { type: 'minlength', message: 'Password should contain atleast 6 characters!' },
      // { type: 'pattern', message: 'Password should contain characters, numbers, lowercase and uppercase letters!' },
    ],
    'cpassword': [
      { type: 'required', message: 'Confirm password is required!' },
      { type: 'passwordMatcher', message: 'passwords dont match!' },
    ]
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


  ngOnInit() {

  }

  onSignUp() {
  }

  async formSubmit() {
  
    if (this.signUpForm.valid) {
      const loading = this.loadingCtrl.create({
        message: 'Signing up, Please wait...',
        // showBackdrop: false,
        cssClass: 'custom-loader',
        spinner: "crescent",
      });

      (await loading).present();
      this.profile.name = this.signUpForm.value.name;
      this.profile.created =  moment().format()
      this.signupService.signUp(this.signUpForm.value.email, this.signUpForm.value.password).then(async data => {

        (await loading).dismiss();
        // this.presentToast();
        // localStorage.setItem("Konektuser", this.signUpForm.value.email);
        this.route.navigateByUrl('home');
        this.profile.userId = data.user.uid;

        this.profileService.createProfile(this.profile, alert);
    
      }).catch(async (err) => {

        (await loading).dismiss();
        console.log(err.message);
        this.alert(err)
      });
      // this.authService.signup(this.registerdetails, this.user.value.password).then(()=>{
      //   this.spinner = false
      // }).catch(err=>{
      //   this.spinner = false
      //   this.alert(err);
      // })
      //   console.log('form submitted');
      // } else {
      //   this.validateAllFormFields(this.user);
    } else {
      this.validateAllFormFields(this.signUpForm);
    }
  }

  alert(err) {

    this.alertController.create({
      message: err.message,
      buttons: ['Ok'],
      cssClass: 'custom-alert',
    }).then(
      alert => alert.present()
    );
  }


}
