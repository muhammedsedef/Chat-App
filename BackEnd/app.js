const express = require('express');
const socket = require('socket.io');
const app = express();
const path = require('path');
const port = process.env.PORT || 8000;

const mongoose = require("mongoose");
require('dotenv').config();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({});
  };
  next();
});


//BACKEND SERVER
const server = app.listen(port, () => {

//Backend Server Port Config
  console.log(`Server running on port ${port}`)
 })


//SOCKET Implementation

let users = []

//Taking all active user 
const addUser = (userId, socketId) => {
  !users.some(user => user.userId === userId) &&
    users.push({ userId, socketId })
    console.log(users)
}

//To remove user who left the chat to users array
const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
  return users.find(user => user.userId === userId)
}

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})
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
    console.log(receiverId)
    const user = getUser(receiverId)
    try {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text
      })
    }catch (e){
      console.log(e)
    }
  })
  //Send and get group message
     socket.on("sendGroupMessage", ({senderId, receiversIds, text})=> {
        receiversIds.forEach(receiverId => {
            const user = getUser(receiverId)       
            io.to(user.socketId).emit("getMessage", {
                      senderId,
                      text       
                    })     
                  });  
                })


  //When Disconnect someone
  socket.on('disconnect', () => {
    console.log('user disconnect')
    removeUser(socket.id)
    io.emit("getUsers", users)
  })

  socket.on('forceDisconnect', () => {
    socket.disconnect();
    removeUser(socket.id)
    io.emit("getUsers", users)
});

});

const userRoute = require('./routes/user.route');
const conversationRoute = require('./routes/conversation.route');
const messageRoute = require('./routes/message.route');
const { remove } = require('./models/User.model');

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
