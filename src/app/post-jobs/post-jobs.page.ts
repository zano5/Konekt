import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-post-jobs',
  templateUrl: './post-jobs.page.html',
  styleUrls: ['./post-jobs.page.scss'],
})
export class PostJobsPage implements OnInit {

  jobForm: FormGroup;


  constructor(private fb: FormBuilder, private route: Router) {

    this.jobForm = this.fb.group({

      name: ['', Validators.email],
      description: ['', Validators.required],
      type: ['', Validators.required],
      period: ['', Validators.required],
      amount: ['', Validators.required]

    });
   }

  ngOnInit() {
  }

  formSubmit({value, valid}: {value: Job, valid: boolean})  {

    const navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(value)
      }
    };


    this.route.navigate(['post-job-media'], navigationExtras );

  }





}
