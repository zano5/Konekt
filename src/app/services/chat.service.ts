import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import *as firebase from 'firebase'
@Injectable({
  providedIn: 'root'
})
export class ChatService {

 db =firebase.firestore();

  constructor(
    public afs: AngularFirestore,
  ) { }

  send(CombineIDs,chat){
    return this.afs.collection('message').doc(CombineIDs).collection("messages").add(chat)
  }

  chats(){
    // return this.db.collection("message").orderBy('created');
    return this.afs.collection('message', ref=>ref.orderBy('created'));
  }

  chatList(CombineIDs){
      return this.afs.collection('message').doc(CombineIDs).collection("messages", ref => ref.orderBy('created'));
  }

  MessageDetails(CombineIDs){
    return this.afs.collection('message').doc(CombineIDs);
  }

  delete(CombineIDs,key){
    return this.afs.collection('message').doc(CombineIDs).collection("messages").doc(key).delete()
  }

}
