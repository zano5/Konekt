import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, share } from 'rxjs/operators';
import { IonContent, AlertController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ChatService } from '../services/chat.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage, } from 'angularfire2/storage';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as moment from 'moment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild('scrollArea') content: IonContent;

  user: string;
  uid: string;
  CombineIDs: string;
  chatList

  text: string;
  name: any;
  data = false

  Chat = {
    Name: '',
    Message: '',
    userID: '',
    sendto: '',
    url: '',
    created: '',
  }

  file = {
    filename: "",
    fileext: "",
    url: "",
    userID: '',
    sendto: '',
    created: '',
    Message: '',
    size: '',
  }

  uploadPercent: Observable<number>;
  downloadUR: any;
  uniqkey: any;

  isToolbar: boolean = false;
  isprogress: boolean = false;
  isDownload: boolean = false;

  ActionChatValue;
  filename;
  size;
  fileext;
  task;

  constructor(
    private Aroute: ActivatedRoute,
    public afAuth: AngularFireAuth,
    private chatService: ChatService,
    private route: Router,
    private storage: AngularFireStorage,
    private alertCtrl: AlertController,
    private transfer: FileTransfer,
    private platform: Platform,
    private File: File,
    private socialSharing: SocialSharing,
  ) {
    this.uid = this.afAuth.auth.currentUser.uid;
    console.log("me " + this.uid)
    this.Aroute.queryParams
      .subscribe(params => {
        this.user = params.user;
        this.name = params.name;
        console.log("user " + this.user);
      });
  }

  ngOnInit() {
    this.scorllTo();
    if (this.uid < this.user) {
      this.CombineIDs = this.uid + this.user
      console.log("< " + this.CombineIDs)
    } else {
      this.CombineIDs = this.user + this.uid
      console.log("> " + this.CombineIDs)
    }

    this.chatService.chatList(this.CombineIDs).snapshotChanges().subscribe((data) => {
      this.chatList = data.map(e => {
        return {
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        }
      });
      this.data = true;
    })
  }
  messages() {
    this.route.navigateByUrl("sidemenu/messages")
  }

  scorllTo() {
    setTimeout(() => {

      this.content.scrollToBottom();
      this.content.scrollToBottom();
    }, 1000);

  }

  Actions(chat) {
    this.isToolbar = true
    this.ActionChatValue = chat
  }

  Cancel() {
    this.isToolbar = false
  }

  //Share text or url 
  ShareWith() {
    this.isToolbar = false;
    this.socialSharing.share(this.ActionChatValue.Message + this.ActionChatValue.url).then(() => {

    }).catch(() => {

    })
  }

  

  //Formating file size 
  formatBytes(x) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    if (x === 1) return '1 byte';

    let l = 0, n = parseInt(x, 10) || 0;

    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    //include a decimal point and a tenths-place digit if presenting 
    //less than ten of KB or greater units
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
  }

  // Select a documment and upload
  selectFile(event) {

    const filevalue = event.target.files[0];
    this.filename = event.target.files[0].name;
    this.size = event.target.files[0].size;
    this.fileext = this.filename.substr(this.filename.lastIndexOf('.') + 1).toLowerCase()
    const filenameRef = this.filename.substring(0, this.filename.lastIndexOf(".")) + Math.random().toString(36).substring(2);


    console.log("nnn " + this.fileext);

    if (this.fileext == "doc" || this.fileext == "xlsx" || this.fileext == "pdf" || this.fileext == "accdb" || this.fileext == "docx" || this.fileext == "accdb") {

      this.file.fileext = this.fileext;
      this.file.userID = this.uid;
      this.file.sendto = this.user;
      this.file.filename = filenameRef;
      this.file.size = this.size;
      this.file.created = moment().format();


      const filePath = 'Documents/' + filenameRef;
      const fileRef = this.storage.ref(filePath);
      this.task = this.storage.upload(filePath, filevalue);

      // observe percentage changes

      this.uploadPercent = this.task.percentageChanges();
      this.content.scrollToBottom();

      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadUR = fileRef.getDownloadURL().subscribe(urlfile => {
            console.log(urlfile);
            this.file.url = urlfile;
            this.file.Message = '';

            this.chatService.send(this.CombineIDs, this.file).then(() => {
              this.content.scrollToBottom();

              this.chatService.MessageDetails(this.CombineIDs).set({
                sender: this.user,
                friend: this.uid,
                Message: this.fileext,
                created: moment().format(),
              })

            })


            this.uploadPercent = null;
          });
        })

      ).subscribe();

    } else {

      this.alertCtrl.create({
        message: 'Upload doc, xlsx, pdf, accdb, docx',
        subHeader: "Can't add " + this.filename,
        buttons: [

          {
            text: 'ok',
            handler: () => {

            }
          }
        ]
      }).then(
        alert => alert.present()
      );
    }
  }

  //Send text message
  send() {

    if (this.text != '') {
      this.Chat.Name = this.name;
      this.Chat.Message = this.text
      this.Chat.userID = this.afAuth.auth.currentUser.uid;
      this.Chat.sendto = this.user;
      this.Chat.url = '';
      this.Chat.created = moment().format();


      this.chatService.send(this.CombineIDs, this.Chat).then(() => {
        this.content.scrollToBottom();
        this.chatService.MessageDetails(this.CombineIDs).set({
          sender: this.user,
          friend: this.uid,
          Message: this.text,
          created: moment().format(),
        })
        this.text = "";
      })

    }

  }

  // Download a document
  fileTransfer: FileTransferObject = this.transfer.create();
  download() {
    this.isToolbar = false
    let file = this.ActionChatValue;
    if (this.platform.is('cordova')) {
      this.File.checkDir(this.File.externalRootDirectory, 'download')
        .then(
          // Directory exists, check for file with the same name
          _ => this.File.checkFile(this.File.externalRootDirectory, '/download/' + file.filename + "." + file.fileext)
            .then(_ => {
              this.alert("A file with the same name already exists!")
            })
            // File does not exist yet, we can save normally
            .catch(err => {
              this.isprogress = true;

              this.fileTransfer.download(file.url, this.File.externalRootDirectory + '/download/' + file.filename + "." + file.fileext).then((entry) => {
                console.log("can save normally" + file.filename + "." + file.fileext)
                this.isprogress = false;
                this.alert('File saved in:  ' + entry.nativeURL);
              })
                .catch((err) => {
                  this.alert('Error saving file: ' + err.message);
                })
            }))
        .catch(
          // Directory does not exists, create a new one
          err => this.File.createDir(this.File.externalRootDirectory, 'download', false)
            .then(response => {
              this.isprogress = true;

              this.alert('New folder created:  ' + response.fullPath);
              this.fileTransfer.download(file.url, this.File.externalRootDirectory + '/download/' + file.filename + "." + file.fileext).then((entry) => {
                this.isprogress = false;

                console.log("create a new one" + file.filename + "." + file.fileext);
                this.alert('File saved in : ' + entry.nativeURL);

              })
                .catch((err) => {
                  this.alert('Error saving file:  ' + err.message);
                });

            }).catch(err => {
              this.alert('It was not possible to create the dir "download". Err: ' + err.message);
            })
        );

    } else {
      

    }
  }

  alert(alert) {
    this.alertCtrl.create({
      subHeader: alert,
      buttons: [

        {
          text: 'ok',
          handler: () => {

          }
        }
      ]
    }).then(
      alert => alert.present()
    );
  }


  //Delete text or doc
  delete() {
    this.isToolbar = false;

    this.alertCtrl.create({
      subHeader: 'Are you sure you want to delete a message',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {

            if (this.ActionChatValue.url == '') {
              this.chatService.delete(this.CombineIDs, this.ActionChatValue.key)
            } else {
              const storageRef = this.storage.storage.ref().child('Documents/' + this.ActionChatValue.filename);
              console.log("delete " + storageRef)

              this.chatService.delete(this.CombineIDs, this.ActionChatValue.key).then(() => {
                storageRef.delete().then(() => {
                  console.log(" File deleted succe-ssfully")
                }).catch(function (error) {
                  // Uh-oh, an error occurred!
                  console.log("Uh-oh, an error occurred!")
                });
              })
            }

          }
        }
      ]
    }).then(
      alert => alert.present()
    );



  }
}
