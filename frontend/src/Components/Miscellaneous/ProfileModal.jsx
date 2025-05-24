import React, { useState } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  Image,
  Portal,
  Text,
} from "@chakra-ui/react";
const ProfileModal = ({ children, user }) => {
  const [open, setOpen] = useState(false);
  console.log(open);
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
                fontSize={40}
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
              >
                <Dialog.Title p="10" fontSize={40}>{user.name}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body
                fontSize={40}
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                gap={10}
              >
                <Image
                  borderRadius="full"
                  boxSize="150px"
                  alt={user.name}
                  src={user.pic}
                />
                <Text
                  fontSize={{ base: "28px", md: "30px" }}
                  fontFamily="Work sans"
                >
                  Email: {user.email}
                </Text>
              </Dialog.Body>
              <Dialog.Footer justifyContent="center">
                <Dialog.ActionTrigger asChild>
                  <Button colorScheme="blue" mr={3} variant="outline">
                    Close
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

export default ProfileModal;
