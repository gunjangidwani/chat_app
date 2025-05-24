import {
  Avatar,
  Box,
  Button,
  Menu,
  Portal,
  Text,
  Drawer,
  CloseButton,
  Input,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Tooltip } from "../ui/tooltip";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

const SideDrawer = () => {
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const handleSearch = async () => {
    console.log(search);
    // handle error with toast
    if (!search) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          // "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setOpenDrawer(false);
    } catch (error) {
      setLoadingChat(false);
      console.log(error);
    }
  };

  const leftDrawer = () => {
    return (
      <Drawer.Root
        placement="start"
        open={openDrawer}
        onOpenChange={(e) => setOpenDrawer(e.open)}
      >
        <Drawer.Trigger asChild>
          <Button variant="ghost">
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Search Users</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Box pb={2} display="flex">
                  <Input
                    placeholder="search by name or email"
                    mr={2}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button onClick={handleSearch}> Go</Button>
                </Box>
                {loading ? (
                  <ChatLoading />
                ) : (
                  searchResult.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={accessChat}
                    />
                  ))
                )}
                {loadingChat && <Spinner ml="auto" display="flex" />}
              </Drawer.Body>
              <Drawer.Footer>
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </Drawer.Footer>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    );
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip
          showArrow
          content="Search Users to chat"
          contentProps={{ css: { "--tooltip-bg": "tomato" } }}
        >
          {leftDrawer()}
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button fontSize="2xl" p={1} bg="white" color="black">
                <i className="fa-solid fa-bell"></i>
              </Button>
            </Menu.Trigger>
          </Menu.Root>
          <Menu.Root closeOnSelect={false}>
            <Menu.Trigger asChild>
              <Button p={1} bg="white" color="black">
                <Avatar.Root size="sm" cursor="pointer">
                  <Avatar.Fallback name={user.name} />
                  <Avatar.Image src={user.pic} />
                </Avatar.Root>
                <i className="fa-solid fa-chevron-down"></i>
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="user-profile">
                    <ProfileModal user={user}>My Profile</ProfileModal>
                  </Menu.Item>
                  <Menu.Separator />
                  <Menu.Item onClick={logoutHandler} value="user-logout">
                    Logout
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </div>
      </Box>
    </>
  );
};

export default SideDrawer;
