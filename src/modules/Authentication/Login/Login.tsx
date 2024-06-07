"use client";

import { LoginRequest } from "@/interfaces/LoginRequest";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Flex, FormControl, FormLabel, InputRightElement, Button, Spinner, Input, useToast, Text, Link, Box, InputGroup } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";

const Login = () => {
  const { push } = useRouter();
  const toast = useToast();
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingButton(true);
    try {
      const res = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });
      if (!res?.error) {
        toast({
          title: "Success",
          description: `Login Success! Please wait, you will be directed to the home screen`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // redirect to dashboard page
        push("/");
      } else {
        toast({
          title: "Error",
          description: "Username or Password is Incorrect!",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `${error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoadingButton(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });
    setFormData((prevData) => ({
      ...prevData,
      [name]: sanitizedValue,
    }));
  };

  return (
    <Flex bgColor="#0f1824" alignItems="center" justifyContent="center" height="calc(100vh)" border="1px solid green" flexDir="column" rowGap="2rem" paddingX="1rem">
      <Text as="h1" color="white" fontSize="4xl" fontWeight="semibold" whiteSpace="pre-line" textAlign="center">
        {"Megalogic\nPoint of Sales"}
      </Text>
      <Flex padding="1.5rem" backgroundColor="#1c2e45" rounded="0.7rem" maxWidth="md" width="100%" justifyContent="center" flexDirection="column" gap="1rem" marginX="1rem" color="white">
        <Text as="h1" fontSize="2xl" fontWeight="semibold" marginX="auto">
          Login
        </Text>
        <form onSubmit={handleSubmit}>
          <Flex gap="1.5rem" flexDirection="column">
            <FormControl isRequired>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input name="username" value={formData.username} onChange={handleChange} id="username" placeholder="Enter username" bgColor="white" color="black" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="password">Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} id="password" placeholder="Enter password" bgColor="white" color="black" />
                <InputRightElement marginRight="2">
                  <Button name="Toggle password visibility" type="button" onClick={() => setShowPassword((prev) => !prev)} height="8" fontSize="sm" bg="transparent">
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Flex>
          <Button colorScheme="blue" type="submit" width="100%" marginTop="2rem" isDisabled={isLoadingButton}>
            {isLoadingButton ? <Spinner /> : "Login"}
          </Button>
        </form>
        <Text textAlign="center">
          Don&#39;t have an account?{" "}
          <Link onClick={() => push("/register")} color="#3b82f6">
            Register
          </Link>
        </Text>
        <Text textAlign="center">
          Forgot Password?{" "}
          <Link onClick={() => push("/forgot-password")} color="#3b82f6">
            Click Here
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
};

export default Login;
