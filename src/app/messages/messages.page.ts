import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ChatService } from '../services/chat.service';
import { AngularFirestore } from 'angularfire2/firestore';
import * as moment from 'moment';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  isSearchbar: boolean=false;
  profileList
  profileLoad
  currentUser
  recentChats= [];
  constructor(
    private route: Router, 
    private profileService: ProfileService,
    private chatService: ChatService,
    public afAuth: AngularFireAuth,
    private afs:AngularFirestore,
   
    ) { 
      this.chatService.chats().snapshotChanges().subscribe((data:any) =>{
        this.recentChats=data.map(e=>{
          return{
            key: e.payload.doc.id,
            ...e.payload.doc.data()
          }
        }).reverse();
        console.log(this.recentChats)
      })
    
      this.currentUser=afAuth.auth.currentUser.uid;
    this.profileService.getProfiles().subscribe((data:any) => {
      this.profileList = data.map(e => {
        return {
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        }
      });

      this.profileLoad = data.map(e => {
        return {
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        }
      });
      console.log(this.profileList);
    })
    }

  ngOnInit() {
  }
  initializeItems(): void {
    this.profileList = this.profileLoad;
  }

  filterList(evt) {
    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.profileList = this.profileList.filter(currentUser => {
      if (currentUser.name && searchTerm) {
        if (currentUser.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

  }

  moveToChat(user) {
    
    this.route.navigate(['chat'], { queryParams: { user: user.key , name: user.name}});
  }

  users(){
    this.route.navigateByUrl("users")
  }
  timeFrame(time) {

    // return moment(time).calendar("HH:mm");
    var otherDates = moment(time).fromNow();
    var calback= function () {
       return '['+otherDates+']';
    }
    return moment(time).calendar(null,{
       sameDay: 'HH:mm',
       nextDay:calback,
       nextWeek: calback,
       lastDay: "[Yesterday]",
       lastWeek: calback,
       sameElse: 'DD/MM/YYYY'
   });
  }


}
