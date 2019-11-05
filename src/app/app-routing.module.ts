import { SidemenuPage } from './sidemenu/sidemenu.page';
import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },

  { path: 'messages', loadChildren: './messages/messages.module#MessagesPageModule' },

  { path: 'sidemenu', component: SidemenuPage ,  children: [
    { path: 'opportunities', loadChildren: './opportunities/opportunities.module#OpportunitiesPageModule' },
    { path: 'jobs', loadChildren: './jobs/jobs.module#JobsPageModule' },
    { path: 'messages', loadChildren: './messages/messages.module#MessagesPageModule' },
    { path: 'tabs', component: TabsPage, children: [
      { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
      { path: 'feed', loadChildren: './feed/feed.module#FeedPageModule' },
      { path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsPageModule' }
    ] }
  ]


},
  { path: 'op-view', loadChildren: './op-view/op-view.module#OpViewPageModule' },

  { path: 'chat', loadChildren: './chat/chat.module#ChatPageModule' },
  { path: 'sign-up', loadChildren: './sign-up/sign-up.module#SignUpPageModule' },
  { path: 'post-jobs', loadChildren: './post-jobs/post-jobs.module#PostJobsPageModule' },
  { path: 'post-opportunity', loadChildren: './post-opportunity/post-opportunity.module#PostOpportunityPageModule' },
  { path: 'submit-opportunity', loadChildren: './submit-opportunity/submit-opportunity.module#SubmitOpportunityPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'post-image', loadChildren: './post-image/post-image.module#PostImagePageModule' },
  { path: 'add-job', loadChildren: './add-job/add-job.module#AddJobPageModule' },
  { path: 'post-job-media', loadChildren: './post-job-media/post-job-media.module#PostJobMediaPageModule' },
  { path: 'detail-opportunity', loadChildren: './detail-opportunity/detail-opportunity.module#DetailOpportunityPageModule' },
  { path: 'detail-job', loadChildren: './detail-job/detail-job.module#DetailJobPageModule' },
  { path: 'edit-job', loadChildren: './edit-job/edit-job.module#EditJobPageModule' },
  { path: 'edit-opportunity', loadChildren: './edit-opportunity/edit-opportunity.module#EditOpportunityPageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  { path: 'comment', loadChildren: './comment/comment.module#CommentPageModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
