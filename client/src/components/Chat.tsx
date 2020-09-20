import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import socketLink from '../socketContext'
import { Avatar, Input } from 'antd';
import classnames from 'classnames'
import SelectedChat from './SelectedChat';
import { Messages, User } from './Types';

interface Props {
    history: {
        push(url: string): void;
    };
}
let socket: any
const { Search } = Input;
const Chat = ({ history }: Props) => {
    const [messages, setMessages] = useState<Messages[]>([])
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [searchUsers, setSearchUsers] = useState<User[]>([])
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
            setSearchUsers(users)
        })
        socket.on('receivedData', (data: User) => {
            console.log('data', data)
            setToUser(data)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const sendMessage = (senderId: string, username: string, nicname: string, message: string, to: string) => {
        socket.emit('message-client', { senderId, username, nicname, message, to, date: new Date() })
    }
    const selectedFun = (id: string) => {
        socket.emit('userdata', { id, userId: user.id })
        setSelected(id)
    }
    const showContacts = (user: User) => (

        <div className={classnames("list p-3", { 'active': user.id === selected })} key={user.id} onClick={() => selectedFun(user.id)}>
            <div className="d-flex align-items-center">
                <div className="avatar">
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                </div>
                <div className="mtext ml-2">
                    <div className="title"><strong>{user.username}</strong></div>
                    <div className="smessage"><small>Me: i am fine</small></div>
                </div>
            </div>
        </div>
    )
    const onSearchChange = (value: string) => {
        if (allUsers.length > 0) {
            const arr = allUsers.filter(user => {
                if (user.username.startsWith(value))
                    return user
                return null
            })
            setSearchUsers(arr)
        }
        setSelected('')
    }
    return (
        <div className="container-fluid p-5">

            <div className="messageBox">
                <div className="row innerbox">
                    <div className="col-md-3 left-col pr-0">
                        <div className="upperbox d-flex px-2 justify-content-end align-items-center py-auto">
                            <div className="search">
                                <Search
                                    placeholder="search contacts"
                                    style={{ width: 287 }}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                />
                            </div>

                        </div>
                        {searchUsers.length > 0 && searchUsers.map(suser => (
                            suser.id !== user.id &&
                            showContacts(suser)
                        ))}
                    </div>
                    {selected !== '' && <SelectedChat messages={messages} user={user} to={selected} toUser={toUser} sendMessage={sendMessage} />}
                </div>
            </div>

        </div>
    )
}

export default Chat
