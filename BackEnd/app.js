const express = require("express");
const app = express();
const http = require('http')
const server = http.createServer(app)
const io = require("socket.io")(server)
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


//Backend Server Port Config
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`)
});


io.on("connection", (socket) => {
  console.log("connected");
  
  socket.on('disconnect', () => {
    console.log('user disconnect')
  })
});


const userRoute = require('./routes/user.route');
const conversationRoute = require('./routes/conversation.route');
const messageRoute = require('./routes/message.route');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello there');
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


//SOCKET 


module.exports = app;