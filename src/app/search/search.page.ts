import { Component, OnInit } from '@angular/core';
import { NavigationExtras, ActivatedRoute } from '@angular/router';
import { FollowService } from '../services/follow.service';
import { NavController } from '@ionic/angular';
import { ProfileService } from '../services/profile.service';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  isSearchbar: boolean = false;
  profileList
  profileLoad
  currentUser

  FriendList

  errorMessage
  searchTerm = null
  userFollowersList
  isParams: boolean = false;
  constructor(
    private profileService: ProfileService,
    public afAuth: AngularFireAuth,
    private navC: NavController,
    private followService: FollowService,
    private Aroute: ActivatedRoute
  ) {
    this.Aroute.queryParams
      .subscribe(params => {
        if (params) {
          this.isParams = Boolean(params.isParams);
        }
      });

    this.currentUser = afAuth.auth.currentUser.uid;

  }

  ngOnInit() {
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


      this.followService.getUserFollowers(this.currentUser).subscribe((data: any) => {
        this.userFollowersList = data.map(e => {
          return {
            key: e.payload.doc.id,
            ...e.payload.doc.data()
          }
        })
        console.log(this.userFollowersList);

        for (const profileInfo of this.profileList) {

          for (const followers of this.userFollowersList) {
            if (profileInfo.userId === followers.key) {
              profileInfo.following = "Following"
            }
          }
        }

        for (const profileInfo of this.profileLoad) {

          for (const followers of this.userFollowersList) {
            if (profileInfo.userId === followers.key) {
              profileInfo.following = "Following"
            }
          }
        }
      })
      console.log(this.profileList);
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

    this.FriendList = this.profileList.filter(currentUser => {
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

    // this.route.navigate(['chat'], { queryParams: { user: user.key, name: user.name } });
  }
  viewProfile(user) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        isParams: true,
        userID: user.userId
      }
    };

    this.navC.navigateForward(['/profile'], navigationExtras);
  }
}
