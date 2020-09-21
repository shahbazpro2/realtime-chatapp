import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import socketLink from '../socketContext'
import { Avatar, Input, Badge } from 'antd';
import classnames from 'classnames'
import SelectedChat from './SelectedChat';
import { Messages, User, Online } from './Types';
import { useBeforeunload } from 'react-beforeunload';

interface Props {
    history: {
        push(url: string): void;
    };
}
let socket: any
const { Search } = Input;
const Chat = ({ history }: Props) => {
    const [messages, setMessages] = useState<Messages[]>([])
    const [unread, setUnread] = useState<Messages[]>([])
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [searchUsers, setSearchUsers] = useState<User[]>([])
    const [user, setUser] = useState<User>({ id: '', username: '', nicname: '' })
    const [selected, setSelected] = useState<string>('')
    const [toUser, setToUser] = useState<User | null>(null)
    const [online, setOnline] = useState<(Online)[]>([{ id: '', date: '', status: false }])
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
            socket.emit('online', data.id)
            socket.emit('unread', data.id)
        })
        socket.on('message-server', (smessages: Messages[]) => {
            console.log('smessages', smessages)
            setMessages(smessages)
        })
        socket.on('unread-server', (unread: Messages[]) => {
            console.log('unread', unread)
            setUnread(unread)
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

        socket.on('serverOnline', (data: []) => {
            console.log('online', data)
            setOnline(data)
        })


        //window.removeEventListener('onbeforeunload', socket.emit('rmonline', user.id))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const sendMessage = (senderId: string, username: string, nicname: string, message: string, to: string) => {
        socket.emit('message-client', { senderId, username, nicname, message, to, date: new Date() })

    }
    const selectedFun = (id: string) => {
        socket.emit('userdata', { id, userId: user.id })
        setSelected(id)
    }
    const showOnlne = (id: string) => {
        const check = online.filter(o => o.id === id)
        if (check.length > 0 && check[0].status === true)
            return <div className="online ml-2">
                <Badge status="success" />
            </div>
        return <div className="online ml-2">
            <Badge status="default" />
        </div>
    }
    const filterSelected = (userId: string, to: string) => {
        console.log('filter work')
        socket.emit('rmunread', ({ userId, to }))
    }
    const showContacts = (suser: User) => (

        <div className={classnames("list p-3", { 'active': suser.id === selected })} key={suser.id} onClick={() => selectedFun(suser.id)}>

            <div className="d-flex align-items-center">
                <div className="avatar">
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                </div>
                <div className="mtext ml-2">
                    <div className="title"><strong>{suser.username}</strong></div>
                    {/* <div className="smessage"><small>Me: i am fine</small></div> */}
                </div>
                {
                    <div className="unread ml-auto">
                        <Badge count={unread.filter(r => (((r.senderId === suser.id) && (r.to === user.id)) && (r.senderId !== selected))).length} />
                    </div>}
                {showOnlne(user.id)}
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
    const removeUnread = (userId: string, to: string) => {
        socket.emit('rmunread', { userId, to })
    }
    return (
        <div className="container-fluid p-5">
            { useBeforeunload(() => socket.emit('rmonline', user.id))}
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
                    {selected !== '' && <SelectedChat messages={messages} user={user} online={online.filter(o => o.id === selected)[0]} to={selected} toUser={toUser} sendMessage={sendMessage} removeUnread={removeUnread} filterSelected={filterSelected} />}
                </div>
            </div>

        </div>
    )
}

export default Chat
