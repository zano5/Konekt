import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { FollowService } from '../services/follow.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  isSearchbar: boolean = false;
  profileList
  profileLoad
  currentUser

  FriendList

  errorMessage
  searchTerm = null
  userFollowersList
  constructor(
    private route: Router,
    private profileService: ProfileService,
    public afAuth: AngularFireAuth,
    private navC: NavController,
    private followService: FollowService
  ) {

    this.currentUser = afAuth.auth.currentUser.uid;

  }

  ngOnInit() {
    this.followService.getUserFollowersAndFollowing(this.currentUser).subscribe((data: any) => {
      this.userFollowersList = data.map(e => {
        return {
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        }
      })
   
      console.log( this.userFollowersList)
    })
    this.profileService.getProfiles().subscribe((data: any) => {
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


      // this.followService.getUserFollowers(this.currentUser).subscribe((data: any) => {
      //   this.userFollowersList = data.map(e => {
      //     return {
      //       key: e.payload.doc.id,
      //       ...e.payload.doc.data()
      //     }
      //   })
      //   console.log(this.userFollowersList );

      //   for (const profileInfo of this.profileList) {

      //     for (const followers of this.userFollowersList) {
      //       if (profileInfo.userId === followers.key) {
      //         profileInfo.following = "Following"
      //       }
      //     }
      //   }

      //   for (const profileInfo of this.profileLoad) {

      //     for (const followers of this.userFollowersList) {
      //       if (profileInfo.userId === followers.key) {
      //         profileInfo.following = "Following"
      //       }
      //     }
      //   }
      // })
      // console.log(this.profileList);
    })
  }

  initializeItems(): void {
    this.profileList = this.profileLoad;
  }

  filterList(evt) {
    this.initializeItems();

    this.searchTerm = evt.srcElement.value;

    if (!this.searchTerm) {
      this.errorMessage = null;
      this.searchTerm = null
      this.FriendList = [];
      return;
    }

    this.profileList = this.profileList.filter(currentUser => {
      if (currentUser.name && this.searchTerm) {
        if (currentUser.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

    if ((this.FriendList.length === 0) && (this.searchTerm !== null)) {
      this.errorMessage = "Search not found";
    } else {
      this.errorMessage = null;
    }

    console.log(this.errorMessage)
  }
  moveToChat(user) {

    this.route.navigate(['chat'], { queryParams: { user: user.key, name: user.name } });
  }



}
