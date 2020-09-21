import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {
  profileUser
  user: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private profileService: ProfileService,
    private navC: NavController
  ) {
    this.route.queryParams.subscribe(params => {
      if (params && params.profileUser) {
        this.profileUser = JSON.parse(params.profileUser);
      }
    });
  }
  profileClass = {
    userId: '',
    name: '',
    surname: '',
    dob: '',
    gender: '',
    occupation: '',
    company: '',
    imageUrl: '',
    filename: '',

  };
  ngOnInit() {
    this.user = this.fb.group({
      name: [this.profileUser.name, Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30), Validators.required])],
      surname: this.profileUser.surname,
      gender: this.profileUser.gender,
      occupation: this.profileUser.occupation,
      company: this.profileUser.company,
      dob: this.profileUser.dob,
    });
  }

  update() {
    this.profileUser.name = this.user.value.name
    this.profileUser.surname = this.user.value.surname
    this.profileUser.gender = this.user.value.gender
    this.profileUser.occupation = this.user.value.occupation
    this.profileUser.company = this.user.value.company
    this.profileUser.dob = this.user.value.dob
    this.profileService.updateProfile(this.profileUser);
   
  }
}
