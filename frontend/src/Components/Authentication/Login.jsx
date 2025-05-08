import React, { useState, useEffect } from "react";
import {
  VStack,
  Field,
  Input,
  Button,
  InputGroup,
  Alert,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastStatus, setToastStatus] = useState();
  const [toastMessage, setToastMessage] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
        setToastStatus();
        setToastMessage();
      }, 4000);
    }
  }, [showToast]);

  const submitHandler = async () => {
    if (!email || !password) {
      setShowToast(true);
      setToastStatus("error");
      setToastMessage("Please fill all the details");
      return;
    }
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const data = await axios.post(
      "api/user/login",
      { email, password },
      config
    );
    if (data.data) {
      localStorage.setItem("userInfo", JSON.stringify(data.data));
      navigate("/chats");
    }
    console.log(data, "res");
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
      {showToast && (
        <Alert.Root status={toastStatus} inline={false}>
          <Alert.Indicator />
          <Alert.Title>{toastMessage}</Alert.Title>
        </Alert.Root>
      )}
    </VStack>
  );
};

export default Login;
