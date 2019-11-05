import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PostJobMediaPage } from './post-job-media.page';

const routes: Routes = [
  {
    path: '',
    component: PostJobMediaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PostJobMediaPage]
})
export class PostJobMediaPageModule {}
