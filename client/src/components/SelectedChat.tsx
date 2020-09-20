import React, { useEffect, useState } from 'react'
import { Messages, User } from './Types'

interface Prop {
    user: User
    messages: Messages[]
    to: string
    toUser: User | null
    sendMessage: (senderId: string, username: string, nicname: string, message: string, to: string) => void
}
const SelectedChat = ({ messages, user, to, toUser, sendMessage }: Prop) => {
    const [userMessages, setUserMessages] = useState<(Messages | null)[]>()
    const [value, setValue] = useState('')
    useEffect(() => {
        let msgs = messages.map(message => {
            if ((message.senderId === user.id && message.to === to) || (message.senderId === to && message.to === user.id))
                return message
            return null
        })
        msgs = msgs.filter(msg => msg !== null)
        setUserMessages(msgs)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages, to])
    const sendMessageInput = () => {
        if (value !== '')
            sendMessage(user.id, user.username, user.nicname, value, to)

        setValue('')
    }
    const getDateTime = (date: string) => {
        var today = new Date(date);
        return `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}  ${(today.getHours() + 24) % 12 || 12}:${today.getMinutes() < 10 ? `0${today.getMinutes()}` : today.getMinutes()}`

    }
    const showMessages = () => {
        if (userMessages && userMessages.length > 0) {
            return userMessages.map((message, index) => (
                message && message.senderId === user.id ?
                    <div key={index} className="rightside py-2 px-4 mb-2">
                        <div className="message">
                            <div className="time text-right">
                                <div className="d-flex font-weight-bold align-items-center">
                                    {message.username}
                                    <small className="ml-2 text-muted">{getDateTime(message.date)}</small>
                                </div>

                            </div>
                            {message.message}

                        </div>


                    </div> : <div key={index} className="leftside py-2 px-4 mb-2">
                        <div className="message">
                            <div className="time text-right">
                                <div className="d-flex font-weight-bold align-items-center">
                                    {message && message.username}
                                    <small className="ml-2 text-muted">{message && getDateTime( message.date)}</small>
                                </div>

                            </div>
                            {message && message.message}

                        </div>


                    </div>
            ))
        }
    }
    return (
        <>
            <div className="col-md-6 p-0 left-col">
                <div className="upperbox align-items-center d-flex pl-3">
                    <div className="title"><strong>{toUser && toUser.username}</strong></div>
                </div>
                <div className="mbody mb-3 mt-3 px-2">

                    {showMessages()}
                </div>
                <div className="d-flex px-2">
                    <input className="form-control mr-2" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type message here" />
                    <button className="btn btn-success" onClick={sendMessageInput}>Send</button>
                </div>
            </div>
            <div className="col-md-3 pl-0">
                <div className="upperbox">

                </div>
                <div className="profile p-3">
                    <h5>About</h5>
                    <div className="mt-3">
                        <div className="d-flex align-items-center">
                            <div className="pf">Id:</div>
                            <div className="ml-auto">
                                <small className="ml-4">{toUser && toUser.id}</small>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="pf">Username:</div>
                            <div className="ml-auto">
                                <small className="ml-4">{toUser && toUser.username}</small>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="pf">Nicname:</div>
                            <div className="ml-auto">
                                <small className="ml-4">{toUser && toUser.nicname}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SelectedChat
