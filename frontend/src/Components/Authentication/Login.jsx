import React, {useState} from 'react'
import { VStack, Field, Input, Button, InputGroup } from "@chakra-ui/react";

const Login = () => {
    const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const submitHandler = () => {};
  
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
      <Button  w="100%" alignSelf="center" onClick={submitHandler}>
        Login
      </Button>
      <Button variant="solid" backgroundColor="tomato" onClick={() => {
        setEmail('guest@example.com');
        setPassword('123456')
      }

      } w="100%" alignSelf="center" >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
}

export default Login