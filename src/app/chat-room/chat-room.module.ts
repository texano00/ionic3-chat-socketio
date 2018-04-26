import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatRoomPage } from './chat-room';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: 'http://172.20.4.129:3001', options: {} };

@NgModule({
  declarations: [ChatRoomPage],
  imports: [
    IonicPageModule.forChild(ChatRoomPage),
    SocketIoModule.forRoot(config)
  ]
})
export class ChatRoomPageModule {}
