const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.send(404);
    throw new Error("UserId param not sent with req");
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChat = expressAsyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = expressAsyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.users) {
    res.send(400).send({ message: "Please provide all fields" });
  }
  const { name } = req.body;
  var users = JSON.parse(req.body.users);

  if (users.length > 2) {
    return res
      .send(400)
      .send("More than 2 users are require4d to create a group");
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = expressAsyncHandler(async (req, res) => {
  if (!req.body.chatName || !req.body.chatId) {
    return res.send(400).send("chatName and chatId both are required");
  }
  try {
    const { chatName, chatId } = req.body;
    const updateGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updateGroupChat) {
      res.status(400).send("Chat not found");
    } else {
      res.json(updateGroupChat);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const addToGroup = expressAsyncHandler(async (req, res) => {
  if (!req.body.userId || !req.body.chatId) {
    res.send(400).send("userID and chatId both are required");
  }
  try {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(added);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

const removeFromGroup = expressAsyncHandler(async (req, res) => {
  if (!req.body.userId || !req.body.chatId) {
    return res.send(400).send("userID and chatId both are required");
  }
  try {
    const { userId, chatId } = req.body;

    const removedFromGroup = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removedFromGroup) {
      res.status(400).send("Group not found");
    } else {
      res.json(removedFromGroup);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
