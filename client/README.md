# README
    
## Goal

The goal is to create a **fiverr like online conversation window**, which supports many friends/conversations online.

## Requirements

Add lib/components/SimpleChat, to support socket.io based, draggable/maximizable online messaging window.

API example:

* onConnected()
* onDisconnected()
* onMessageReceived(when: string, from: string, message: string)
* onMessageSent(when: string, to: string, message: string)
* onMessageFailedToSend(when: string, to: string, message: string, reason: string)
    
## TODOs

1. Support user profile (id, user name, nick name); provide a simple login window to enter user info.

2. Display user profile summary (id, nick name, click or hover to see more) in bubbles, my messages is put in the right-aligned bubbles, others' message is put in the left-aligned bubbles.

3. Support multiple conversations; the left side of the window is used to show the conversation list, the center of the window is to show the current selected conversation, the right side is to show the opponent's info/profile.

