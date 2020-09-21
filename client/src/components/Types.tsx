export interface Messages {
    senderId: string,
    username: string,
    nicname: string,
    message: string,
    date: string,
    to: string,
}
export interface User {
    id: string,
    username: string,
    nicname: string
}
export interface Online {
    id: string,
    date: string,
    status: boolean
}