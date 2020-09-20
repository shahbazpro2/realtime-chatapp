const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const server = app.listen(port, () => console.log(`Server running on port ${port}`))
const io = require('socket.io')(server)

const { addUser, getUser, getAllUsers } = require('./socketUsers.js')
let messages = [], online = []
io.on('connection', socket => {
    socket.on('join', ({ id, username, nicname }) => {
        const userId = addUser(id, username, nicname)
        if (userId !== undefined) {
            socket.join(userId)
            const getData = getUser(userId)[0]
            io.to(userId).emit('joined', getData)
        }
    })
    socket.on('getOnline',(id)=>{
        io.to(id).emit('serverOnline', online)
    })
    socket.on('userdata', ({ id, userId }) => {
        let data = getUser(id)[0]
        io.to(userId).emit('receivedData', data)
    })
    socket.on('allusers', () => {
        let users = getAllUsers()
        io.emit('serverallusers', users)
    })
    socket.on('getmessages', id => {
        io.to(id).emit('message-server', messages)
    })
    socket.on('message-client', ({ senderId, username, to, nicname, message, date }) => {
        messages.push({ senderId, to, username, nicname, message, date })
        io.emit('message-server', messages)
    })
})