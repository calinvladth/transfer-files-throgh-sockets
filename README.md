## File transfer through web sockets

Transfer files to multiple devices using the browser

## How it works

This is a file transfer through sockets. My idea was using the browser to transfer files on multiple devices in the same time.

The sending and receiving works on any direction because each connection has it's own collection of connections.

My use case: I want to transfer files easily across multiple devices and platforms.

**The server will not store the files. When a chunk of file is received, the server will forward it to the collection.**

---

#### Steps to start client

1. `$ yarn install`
2. `$ yarn start`

#### Steps to start server

1. `$ yarn install`
2. `$ yarn start`

## Video walkthrough

[![Watch the video](https://i.vimeocdn.com/video/1980609992-1c5e5431782b57f8fc9d46a9051c52a204c6694382619a7b3cbbda7e894ec6ec-d?mw=2000&mh=1127&q=70)](https://vimeo.com/1055107173)

## Server Endpoints

### /signup

You can sign up with just a username. If the username is not saved in memory, then it can be used for a new socket connection.

### /check_user

Let's you know if a user is available in the memory. If the username is saved in memory, that means the connection is active.

### /\*

Can serve the react build for production

## Socket connection

Listens to new users.

`username` is required for establishing a connection.

- Saves to memory the new username
- Listens for file chunks sent by the user
- The file chunks will be forwarded to the collection of users, provided by the sender
- When a connection is closed, the username is removed from memory
