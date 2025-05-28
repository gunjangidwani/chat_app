const express = require('express');
const chats = require('./data/data');
const app = express();
const http = require("http");
app.use(express.json()); // to accept Json  Data

const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { Server } = require("socket.io");
dotenv.config();
const PORT = process.env.PORT || 5000;
connectDB();
const httpServer = http.createServer(app);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const io = new Server(httpServer, {
  // pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    io.emit("connected");
    if (userData._id !== "undefined") {
      console.log(userData._id, "user chat logged in");
      userSocketMap[userData._id] = socket.id;
    }

    // io.emit  events send to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });
  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
    delete userSocketMap[userData._id];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

httpServer.listen(PORT, console.log("server started on0-0..", PORT));