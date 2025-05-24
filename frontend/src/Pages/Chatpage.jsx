import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/Miscellaneous/SideDrawer";
import ChatBox from "../Components/Miscellaneous/ChatBox";
import MyChats from "../Components/Miscellaneous/MyChats";
const Chatpage = () => {
  const [chats, setchats] = useState([]);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default Chatpage