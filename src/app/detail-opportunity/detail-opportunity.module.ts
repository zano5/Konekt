import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailOpportunityPage } from './detail-opportunity.page';

const routes: Routes = [
  {
    path: '',
    component: DetailOpportunityPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailOpportunityPage]
})
export class DetailOpportunityPageModule {}
