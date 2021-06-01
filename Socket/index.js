
const backend = require('../BackEnd/app.js')
console.log("socket file running")

var io = require('socket.io')(backend.server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
});

io.on("connection", (socket) => {
  //when connect
  console.log("a user connected.");
})