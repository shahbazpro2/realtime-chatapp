import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import socketLink from '../socketContext'
import { Avatar } from 'antd';
import classnames from 'classnames'
import SelectedChat from './SelectedChat';
interface Messages {
    senderId: string,
    username: string,
    nicname: string,
    message: string,
    to: string
}
interface User {
    id: string,
    username: string,
    nicname: string
}
interface Props {
    history: {
        push(url: string): void;
    };
}
let socket: any
const Chat = ({ history }: Props) => {
    const [messages, setMessages] = useState<Messages[]>([])
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [user, setUser] = useState<User>({ id: '', username: '', nicname: '' })
    const [selected, setSelected] = useState('')
    const [toUser, setToUser] = useState<User | null>(null)
    useEffect(() => {
        socket = io(socketLink)
        let userData = JSON.parse(localStorage.getItem('userData') || '{}')

        if (userData.id)
            socket.emit('join', userData)
        else
            history.push('/')
        socket.on('joined', (data: User) => {
            setUser(data)
            socket.emit('getmessages', data.id)
            socket.emit('allusers')
        })
        socket.on('message-server', (smessages: Messages[]) => {
            console.log('smessages', smessages)
            setMessages(smessages)
        })

        socket.on('serverallusers', (users: User[]) => {
            console.log('users', users)
            setAllUsers(users)
        })
        socket.on('receivedData', (data: User) => {
            console.log('data', data)
            setToUser(data)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const sendMessage = (senderId: string, username: string, nicname: string, message: string, to: string) => {
        console.log(senderId, username, nicname, message, to)
        socket.emit('message-client', { senderId, username, nicname, message, to })
    }
    const selectedFun = (id: string) => {
        socket.emit('userdata', { id, userId: user.id })
        setSelected(id)
    }
    return (
        <div className="container-fluid p-5">

            <div className="messageBox">
                <div className="row innerbox">
                    <div className="col-md-3 left-col pr-0">
                        <div className="upperbox">

                        </div>
                        {allUsers.length > 0 && allUsers.map(suser => (
                            suser.id !== user.id &&
                            <div className={classnames("list p-3", { 'active': suser.id === selected })} key={suser.id} onClick={() => selectedFun(suser.id)}>
                                <div className="d-flex align-items-center">
                                    <div className="avatar">
                                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                    </div>
                                    <div className="mtext ml-2">
                                        <div className="title"><strong>{suser.username}</strong></div>
                                        <div className="smessage"><small>Me: i am fine</small></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {selected !== '' && <SelectedChat messages={messages} user={user} to={selected} toUser={toUser} sendMessage={sendMessage} />}
                </div>
            </div>

        </div>
    )
}

export default Chat
