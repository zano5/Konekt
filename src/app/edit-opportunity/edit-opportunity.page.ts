import { PostOpportunityService } from './../services/post-opportunity.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-opportunity',
  templateUrl: './edit-opportunity.page.html',
  styleUrls: ['./edit-opportunity.page.scss'],
})
export class EditOpportunityPage implements OnInit {

  opportunityForm: FormGroup;
  data;
  header = 'Record updated';
  message = 'Opportunity Successfully Updated';

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private opportunity: PostOpportunityService) {



    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.data = JSON.parse(params.special);
      }
    });

    this.opportunityForm = this.fb.group({

      name: [this.data.name, Validators.email],
      description: [this.data.description, Validators.required],
      duration: [this.data.duration, Validators.required],
      amount: [this.data.amount, Validators.required]


    });
  }

  ngOnInit() {
  }



  formSubmit({value, valid}: {value: Opportunity, valid: boolean})  {




    this.data.amount = value.amount;
    this.data.description = value.description;
    this.data.duration = value.duration;
    this.data.amount = value.amount;


    this.opportunity.updateOpportunity(this.data, this.header, this.message);


  }
}
