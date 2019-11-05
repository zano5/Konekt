import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }


moveToChat() {

  this.route.navigateByUrl('chat');


}

}
