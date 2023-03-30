const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    console.log(`Received message: ${data}`);
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('A user has disconnected');
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});