const express = require('express');
const socket = require('socket.io');
const app = express();
const server = require('http').createServer(app);
const path = require('path');

const mongoose = require("mongoose");
require('dotenv').config();

<<<<<<< HEAD
=======

//BACKEND SERVER
const server = app.listen(port, () => {

>>>>>>> 8d6698380191bcededf24a20af4e61e80bcb3e71

//Backend Server Port Config
const port = process.env.PORT || 3000;
server.listen(port, () => {
<<<<<<< HEAD
=======

>>>>>>> 8d6698380191bcededf24a20af4e61e80bcb3e71
  console.log(`Server running on port ${port}`)
})

//SOCKET Implementation

let users = []

//Taking all active user 
const addUser = (userId, socketId) => {
  !users.some(user => user.userId === userId) &&
    users.push({ userId, socketId })
}

//To remove user who left the chat to users array
const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
  return users.find(user => user.userId === userId)
}

const io = socket(server)
//When Connect Someone
io.on("connection", (socket) => {
  console.log("a user connected");
  //take userId and socketId from user
  socket.on("addUser", userId => {
    addUser(userId, socket.id)
    io.emit("getUsers", users)
  })

  //Send and get message
  socket.on("sendMessage", ({senderId, receiverId, text})=> {
    const user = getUser(receiverId)
    io.to(user.socketId).emit("getMessage", {
      senderId, 
      text
    })
  })


  //When Disconnect someone
  socket.on('disconnect', () => {
    console.log('user disconnect')
    removeUser(socket.id)
    io.emit("getUsers", users)
  })
});

const userRoute = require('./routes/user.route');
const conversationRoute = require('./routes/conversation.route');
const messageRoute = require('./routes/message.route');

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../FrontEnd', 'index.html'));
});
app.get('/api', (req, res) => {
  res.send('We are on API Home');
});

// API Routes
app.use('/api/users', userRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);


//DB Config
mongoose.Promise = Promise;

var mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
};

//DB Config
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, mongooseOptions)
  .then(() => {
    console.log("DataBase Connection Successful!");
  })
  .catch(err => {
    console.log("DataBase Connection Failed!" + err);
  });


module.exports = app;