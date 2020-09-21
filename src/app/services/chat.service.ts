import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import *as firebase from 'firebase'
import { AngularFireAuth } from '@angular/fire/auth';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  db = firebase.firestore();

  constructor(
    public afs: AngularFirestore,
    private auth: AngularFireAuth,
  ) { }

  send(CombineIDs, chat) {
    return this.afs.collection('message').doc(CombineIDs).collection("messages").add(chat)
  }

  chats() {

    // return this.db.collection("message").orderBy('created');
    return this.afs.collection('message', ref => ref.orderBy('created'));
  }

  chats3(uid) {
    console.log(uid)
    return combineLatest(
      this.afs.collection('message', ref => ref.where('sender', '==', uid).orderBy('created')).snapshotChanges(),
      this.afs.collection('message', ref => ref.where('friend', '==', uid).orderBy('created')).snapshotChanges(),
    ).pipe(
      map(arr => arr.reduce((acc, cur) => acc.concat(cur)))
    )
  }
  chatList(CombineIDs) {
    return this.afs.collection('message').doc(CombineIDs).collection("messages", ref => ref.orderBy('created'));
  }

  MessageDetails(CombineIDs) {
    return this.afs.collection('message').doc(CombineIDs);
  }

  delete(CombineIDs, key) {
    return this.afs.collection('message').doc(CombineIDs).collection("messages").doc(key).delete()
  }

}
