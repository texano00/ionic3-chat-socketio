import { Component } from '@angular/core';
import { IonicPage, ToastController, AlertController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html'
})
export class ChatRoomPage {
  messages = [];
  message = '';

  constructor(
    private socket: Socket,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.presentPrompt().then((nickname: string) => {
      this.getMessages().subscribe(message => {
        this.messages.push(message);
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

  public sendMessage() {
    this.socket.emit('add-message', { text: this.message });
    this.message = '';
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', data => {
        observer.next(data);
      });
    });
    return observable;
  }

  getUsers() {
    let observable = new Observable(observer => {
      this.socket.on('users-changed', data => {
        observer.next(data);
      });
    });
    return observable;
  }

  ionViewWillLeave() {
    this.socket.disconnect();
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatRoomPage');
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
              resolve('random_' + Math.random() * 10);
            }
          },
          {
            text: 'Go on',
            handler: (data: string) => {
              resolve(data);
            }
          }
        ]
      });
      alert.present();
    });
  }
}
