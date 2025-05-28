import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  Box,
  Button,
  Field,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { getSender, getSenderFull } from "../../config/helper";
import ProfileModal from "./ProfileModal";
import UpdatGroupChatModal from "./UpdatGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
// import io from "socket.io-client";
import { useSocketContext } from "../../Context/SocketProvider";
// const ENDPOINT = "http://localhost:5173";
// var socket,
var selectedChatCompare;

const SingleChat = () => {
  const {
    selectedChat,
    setSelectedChat,
    user,
    notification,
    setNotification,
    onlineUsers,
    setOnlineUsers,
    setFetchAgain,
    fetchAgain,
  } = ChatState();
  const { socket } = useSocketContext();
  const [messages, setMessages] = useState([]);
  const [messageLoader, setMessageLoader] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  console.log(istyping, "istyping");

  // useEffect(() => {
  // socket = io(ENDPOINT);
  // socket.emit("setup", user);
  // socket.on("connected", () => {
  //   setSocketConnected(true);
  // });
  // socket.on("getOnlineUsers", (users) => {
  //   setOnlineUsers(users);
  // });
  // if (socket) {
  //   socket.on("typing", () => setIsTyping(true));
  //   socket.on("stop typing", () => setIsTyping(false));
  // }
  // }, [newMessage]);
  const fetchAllMessages = async () => {
    if (selectedChat?._id) {
      setMessageLoader(true);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(
          `/api/message/${selectedChat._id}`,
          config
        );
        setMessageLoader(false);

        setMessages(data);

        socket.emit("join chat", selectedChat._id);
      } catch (error) {
        setMessageLoader(false);

        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchAllMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (socket) {
      socket.on("message received", (newMesssageRecived) => {
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !== newMesssageRecived.chat._id
        ) {
          setNotification([newMesssageRecived, ...notification]);
          setFetchAgain(!fetchAgain);
        } else {
          setMessages([...messages, newMesssageRecived]);
        }
      });
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    }
  });

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const typingHandler = async (e) => {
    setNewMessage(e.target.value);
    //typing indicator message
    if (!socket) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={3}
            fontFamily="Work sans"
            display="flex"
            alignItems="center"
            justifyContent={{ base: "space-between" }}
            w="100%"
          >
            <IconButton
              display={{ base: "28px", md: "none" }}
              onClick={() => setSelectedChat("")}
            >
              <i class="fa-solid fa-arrow-left"></i>
            </IconButton>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {" "}
                {selectedChat.chatName.toUpperCase()}
                <UpdatGroupChatModal />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {messageLoader ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="scollable-div">
                <ScrollableChat messages={messages} />
              </div>
            )}
            {istyping ? (
              <>
                <div class="typing-container">
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                </div>
              </>
            ) : (
              ""
            )}
            <Field.Root onKeyPress={sendMessage} required mt={3}>
              <Input
                variant="outline"
                bg="#E0E0E0"
                placeholder="Enter a Message..."
                p="1.5"
                value={newMessage}
                onChange={typingHandler}
              />
            </Field.Root>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a User to start chat
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
