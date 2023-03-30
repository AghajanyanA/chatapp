import { useEffect } from 'react';
import './App.css';
import { io } from 'socket.io-client';

function App() {
  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io('http://localhost:3000');

    // Set up event listeners for incoming messages, user connections, disconnections, etc.
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('message', (data) => {
      console.log(`Received message: ${data}`);
    });

    // Send a message to the server
    socket.emit('message', 'Hello from the client');
  }, []);

  return (
    <div>
      <h1>Chat App</h1>
      {/* Render the chat interface */}
    </div>
  );
}

export default App;
