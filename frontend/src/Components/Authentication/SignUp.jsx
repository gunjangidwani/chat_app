import { VStack, Field, Input, Button, InputGroup } from "@chakra-ui/react";

import React, { useState } from "react";

const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);

  const submitHandler =() =>{}

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
          onChange={(e) => setPic(e.target.files[0])}
          p="1.5"
          accept="image/*"
          type="file"
        />
      </Field.Root>

      <Button type="submit" w="100%" alignSelf="center" onClick={submitHandler}>
        Sign up
      </Button>
    </VStack>
  );
};

export default SignUp;
