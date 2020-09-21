import React, { createRef, useEffect, useState } from 'react'
import { Messages, User, Online } from './Types'
import { Input, Button } from 'antd'
/* import { Element, scroller, animateScroll as scroll } from 'react-scroll' */
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')
timeAgo.format(new Date())
interface Prop {
    user: User
    messages: Messages[]
    to: string
    toUser: User | null
    online: Online
    sendMessage: (senderId: string, username: string, nicname: string, message: string, to: string) => void
    removeUnread: (userId: string, to: string) => void
    filterSelected: (userId: string, to: string) => void
}
const SelectedChat = ({ messages, user, online, to, toUser, sendMessage, removeUnread, filterSelected }: Prop) => {
    const [userMessages, setUserMessages] = useState<(Messages | null)[]>()
    const [value, setValue] = useState('')
    const date = new Date(online.date)
    const btnRef = createRef<HTMLButtonElement>()
    useEffect(() => {
        let msgs = messages.map(message => {
            if ((message.senderId === user.id && message.to === to) || (message.senderId === to && message.to === user.id))
                return message
            return null
        })
        msgs = msgs.filter(msg => msg !== null)
        setUserMessages(msgs)
        if (to !== '')
            filterSelected(user.id, to)
        //scroll.scrollToBottom({to:'msginput',containerId :'mbody'})

       /*  scroller.scrollTo('messageBox', {
            duration: 500,
            delay: 100,
            smooth: true,
            containerId: 'mbody',
        }) */

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages, to])
 
    useEffect(() => {
        removeUnread(user.id, to)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [to])

    function scrollToBottom() {


        var objDiv = document.getElementById("mbody");
        if (objDiv)
            objDiv.scrollTop = objDiv.scrollHeight;
    }
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
                                <div className="d-flex align-items-center">
                                    <strong>{message.username}</strong>
                                    <small className="ml-2 text-muted">{getDateTime(message.date)}</small>
                                </div>

                            </div>
                            {message.message}

                        </div>


                    </div> : <div key={index} className="leftside py-2 px-4 mb-2">
                        <div className="message">
                            <div className="time text-right">
                                <div className="d-flex align-items-center">
                                    <strong>  {message && message.username}</strong>
                                    <small className="ml-2 text-muted">{message && getDateTime(message.date)}</small>
                                </div>

                            </div>
                            {/* <Element name="messageBox" id="messageBox" className="element"> */}
                                {message && message.message}
                           {/*  </Element> */}

                        </div>


                    </div>
            ))
        }
    }
    return (
        <>
           {   scrollToBottom()}
            <div className="col-md-6 p-0 left-col">
                <div className="upperbox pl-3 d-flex align-items-center">
                    <div className="title"><strong>{toUser && toUser.username}</strong>
                        <div className="d-flex text-muted">
                            <div className="online">
                                <small>{online.status === true ? 'Online' : 'Offline'}</small>
                            </div>
                            <div className="vertical-line mx-2"></div>
                            <div className="online_time">
                                <small> {online.status === true ? 'Active Now' : `Last online ${timeAgo.format(date, 'time')} ago`}</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mbody mb-3 mt-3 px-2" id="mbody">

                    {showMessages()}
                </div>
                <div className="d-flex px-2">
                    <Input placeholder="Type message here" name="msginput" onPressEnter={() => btnRef.current?.click()} className="mr-2" value={value} onChange={(e) => setValue(e.target.value)} />
                    <Button type="primary" ref={btnRef} onClick={sendMessageInput}>Send</Button>
                    {/*  <input className="form-control mr-2" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type message here" /> */}

                    {/*    <button className="btn btn-success" onClick={sendMessageInput}>Send</button> */}
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
                                <div className="ml-4">{toUser && toUser.id}</div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="pf">Username:</div>
                            <div className="ml-auto">
                                <div className="ml-4">{toUser && toUser.username}</div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="pf">Nicname:</div>
                            <div className="ml-auto">
                                <div className="ml-4">{toUser && toUser.nicname}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SelectedChat
