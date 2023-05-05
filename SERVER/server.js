const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const fs = require('fs');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

const _online_users = []

io.on('connection', socket => {
  console.log('A user has connected: ', socket.id)

  io.emit('online-users', _online_users)

  socket.on('active-channel', channelName => {
    socket.join(channelName)
  }) 

  socket.on('disconnect', () => {
    _online_users.splice(_online_users.findIndex(item => item.socket === socket.id), 1)
    io.emit('online-users', _online_users)
  });

  socket.on('send-message', message_data => {
    const senderName = _online_users.find(user => user.socket === message_data.sender)

    const newMsgData = {
      message: message_data.message,
      sender: senderName?.username,
      channel: message_data.channel,
      message_id: Date.now(),
      sender_id: socket.id
    }
    console.log(message_data)
    io.to(message_data.channel).emit('receive-message', newMsgData)
  })

  socket.on('handle-login', data => { // USER LOGIN
    fs.readFile('userData.json', 'utf8', (error, fileData) => {
      if (error) {
        console.error(error)
      } else {
        const currentData = JSON.parse(fileData)
        if (currentData.find(item => item.username === data.username && item.password === data.password)) { // LOGIN SUCCESS
          socket.emit('successful-login', socket.id)
          _online_users.push({username: data.username, socket: socket.id})
          io.emit('online-users', _online_users)
        } else {                  // LOGIN NOT SUCCESS
          socket.emit('unsuccessful-login')
        }
      }
    })
  })

  socket.on('create-users-file--handle-register', data => { // USER REGISTER
    if (data.username.length < 256 && data.username.length < 256) {
      if(fs.existsSync('userData.json')) { // IF FILE EXISTS ADD DATA
        fs.readFile('userData.json', 'utf8', (err, currentData) => {
          if (err) {
            console.error(err);
            return;
          }
          const existingData = JSON.parse(currentData);
          existingData.push(data);
  
          fs.writeFile('userData.json', JSON.stringify(existingData), (err) => {
            if (err) {
              socket.emit('user-register-fail', `Server error: ${JSON.stringify(err)}`);
            }
            socket.emit('user-register-success', socket.id) 
            _online_users.push({username: data.username, socket: socket.id})
            io.emit('online-users', _online_users)
          });
        });
  
      } else { // IF FILE DOES NOT EXIST, CREATE FILE AND ADD DATA
        fs.writeFile('userData.json', JSON.stringify([{...data}]), err => {
          if (err) {
            socket.emit('user-register-fail', `Server error: ${JSON.stringify(err)}`); 
          } else {
            socket.emit('user-register-success', socket.id);
          }
        });
      }
    } else {
      socket.emit('long-credentials')
    }
  });
});


const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});