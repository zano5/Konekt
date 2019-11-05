import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-opportunity',
  templateUrl: './detail-opportunity.page.html',
  styleUrls: ['./detail-opportunity.page.scss'],
})
export class DetailOpportunityPage implements OnInit {


  data;

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  constructor(private route: ActivatedRoute) {

    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.data = JSON.parse(params.special);
      }
    });

  }

  ngOnInit() {
  }

}
