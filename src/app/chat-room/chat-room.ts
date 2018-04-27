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
  nickname = '';

  constructor(
    private socket: Socket,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.presentPrompt().then((nickname: string) => {
      this.nickname = nickname;

      this.socket.connect();
      this.socket.emit('set-nickname', this.nickname);

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

  public sendMessage(): void {
    this.socket.emit('add-message', { text: this.message });
    this.message = '';
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
              resolve('random_' + Math.random() * 10);
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
}
