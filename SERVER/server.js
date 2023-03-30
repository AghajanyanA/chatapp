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

io.on('connection', (socket) => {
  console.log('A user has connected: ', socket.id)

  socket.on('disconnect', () => {
    console.log('A user has disconnected', socket.id);
  });

  socket.on('create-users-file', (data) => {
    if(!fs.existsSync('userData.json')) {
      console.log(data);
      fs.writeFile('userData.json', data, (err) => {
        if (err) {
          console.error(err);
          socket.emit('file-creation-error', 'Error creating file');
        } else {
          console.log('File created successfully');
          socket.emit('file-creation-success', 'File created successfully');
        }
      });
    }

  });


});

// Start the server
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});