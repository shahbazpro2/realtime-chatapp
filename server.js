const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const server = app.listen(port, () => console.log(`Server running on port ${port}`))
const io = require('socket.io')(server)

const { addUser } = require('./socketUsers.js')
let messages = []
io.on('connection', socket => {
    socket.on('join', (id) => {
        socket.emit('message-server', messages)
        const userId = addUser(id)
        if (userId !== undefined)
            socket.join(userId)
    })
    socket.on('message-client', message => {
        messages.push({ id: message.id, message: message.message })
        io.emit('message-server', messages)
    })
})