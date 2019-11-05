import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-post-opportunity',
  templateUrl: './post-opportunity.page.html',
  styleUrls: ['./post-opportunity.page.scss'],
})
export class PostOpportunityPage implements OnInit {


  opportunityForm: FormGroup;

  constructor(private fb: FormBuilder, private route: Router) {


    this.opportunityForm = this.fb.group({

      name: ['', Validators.email],
      description: ['', Validators.required],
      duration: ['', Validators.required],
      amount: ['', Validators.required]


    });
   }

  ngOnInit() {
  }


  formSubmit({value, valid}: {value: Opportunity, valid: boolean})  {


  console.log(value);

    const navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(value)
      }
    };

    this.route.navigate(['submit-opportunity'], navigationExtras);

  }





}



