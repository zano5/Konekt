import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { AngularFireAuth } from '@angular/fire/auth';

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
 
  constructor(
    private route: Router,
    private profileService: ProfileService,
    public afAuth: AngularFireAuth,

  ) {

    this.currentUser = afAuth.auth.currentUser.uid;
    this.profileService.getProfiles().subscribe((data) => {
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

    this.route.navigate(['chat'], { queryParams: { user: user.key, name: user.name } });
  }



}
