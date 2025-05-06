const express = require('express');
const chats = require('./data/data');
const app = express();
const dotenv = require("dotenv");
const connectDB = require('./config/db');
dotenv.config();
const PORT = process.env.PORT || 5000
connectDB();

app.get('/', (req, res) => {
  res.send("API is running")
})

app.get("/app/chat/:id", (req, res) => {
  console.log(req.params.id)
  const singleChat = chats.find(chat => chat._id === req.params.id)
  res.send(singleChat);
});

app.get('/app/chat', (req, res) => {
  res.send(chats);
})

app.listen(PORT, console.log("server started on0-0..", PORT));
