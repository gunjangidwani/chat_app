import React, { useState } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  Image,
  Portal,
  Text,
  VStack,
  Field,
  Input,
  Loader,
  Spinner,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import { ChatState } from "../../Context/ChatProvider";

const UpdatGroupChatModal = () => {
  const {
    selectedChat,
    setSelectedChat,
    setUser,
    chats,
    setChats,
    user,
    setFetchAgain,
    fetchAgain,
  } = ChatState();
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      // setChats((prev) => {
      //   const filteredList = prev.filter((u) => u._id !== data._id);
      //   return [data, ...filteredList];
      // });
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      setRenameLoading(false);

      console.log(error);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
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
      console.log(error);
    }
  };
  const removeUser = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      console.log("Admin user can Remove user");
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      // setChats((prev) => {
      //   const filteredList = prev.filter((u) => u._id !== data._id);
      //   return [data, ...filteredList];
      // });
      setOpen(false);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((sel) => sel._id === user1._id)) {
      console.log("user already exist");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      console.log("Admin user can add user");
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      setSelectedChat(data);
      // setChats((prev) => {
      //   const filteredList = prev.filter((u) => u._id !== data._id);
      //   return [data, ...filteredList];
      // });
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <>
      <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Dialog.Trigger asChild>
          <i dispaly={{ base: "flex" }} className="fa-regular fa-eye"></i>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header
                fontSize="35px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
              >
                {selectedChat.chatName}
              </Dialog.Header>
              <Dialog.Body
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
              >
                <Box
                  display="flex"
                  flexDir="row"
                  flexWrap="wrap"
                  w="100%"
                  mt={5}
                >
                  {selectedChat.users?.map((user) => (
                    <UserBadgeItem
                      user={user}
                      handleFunction={() => removeUser(user)}
                    />
                  ))}
                </Box>

                <Field.Root display="flex" flexDirection="row">
                  <Input
                    placeholder="chat Name"
                    mb="2"
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <Button
                    variant="solid"
                    colorPalette="teal"
                    ml={1}
                    loading={renameLoading}
                    onClick={handleRename}
                  >
                    Update
                  </Button>
                </Field.Root>
                <Field.Root>
                  <Input
                    placeholder="Add Users eg: John, Rita, etc."
                    p="2"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </Field.Root>

                {loading ? (
                  <Spinner />
                ) : (
                  searchResult
                    ?.slice(0, 4)
                    .map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleAddUser(user)}
                      />
                    ))
                )}
              </Dialog.Body>
              <Dialog.Footer justifyContent="center">
                <Dialog.ActionTrigger asChild>
                  <Button
                    backgroundColor="tomato"
                    color="white"
                    onClick={() => removeUser(user)}
                    variant="outline"
                  >
                    Leave Group
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default UpdatGroupChatModal;
