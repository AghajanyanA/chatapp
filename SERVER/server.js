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

  socket.on('create-users-file', data => { // add if's to check username and pass length and limit it
    if(!fs.existsSync('userData.json')) {
      fs.writeFile('userData.json', JSON.stringify([{...data}]), err => {
        if (err) {
          console.error(err);
          socket.emit('file-creation-error', 'Error creating file');
        } else {
          console.log('File created successfully');
          socket.emit('file-creation-success', 'File created successfully');
        }
      });
    } else {
      fs.readFile('userData.json', 'utf8', (err, currentData) => {
        if (err) {
          console.error(err);
          return;
        }
        const existingData = JSON.parse(currentData);
        existingData.push(data);
      
        // write the updated data to file
        fs.writeFile('userData.json', JSON.stringify(existingData), (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('Data saved successfully');
        });
      });
    }

  });


});

// Start the server
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});