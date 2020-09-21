import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  notificationsList:any;
  constructor(
    private notificationService: NotificationService,
    private auth :AngularFireAuth,
  ) { 
   
    
    auth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.notificationService.getNotificationsTabs().subscribe((data: any) => {
          this.notificationsList=data.length;
          console.log(this.notificationsList)
        })
      }
    })
  }

  ngOnInit() {
    
  }

  markSeen(){
    console.log("test");
    
   this.notificationService.markNoticationAsSeen()
  }
}
