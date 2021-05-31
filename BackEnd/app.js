const express = require("express");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config();

const userRoute = require('./routes/user.route');
const conversationRoute = require('./routes/conversation.route');
const messageRoute = require('./routes/message.route');

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

app.use(express.json());

app.get('/api', (req, res) => {
  res.send('We are on API Home');
});

// API Routes
app.use('/api/users', userRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);

mongoose.Promise = Promise;

var mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
};
const port = process.env.PORT || 3000;

//DB Config
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, mongooseOptions)
  .then(() => {
    console.log("DataBase Connection Successful!");
    app.listen(port);
    console.log(`Server running on port ${port}`)
  })
  .catch(err => {
    console.log("DataBase Connection Failed!" + err);
  });


module.exports = app;