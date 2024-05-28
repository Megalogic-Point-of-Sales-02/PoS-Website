"use client";

import { RegisterRequest } from "@/interfaces/RegisterRequest";
import { Flex, FormControl, FormLabel, Text, Button, Spinner, Input, useToast, Link } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Register = () => {
  const toast = useToast();
  const { push } = useRouter();
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    password: "",
    fullname: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingButton(true);
    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        // Wait for the message
        const errorMessage = await response.json();
        // TODO: Create an error message
        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Wait for the message
        const message = await response.json();
        // Create a success toast
        toast({
          title: "Success",
          description: `Register Successful`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // Set the form data back to the default
        setFormData({
          username: "",
          password: "",
          fullname: "",
        });

        // redirect to login page
        push("/login");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      //   TODO: MAKE ERROR MESSAGE
      toast({
        title: "Error",
        description: "An error occurred while submitting the form.",
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
    <Flex bgColor="#0f1824" alignItems="center" justifyContent="center" height="calc(100vh)" border="1px solid green" flexDir="column" rowGap="2rem">
      <Text as="h1" color="white" fontSize="4xl" fontWeight="semibold" whiteSpace="pre-line" textAlign="center">
        {"Megalogic\nPoint of Sales"}
      </Text>
      <Flex padding="1.5rem" backgroundColor="#1c2e45" rounded="0.7rem" maxWidth="md" width="100%" justifyContent="center" flexDirection="column" gap="1rem" marginX="1rem" color="white">
        <Text as="h1" fontSize="2xl" fontWeight="semibold" marginX="auto">
          Register
        </Text>
        <form onSubmit={handleSubmit}>
          <Flex gap="1.5rem" flexDirection="column">
            <FormControl isRequired>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input name="username" value={formData.username} onChange={handleChange} id="username" placeholder="Enter username" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="fullname">Full Name</FormLabel>
              <Input name="fullname" value={formData.fullname} onChange={handleChange} id="fullname" placeholder="Enter Full Name" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input type="password" name="password" value={formData.password} onChange={handleChange} id="password" placeholder="Enter password" />
            </FormControl>
          </Flex>
          <Button type="submit" width="100%" marginTop="2rem" isDisabled={isLoadingButton}>
            {isLoadingButton ? <Spinner /> : "Register"}
          </Button>
        </form>
        <Text textAlign="center">
          Already have an account?{" "}
          <Link onClick={() => push("/login")} color="#3b82f6">
            Login
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
};

export default Register;
