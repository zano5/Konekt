import { TabsPage } from './tabs/tabs.page';
import { PostImagePageModule } from './post-image/post-image.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SidemenuPage } from './sidemenu/sidemenu.page';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PostImagePage } from './post-image/post-image.page';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { TwitterConnect } from '@ionic-native/twitter-connect/ngx';
import { File } from '@ionic-native/file/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
// import { FCM } from '@ionic-native/fcm/ngx';


const  firebasCconfig = {
  apiKey: 'AIzaSyBYJt4zoUCKDqGdmyxaxY-go7BeBKRFtzo',
  authDomain: 'konekt-430c3.firebaseapp.com',
  databaseURL: 'https://konekt-430c3.firebaseio.com',
  projectId: 'konekt-430c3',
  storageBucket: 'konekt-430c3.appspot.com',
  messagingSenderId: '15860602087'
};


@NgModule({
  declarations: [AppComponent, SidemenuPage, TabsPage],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(firebasCconfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
    PostImagePageModule,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    MediaCapture,
    Camera,
    Facebook,
    TwitterConnect,
    PhotoLibrary,
    WebView,
    File,
    FileTransfer ,
    FileTransferObject,
    GooglePlus,
    ImagePicker,
    SocialSharing,
    // FCM,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
