import './App.css';
import React, { createContext } from 'react'
import { io } from 'socket.io-client';
import ChatRouter from './ChatRouter/ChatRouter';

const socket = io("http://localhost:3001/");

export const SocketContext = createContext(socket)


function App() {

    return <div className='App'>
      <SocketContext.Provider value={socket}>
        <ChatRouter />
      </SocketContext.Provider>
    </div>

}

export default App;
