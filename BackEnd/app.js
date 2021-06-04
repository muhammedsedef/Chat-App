const express = require('express');
const socket = require('socket.io');
const app = express();
const server = require('http').createServer(app);
const path = require('path');

const cors = require("cors");

app.use(cors());

const mongoose = require("mongoose");
require('dotenv').config();

/* app.use((req, res, next) => {
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
}); */


//Backend Server Port Config
const port = process.env.PORT || 8000;
server.listen(port, () => {
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
    origin: "https://relaxed-ramanujan-9f8842.netlify.app/",
    credentials: true
  }
})


//When Connect Someone
io.on("connection", (socket) => {
  console.log("a user connected");
  //take userId and socketId from user
  // socket.on("addUser", userId => {
  //   addUser(userId, socket.id)
  //   io.emit("getUsers", users)
  socket.on("addUser", ({ userId, conversationId }) => {
    addUser(userId, socket.id)
    socket.join(conversationId)    
    io.emit("getUsers", users)
    })

  //Send and get message
  socket.on("sendMessage", ({senderId, senderName, receiverId, text})=> {
    const user = getUser(receiverId)
    try {
      io.to(user.socketId).emit("getMessage", {
        name: senderName,
        senderId,
        text
      })
    }catch (e){
      console.log(e)
    }
  })
  
  socket.on("sendGroupMessage", ({senderId, senderName, conversationId, text})=> {
    socket.to(conversationId).emit("getGroupMessage", {
      name: senderName,
      senderId,
      text
    })
  })

  

    // //Send and get group message
    //  socket.on("sendGroupMessage", ({senderId, receiversIds, text})=> {
    //     receiversIds.forEach(receiverId => {
    //         const user = getUser(receiverId)       
    //         io.to(user.socketId).emit("getMessage", {
    //                   senderId,
    //                   text       
    //                 })     
    //               });  
    //             })


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

app.use(express.json());

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
