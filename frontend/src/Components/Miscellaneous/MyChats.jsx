import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import ChatLoading from "./ChatLoading";
import { getSender, getSenderFull } from "../../config/helper";
import GroupChatModal from "./GroupChatModal";
import { useSocketContext } from "../../Context/SocketProvider";
import { toaster } from "../ui/toaster";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    fetchAgain,
    setNotification,
  } = ChatState();
  const { onlineUsers } = useSocketContext();
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/chat`, config);
      setChats(data);
      if (data.length) {
        let unReadCount = data.filter(
          (chat) =>
            chat.latestMessageReadBy?.length > 0 &&
            !chat.latestMessageReadBy.includes(user._id)
        );
        setNotification(unReadCount);
      }
    } catch (error) {
      toaster.create({
        description: error.message,
        type: "error",
      });
    }
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      flexDir="column"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My chats
        <GroupChatModal user={user}>
          <Button
            // ml={5}
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          >
            New Group Chats
            <i className="fa-solid fa-plus"></i>
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => {
                  setSelectedChat(chat);
                }}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={3}
                borderRadius="lg"
                key={chat._id}
                position="relative"
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {!chat?.isGroupChat &&
                onlineUsers.length &&
                onlineUsers.includes(
                  getSenderFull(loggedUser, chat.users)._id
                ) ? (
                  <span className="online-user"></span>
                ) : null}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
