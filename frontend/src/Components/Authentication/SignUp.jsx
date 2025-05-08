import {
  VStack,
  Field,
  Input,
  Button,
  InputGroup,
  Alert,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastStatus, setToastStatus] = useState();
  const [toastMessage, setToastMessage] = useState();
  const navigate = useNavigate();

  const submitHandler = () => {
    if (!name || !email || !password || !confirmPassword) {
      setShowToast(true);
      setToastStatus("error");
      setToastMessage("Please fill all the details");
      return;
    }
    if (password !== confirmPassword) {
      setShowToast(true);
      setToastStatus("error");
      setToastMessage("Password do not match");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const data = axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );
      if (data.status === 200) {
        localStorage.setItem("userInfo", JSON.stringify(data.data));
        navigate("/chats");
        console.log(data);
      }
      setLoading(false);
    } catch (error) {}
  };

  const uploadCloudaryPic = (file) => {
    setLoading(true);
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "MERN-CHAT-APP");
        data.append("cloud_name", "gunjangid");
        fetch("https://api.cloudinary.com/v1_1/gunjangid/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            setShowToast(true);
            setToastStatus("success");
            setToastMessage("Successfully uploaded image");
            setPic(data.url.toString());
            console.log(data.url.toString());
            setLoading(false);
          })
          .catch((err) => {
            setShowToast(true);
            setToastStatus("error");
            setToastMessage("Please Upload a image file ");
            console.log(err);
            setLoading(false);
          });
      }
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log("File not found");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }
  }, [showToast]);

  return (
    <VStack spacing="5px">
      <Field.Root required>
        <Field.Label>
          Name <Field.RequiredIndicator />
        </Field.Label>
        <Input
          p="1.5"
          onChange={(e) => setName(e.target.value)}
          name="Enter your Name"
        />
      </Field.Root>
      <Field.Root required>
        <Field.Label>
          Email <Field.RequiredIndicator />
        </Field.Label>
        <Input
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
            p="1.5"
            onChange={(e) => setPassword(e.target.value)}
            name="Enter your Password"
            type={show ? "text" : "password"}
          />
        </InputGroup>
      </Field.Root>

      <Field.Root required>
        <Field.Label>
          Confirm Password <Field.RequiredIndicator />
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
            p="1.5"
            onChange={(e) => setConfirmPassword(e.target.value)}
            name="Enter your Password"
            type={show ? "text" : "password"}
          />
        </InputGroup>
      </Field.Root>

      <Field.Root required>
        <Field.Label>
          Upload Picture <Field.RequiredIndicator />
        </Field.Label>
        <Input
          onChange={(e) => uploadCloudaryPic(e.target.files[0])}
          p="1.5"
          accept="image/*"
          type="file"
        />
      </Field.Root>

      <Button
        loading={loading}
        w="100%"
        alignSelf="center"
        onClick={submitHandler}
      >
        Sign up
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

export default SignUp;
