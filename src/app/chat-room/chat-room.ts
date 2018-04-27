import { Component, ViewChild } from '@angular/core';
import {
  IonicPage,
  ToastController,
  AlertController,
  Content
} from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormBuilder } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html'
})
export class ChatRoomPage {
  @ViewChild(Content) content: Content;
  messages = [];
  nickname = '';

  messageForm: any;
  chatBox: any;

  constructor(
    private socket: Socket,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public formBuilder: FormBuilder
  ) {
    this.messageForm = formBuilder.group({
      message: new FormControl('')
    });
    this.chatBox = '';

    this.presentPrompt().then((nickname: string) => {
      this.nickname = nickname;

      this.socket.connect();
      this.socket.emit('set-nickname', this.nickname);

      this.getMessages().subscribe(message => {
        this.messages.push(message);
        this.scrollToBottom();
      });

      this.getUsers().subscribe(data => {
        let user = data['user'];
        if (data['event'] === 'left') {
          this.showToast('User left: ' + user);
        } else {
          this.showToast('User joined: ' + user);
        }
      });
    });
  }

  public sendMessage(message: string): void {
    if (!message || message === '') return;

    this.socket.emit('add-message', { text: message });
    this.chatBox = '';
  }

  getMessages(): Observable<{}> {
    let observable = new Observable(observer => {
      this.socket.on('message', data => {
        observer.next(data);
      });
    });
    return observable;
  }

  getUsers(): Observable<{}> {
    let observable = new Observable(observer => {
      this.socket.on('users-changed', data => {
        observer.next(data);
      });
    });
    return observable;
  }

  ionViewWillLeave(): void {
    this.socket.disconnect();
  }

  showToast(msg: string): void {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  presentPrompt(): Promise<string> {
    return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create({
        title: 'Nickname',
        inputs: [
          {
            name: 'nickname',
            placeholder: 'doretta'
          }
        ],
        buttons: [
          {
            text: 'Random',
            role: 'cancel',
            handler: data => {
              resolve('random_' + Math.round(Math.random() * 100));
            }
          },
          {
            text: 'Go on',
            handler: data => {
              resolve(data.nickname);
            }
          }
        ]
      });
      alert.present();
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 100);
  }
}
