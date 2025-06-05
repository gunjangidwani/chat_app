import { VStack, Field, Input, Button, InputGroup } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toaster } from "../ui/toaster";

const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async () => {
    if (!name || !email || !password || !confirmPassword) {
      toaster.create({
        description: "Please fill all the fields",
        type: "error",
      });
      return;
    }
    if (password !== confirmPassword) {
      toaster.create({
        description: "Password do not match",
        type: "error",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const data = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );
      if (data.status === 201) {
        localStorage.setItem("userInfo", JSON.stringify(data.data));
        navigate("/chats");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toaster.create({
        description: error.message,
        type: "error",
      });
    }
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
            toaster.create({
              description: "Successfully uploaded image",
              type: "success",
            });
            setPic(data.url.toString());
            setLoading(false);
          })
          .catch((err) => {
            toaster.create({
              description: "Please Upload a image file ",
              type: "error",
            });
            setLoading(false);
          });
      }
    } else {
      toaster.create({
        description: "Please Select an Image!",
        type: "warning",
      });
      setLoading(false);
    }
  };

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
    </VStack>
  );
};

export default SignUp;
