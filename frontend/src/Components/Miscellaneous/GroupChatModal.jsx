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
import { toaster } from "../ui/toaster";
const GroupChatModal = ({ children, user }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { selectedChat, setSelectedChat, setUser, chats, setChats } =
    ChatState();
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
      toaster.create({
        description: error.message,
        type: "error",
      });
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toaster.create({
        description: "Please fill all the fields",
        type: "error",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setOpen(false);
    } catch (error) {
      toaster.create({
        description: error.message,
        type: "error",
      });
    }
  };
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toaster.create({
        description: "User alrady Added",
        type: "info",
      });
    } else {
      setSelectedUsers([...selectedUsers, userToAdd]);
    }
  };

  const removeUser = (user) => {
    setSelectedUsers((prev) => {
      const filteredList = prev.filter((u) => u._id !== user._id);
      return [...filteredList];
    });
  };

  return (
    <>
      <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Dialog.Trigger asChild>
          {children ? (
            <span> {children} </span>
          ) : (
            <i dispaly={{ base: "flex" }} className="fa-regular fa-eye"></i>
          )}
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
                Create Group Chat
              </Dialog.Header>
              <Dialog.Body
                // fontSize={40}
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                // gap={10}
              >
                <Field.Root>
                  <Input
                    placeholder="Group chat Name"
                    mb="2"
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                </Field.Root>
                <Field.Root>
                  <Input
                    placeholder="Add Users eg: John, Rita, etc."
                    p="2"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </Field.Root>
                <Box
                  display="flex"
                  flexDir="row"
                  flexWrap="wrap"
                  w="100%"
                  mt={5}
                >
                  {selectedUsers?.map((user) => (
                    <UserBadgeItem
                      user={user}
                      handleFunction={() => removeUser(user)}
                    />
                  ))}
                </Box>

                {loading ? (
                  <Spinner />
                ) : (
                  searchResult
                    ?.slice(0, 4)
                    .map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleGroup(user)}
                      />
                    ))
                )}
              </Dialog.Body>
              <Dialog.Footer justifyContent="center">
                {/* <Dialog.ActionTrigger asChild> */}
                <Button
                  backgroundColor="blue.400"
                  color="white"
                  onClick={handleSubmit}
                  variant="outline"
                >
                  Create
                </Button>
                {/* </Dialog.ActionTrigger> */}
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

export default GroupChatModal;
