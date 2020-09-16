import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'
import socketLink from './socketContext'
import './app.css'
interface Messages {
  id: string,
  message: string
}
let socket: any
function App() {
  const [messages, setMessages] = useState<Messages[]>([])
  const [value, setValue] = useState('')
  const [id, setId] = useState<null | string>(null)
  useEffect(() => {

    socket = io(socketLink)
    socket.on('connect', () => {
      socket.emit('join', socket.id)
      setId(socket.id)
      socket.on('message-server', (smessages: Messages[]) => {
        console.log(smessages)
        setMessages(smessages)
      })
    });
  }, [])
  const sendMessage = () => {
    if (value !== '')
      socket.emit('message-client', { id: id, message: value })
    setValue('')
  }
  return (
    <div className="App">
      <div className="container py-2">
        <div className="mbody mb-3">
          {messages.length > 0 && messages.map((message, index) => (
            message.id === id ? <div key={index} className="rightside p-3 mb-2">
              {message.message}
            </div> : <div key={index} className="leftside p-3 mb-2">
                {message.message}
              </div>
          ))}

        </div>
        <div className="d-flex">
          <input className="form-control mr-2" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type message here" />
          <button className="btn btn-success" onClick={sendMessage}>Send</button>
        </div>

      </div>
    </div>
  );
}

export default App;
