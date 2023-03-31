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

io.on('connection', socket => {
  console.log('A user has connected: ', socket.id)

  socket.on('disconnect', () => {
    console.log('A user has disconnected', socket.id);
  });

  socket.on('handle-login', data => { // USER LOGIN
    fs.readFile('userData.json', 'utf8', (error, fileData) => {
      if (error) {
        console.error(error)
      } else {
        const currentData = JSON.parse(fileData)
        if (currentData.find(item => item.username === data.username && item.password === data.password)) {
          socket.emit('successful-login', socket.id)
        } else {
          socket.emit('unsuccessful-login')
        }
      }
    })
  })

  socket.on('create-users-file--handle-register', data => { // USER REGISTER
    if (data.username.length < 256 && data.username.length < 256) {
      if(fs.existsSync('userData.json')) { // check if file exists, then add data to it
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
            socket.emit('user-register-success', socket.id) // add listener on front
          });
        });
  
      } else { // if file doesn't exist, create new one, and add data to it
        fs.writeFile('userData.json', JSON.stringify([{...data}]), err => {
          if (err) {
            socket.emit('user-register-fail', `Server error: ${JSON.stringify(err)}`); //add listener on front
          } else {
            socket.emit('user-register-success'); //add listener on front
          }
        });
      }
    } else {
      socket.emit('long-credentials')
    }
  });
});

// Start the server
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});