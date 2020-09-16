# README
    
## Goal

The goal is to create a fiverr like online conversation window, which supports many friends/conversations online.

## Requirements

Add lib/components/SimpleChat, to support socket.io based, draggable/maximizable online messaging window.

API example:
    onConnected()
    onDisconnected()
    onMessageReceived(when: string, from: string, message: string)
    onMessageSent(when: string, to: string, message: string)
    onMessageFailedToSend(when: string, to: string, message: string, reason: string)
