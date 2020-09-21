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

## Bugs

1. When press the ENTER key, nothing happens. It should either feed new line to the in-editing message or send the message.

2. In the top of the leftside bar, there is a search bar, which supports instant searching of conversations by texts appeared in opponents' profile.

3. The time and the sender of the message should be displayed beside and above the message bubbles.

4. A badge of the number of unread messages should be displayed for each conversation in the leftside bar.

5. On the rightside bar, the value of each line of opponent's profile should be right aligned.

6. On the top of the center, the status (online / offline) and the last seen time should be displayed for the opponent.

7. On the rightside bar, the status (online / offline) should be displyed for each conversation.
