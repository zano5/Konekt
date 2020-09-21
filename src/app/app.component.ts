import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  user
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router:Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.statusBar.styleLightContent()

      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#47e0ff');
      this.splashScreen.hide();
    });
  }
  async ngOnInit() {
    this.user=localStorage.getItem("Konektuser");
    console.log("user:  " +this.user)

    if (this.user !=null) {
      this.router.navigateByUrl("/sidemenu/tabs/feed");
    } else {
      this.router.navigateByUrl("/home");
    }
  }
}
