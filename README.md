# A simple Ionic3 chat using Socket.io

<p>
  <img height="120px" src="https://ionicacademy.com/wp-content/uploads/2017/06/ionic-logo-portrait.png">
  <img height="120px" src="https://cdn-images-1.medium.com/max/1600/1*tOitxCwTNcS3ESstLylmtg.png">
</p>

## Demo
<img src="https://media.giphy.com/media/3Z1p5ryTkWrX4EGrdo/giphy.gif">

## Start server
* `index.js`
``` 
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
 
io.on('connection', (socket) => {
  
  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.nickname, event: 'left'});   
  });
 
  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    io.emit('users-changed', {user: nickname, event: 'joined'});    
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});    
  });
});
 
var port = process.env.PORT || 3001;
 
http.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});
```

* `npm init`
* `npm install --save express socket.io`
* `node index.js`

## Start ionic3 client (this repository)
* `git clone https://github.com/texano00/ionic3-chat-socketio.git`
* `cd ionic3-chat-socketio`
* `npm i`
* `ionic serve`


