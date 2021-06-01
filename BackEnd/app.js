const express = require("express");
const app = express();
const http = require('http')
const server = http.createServer(app)
const io = require("socket.io")(server)

const mongoose = require("mongoose");
require('dotenv').config();


//Backend Server Port Config
const port = process.env.PORT || 3000;
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