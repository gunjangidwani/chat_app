import React, { useState, useEffect } from "react";
import { VStack, Field, Input, Button, InputGroup } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toaster } from "../ui/toaster";
import { LocalStorage, requestHandler } from "../../config/utils";
import { loginUser } from "../../Api";
const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async () => {
    if (!email || !password) {
      toaster.create({
        description: "Email and password are required",
        type: "error",
      });
      return;
    }
    try {
      const data = { email, password };
      await requestHandler(
        async () => await loginUser(data),
        setLoading,
        (res) => {
          const { data } = res;
          if (data) {
            LocalStorage.set("userInfo", data);
            LocalStorage.set("token", data.token);
            navigate("/chats");
          }
        },
        () => {
          toaster.create({
            description: "Error in Login",
            type: "error",
          });
        }
      );
      // const config = {
      //   headers: {
      //     "Content-type": "application/json",
      //   },
      // };
      // const data = await axios.post(
      //   "api/user/login",
      //   { email, password },
      //   config
      // );
      // if (data.data) {
      //   localStorage.setItem("userInfo", JSON.stringify(data.data));
      //   navigate("/chats");
      // }
    } catch (error) {
      console.log(error);
      toaster.create({
        description: "Error in Login",
        type: "error",
      });
    }
  };

  return (
    <VStack spacing="5px">
      <Field.Root required>
        <Field.Label>
          Email <Field.RequiredIndicator />
        </Field.Label>
        <Input
          value={email}
          p="1.5"
          onChange={(e) => setEmail(e.target.value)}
          name="Enter your Email"
          type="email"
        />
      </Field.Root>

      <Field.Root required>
        <Field.Label>
          Password <Field.RequiredIndicator />
        </Field.Label>
        <InputGroup
          endElement={
            <Button
              size="sm"
              onClick={() => {
                setShow(!show);
              }}
            >
              {" "}
              {show ? "Show" : "hide"}
            </Button>
          }
        >
          <Input
            value={password}
            p="1.5"
            onChange={(e) => setPassword(e.target.value)}
            name="Enter your Password"
            type={show ? "text" : "password"}
          />
        </InputGroup>
      </Field.Root>
      <Button w="100%" alignSelf="center" onClick={submitHandler}>
        Login
      </Button>
      <Button
        variant="solid"
        backgroundColor="tomato"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
        w="100%"
        alignSelf="center"
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
