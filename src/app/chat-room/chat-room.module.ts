import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatRoomPage } from './chat-room';
import { SocketIoModule } from 'ng-socket-io';
import { configSocketIO } from '../config/config.socketio';

@NgModule({
  declarations: [ChatRoomPage],
  imports: [
    IonicPageModule.forChild(ChatRoomPage),
    SocketIoModule.forRoot(configSocketIO)
  ]
})
export class ChatRoomPageModule {}
