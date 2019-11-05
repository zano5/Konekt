import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SubmitOpportunityPage } from './submit-opportunity.page';

const routes: Routes = [
  {
    path: '',
    component: SubmitOpportunityPage,
    children: [
      {path: 'feed', loadChildren: '../feed/feed.module#FeedPageModule'}
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SubmitOpportunityPage]
})
export class SubmitOpportunityPageModule {}
