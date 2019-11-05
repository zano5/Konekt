import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { PostJobService } from '../services/post-job.service';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.page.html',
  styleUrls: ['./edit-job.page.scss'],
})
export class EditJobPage implements OnInit {

  jobForm: FormGroup;
  data;
  header = 'Recorded Updated';
  message = 'Job Successfully Updated';

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private jobService: PostJobService) {


    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.data = JSON.parse(params.special);
      }
    });

    console.log('zano', this.data);

    this.jobForm = this.fb.group({

      name: [this.data.name, Validators.email],
      description: [this.data.description, Validators.required],
      type: [this.data.type, Validators.required],
      period: [this.data.period, Validators.required],
      amount: [this.data.amount, Validators.required]


    });
  }

  ngOnInit() {
  }


  formSubmit({value, valid}: {value: Job, valid: boolean})  {



    this.data.name = value.name;
    this.data.description = value.description;
    this.data.type = value.type;
    this.data.period = value.period;
    this.data.amount = value.amount;


    this.jobService.updateJob(this.data, this.header, this.message);



  }

}
