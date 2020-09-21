import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { ProfileService } from './profile.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private authFirebase: AngularFireAuth, 
    public toastController: ToastController,
    private route:Router,
    private afs :AngularFirestore
    ) { 
      
    }
    
  async signIn(email, password) {
    return await this.authFirebase.auth.signInWithEmailAndPassword(email, password)
  }

  signOut() {

    this.authFirebase.auth.signOut().then(() => {
      this.afs.firestore.disableNetwork();
      localStorage.removeItem('Konektuser')
      this.route.navigateByUrl('home');
    });

  }

}
