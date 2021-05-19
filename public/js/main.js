const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});


socket.emit('joinRoom',{username,room});

chatForm.addEventListener('submit',e =>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    console.log(msg);
    socket.emit('ClientMessage',msg);

    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})

//Rooms get
socket.on('roomUsers',({room, users})=>{
   outputRoomName(room);
   ouputUsers(users);
})


socket.on('message',message=>{
    console.log(message);
    outputMessage(message);
    //Scroll down 
    chatMessages.scrollTop= chatMessages.scrollHeight;
});

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML =`	
    <p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to dom 
function outputRoomName(room){
        roomName.innerText = room;
}   

//Add users to Dom 

function ouputUsers(users){
    userList.innerHTML = `${users.map(user=> `<li>${user.username}</li>`).join('')}`;
}