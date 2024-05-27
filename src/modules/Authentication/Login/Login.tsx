"use client";

import { LoginRequest } from "@/interfaces/LoginRequest";
import { Flex, FormControl, FormLabel, Select, Button, Spinner, Input, useToast, Text } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
  const { push } = useRouter();
  const toast = useToast();
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
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
        callbackUrl: "/",
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
        console.log("res error: ", res.error);
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(formData);
  };

  return (
    <Flex alignItems="center" justifyContent="center">
      <Flex padding="1.5rem" backgroundColor="#1c2e45" rounded="0.7rem" maxWidth="md" width="100%" justifyContent="center" flexDirection="column" gap="1rem" marginX="1rem">
        <Text as="h1" fontSize="2xl" fontWeight="semibold" marginX="auto">
          Login
        </Text>
        <form onSubmit={handleSubmit}>
          <Flex gap="1.5rem" flexDirection="column">
            <FormControl isRequired>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input name="username" value={formData.username} onChange={handleChange} id="username" placeholder="Enter username" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input type="password" name="password" value={formData.password} onChange={handleChange} id="password" placeholder="Enter password" />
            </FormControl>
          </Flex>
          <Button type="submit" width="100%" marginTop="2rem" isDisabled={isLoadingButton}>
            {isLoadingButton ? <Spinner /> : "Login"}
          </Button>
        </form>
      </Flex>
    </Flex>
  );
};

export default Login;
