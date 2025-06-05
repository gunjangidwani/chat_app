import { Box, Container, Text, Tabs } from '@chakra-ui/react'
import React, { useState, useEffect } from "react";
import Login from "../Components/Authentication/SignUp";
import SignUp from "../Components/Authentication/Login";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  const [value, setValue] = useState("first");
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      navigate("/chats");
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);
  return (
    <Container maxW={"xl"} centerContent>
      <Box
        d={"flex"}
        justifyContent={"center"}
        p={"3"}
        bg={"white"}
        w={"100%"}
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        color="black"
      >
        <Text fontFamily="work sans" fontSize="4xl">
          ConvoCloud
        </Text>
      </Box>
      <Box bg={"white"} w={"100%"} borderRadius="lg" p="4">
        <Tabs.Root
          d="flex"
          justifyContent={"center"}
          size="md"
          colorPalette="teal"
          variant="line"
          value={value}
          onValueChange={(e) => setValue(e.value)}
        >
          <Tabs.List mb="1em">
            <Tabs.Trigger
              display="flex"
              justifyContent="center"
              w="50%"
              value="first"
            >
              Login
            </Tabs.Trigger>
            <Tabs.Trigger
              display="flex"
              justifyContent="center"
              w="50%"
              value="second"
            >
              Sign Up
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="first">
            <Login />
          </Tabs.Content>
          <Tabs.Content value="second">
            <SignUp />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default Homepage