import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NotificationService } from '../services/notification.service';
import { ProfileService } from '../services/profile.service';
import { ToastController, NavController } from '@ionic/angular';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notificationsList: any;
  profileList: Profile[];
  data=false
  // 56:c1:f8:b9:4f:d1:07:13:40:04:47:f5:21:8e:8b:f2:c3:90:16:b1
  constructor(
    private notificationService: NotificationService,
    private profileService: ProfileService,
    public toastController: ToastController,
    private navC: NavController,
  ) {
    this.notificationService.getNotifications().subscribe((data: any) => {
      this.notificationsList = data.map(e => {
        return {
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        }
      }).reverse()

      // tslint:disable-next-line:no-shadowed-variable
      this.profileService.getProfiles().subscribe((data: any) => {
        this.profileList = data.map(e => {
          return {
            key: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Profile;
        });
        console.log(this.profileList);

        for (const profileInfo of this.profileList) {

          for (const notification of this.notificationsList) {
            if (profileInfo.userId === notification.postOwner) {
              notification.name = profileInfo.name;
              notification.userUrl = profileInfo.imageUrl;
            }
          }
        }

      });
      console.log(this.notificationsList);
      this.data=true
    })
  }

  ngOnInit() {
  }

  openNotification(data) {
    this.notificationService.isRead(data.key)
   if(data.notificationType != "feed"){
    this.navC.navigateForward('/sidemenu/'+data.notificationType);
   }else{
    this.navC.navigateForward('/sidemenu/tabs/'+data.notificationType);
   }
  }

  timeFrame(time) {

    return moment(time).fromNow(true);
    // var otherDates = moment(time).fromNow();
    // var calback = function () {
    //   return '[' + otherDates + ']';
    // }
    // return moment(time).calendar(null, {
    //   sameDay: 'HH:mm',
    //   nextDay: calback,
    //   nextWeek: calback,
    //   lastDay: "DD MMM",
    //   lastWeek: "DD MMM",
    //   sameElse: 'DD/MM/YYYY'
    // });
  }

  deleteNotification(data) {
    this.notificationService.deleteNotication(data.key).then(async () => {

      const toast = await this.toastController.create({
        color: 'primary',
        duration: 2000,
        message: 'Notification is deleted successfully',
        // showCloseButton: true
      });

      toast.present();
    })
  }
}
