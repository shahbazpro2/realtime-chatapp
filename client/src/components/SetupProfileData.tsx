import React, { useEffect, useState } from 'react'
import { Form, Input, Button } from 'antd';
import io from 'socket.io-client'
import socketLink from '../socketContext'
interface FormData {
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
const SetupProfileData = ({ history }: Props) => {
    
    const [form, setForm] = useState<FormData>({ id: '', username: '', nicname: '' })
    useEffect(() => {
        socket = io(socketLink)
        socket.on('joined', (data: FormData) => {
            localStorage.setItem('userData', JSON.stringify(data))
            history.push('/chat')
        })
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        if (userData.id) {
            history.push('/chat')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const changeInput = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    const submitForm = () => {
        if (form.username !== '' && form.id !== '' && form.nicname !== '')
            socket.emit('join', { id: form.id, username: form.username, nicname: form.nicname })
    }
    return (
        <div className="container">
            <div className="row justify-content-center" style={{ height: '100vh' }}>
                <div className="col-md-6 py-5">
                    <h1 className="text-center py-5">Setup Profile Data</h1>
                    <div className="m-auto" style={{ width: '50%' }}>
                        <Form
                            layout="vertical"
                        >
                            <Form.Item label="Id">
                                <Input placeholder="id placeholder" name="id" value={form.id} onChange={changeInput} />
                            </Form.Item>
                            <Form.Item label="Username">
                                <Input placeholder="username placeholder" value={form.username} name="username" onChange={changeInput} />
                            </Form.Item>
                            <Form.Item label="Nicname">
                                <Input placeholder="nicname placeholder" value={form.nicname} name="nicname" onChange={changeInput} />
                            </Form.Item>
                            <Form.Item >
                                <Button style={{ width: '100%' }} type="primary" onClick={submitForm}>Submit</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SetupProfileData
