const express = require('express');
const chats = require('./data/data');
const app = express();

app.use(express.json()); // to accept Json  Data

const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
dotenv.config();
const PORT = process.env.PORT || 5000;
connectDB();

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, console.log("server started on0-0..", PORT));
