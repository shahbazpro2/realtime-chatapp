const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const server = app.listen(port, () => console.log(`Server running on port ${port}`))
const io = require('socket.io')(server)

const { addUser, getUser, getAllUsers } = require('./socketUsers.js')
let messages = [], online = [], unread = []
io.on('connection', socket => {
    socket.on('join', ({ id, username, nicname }) => {
        const userId = addUser(id, username, nicname)
        if (userId !== undefined) {
            socket.join(userId)
            const getData = getUser(userId)[0]
            io.to(userId).emit('joined', getData)
        }
    })
    socket.on('online', id => {
        let check = online.filter(o => o.id === id)
        if (!check.length > 0)
            online.push({ id, date: new Date, status: true })
        else {
            check = online.filter(o => {
                if (o.id === id) {
                    o.date = new Date
                    o.status = true
                    return o
                } else return o
            })
            online = check
        }
        io.emit('serverOnline', online)
    })
    socket.on('getOnline', (id) => {
        io.to(id).emit('serverOnline', online)
    })
    socket.on('rmonline', id => {
        const check = online.filter(o => {
            if (o.id === id) {
                o.status = false
                return o
            } else return o
        })

        online = check

        io.emit('serverOnline', online)
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
    socket.on('unread', id => {
        io.to(id).emit('unread-server', unread)
    })
    socket.on('rmunread', ({ userId, to }) => {
        const rm = unread.filter(r => !((r.to === userId) && (r.senderId === to)))
        unread = rm
        io.to(userId).emit('unread-server', unread)
    })
    socket.on('message-client', ({ senderId, username, to, nicname, message, date }) => {
        unread.push({ senderId, to, username, nicname, message, date })
        messages.push({ senderId, to, username, nicname, message, date })
        io.emit('unread-server', unread)
        io.emit('message-server', messages)
    })
})