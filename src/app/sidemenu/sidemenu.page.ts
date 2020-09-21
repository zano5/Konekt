import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.page.html',
  styleUrls: ['./sidemenu.page.scss'],
})
export class SidemenuPage implements OnInit {


  public uploads = [];

  media = '';

  imageURI;
  proceed;

  loader;


  image = '';
  progress: any;
  url: string;



  uploadFile = {
    name: '',
    downloadUrl: ''

  };


  myPhoto;




// files = {
//   picture: '',
//   audio: '',
//   video: '',
//   media: ''

// };


fire = {
  downloadUrl: ''
};

public firebaseUploads = [];


  profileList: Profile[];


  prof: Profile;

  header;
  item;


  userInfo = false;


  valid = false;
  user;
  type;
  subheader;
  message;







  profileClass = {
    userId: '',
    name: '',
    surname: '',
    dob: '',
    gender: '',
    occupation: '',
    imageUrl: '',
  };


  pages = [

   
    {
      title: 'News feed',
      url: '/sidemenu/tabs/feed',
      icon: 'home'
    },
    {
      title: 'Messages',
      url: '/sidemenu/messages',
      icon: 'mail'
    },
    {
      title: 'Jobs',
      url: '/sidemenu/jobs',
      icon: 'briefcase'
    },
    {
      title: 'Opportunties',
      url: '/sidemenu/opportunities',
      icon: 'options'
    },
    {
      title: 'Profile',
      url: '/sidemenu/tabs/profile',
      icon: 'contact'
    }
  ];
  profileUser:any;
  profileDidLoad=false;
  userSubcribe:any;
  constructor(
    private profileService: ProfileService,
    private loginService:LoginService
  ) {
    this.userSubcribe =this.profileService.user.subscribe((data:any)=>{
      console.log("hy am working");
      
      console.log(data)
      this.profileUser=data
      this.profileDidLoad=true;
    })
  }

  ngOnInit() {
  }
  
  logout(){
    this.userSubcribe.unsubscribe()
    this.loginService.signOut();
  }
}
