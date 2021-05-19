const  path =require('path')
const express = require('express')
const http = require('http');
const socketio = require('socket.io');
const formatMessage= require('./utils/messages');
const {userJoin,
    getCurrentUser,
    userleave,
    getRoomUsers} = require('./utils/users');

const app = new express()
const server = http.createServer(app);
const io = socketio(server);
const botName= 'chat Bot ';

app.use(express.static(path.join(__dirname,'public')));

io.on('connection',socket =>{
    console.log("New WS Connection...");

    socket.on('joinRoom',({username,room})=>{
        const user  = userJoin(socket.id,username,room)

        socket.join(user.room);
        socket.emit('message',formatMessage(username,'Welcome to the chat bot...'));

        //socket.emit('message', 'Welcome');
        socket.broadcast
        .to(room)
        .emit('message',formatMessage(username,`${user.username} has joined the chat`));

          //send Rooms  and users

        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users : getRoomUsers(user.room)
        })
    })
   
    // Listen for the message 
    socket.on('ClientMessage',(MSG)=>{
        const user  = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,MSG))
    });

    //Listen for disconnection
    socket.on('disconnect',()=>{
        const user  = userleave(socket.id);
        if(user){
        io.to(user.room).emit('message',formatMessage(user.username,`${user.username} has left the chat...`))

          //send Rooms  and users

            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users : getRoomUsers(user.room)
            })
        }
    })

  
}) 

const PORT= 8080|| process.env.PORT;
server.listen (PORT, ()=> console.log(`Server started at port ${PORT}`));
