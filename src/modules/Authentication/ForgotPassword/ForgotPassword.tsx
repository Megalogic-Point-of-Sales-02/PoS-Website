"use client";

import { ForgotPasswordRequest } from "@/interfaces/ForgotPasswordRequest";
import { Flex, FormControl, FormLabel, InputRightElement, Button, Spinner, Input, useToast, Text, Link, Box, InputGroup } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ForgotPassword = () => {
  const { push } = useRouter();
  const toast = useToast();
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [formData, setFormData] = useState<ForgotPasswordRequest>({
    email: "",
    reset_token: "",
    reset_token_expiration: new Date(),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingButton(true);
    try {
      const response = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        // Wait for the message
        const errorMessage = await response.json();
        console.log("error message:", errorMessage);
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
        console.log("error message:", message);
        // Create a success toast
        toast({
          title: "Success",
          description: message.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // Set the form data back to the default
        setFormData({
          email: "",
          reset_token: "",
          reset_token_expiration: new Date(),
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
    <Flex bgColor="#0f1824" alignItems="center" justifyContent="center" height="calc(100vh)" border="1px solid green" flexDir="column" rowGap="2rem" paddingX="1rem">
      <Text as="h1" color="white" fontSize="4xl" fontWeight="semibold" whiteSpace="pre-line" textAlign="center">
        {"Megalogic\nPoint of Sales"}
      </Text>
      <Flex padding="1.5rem" backgroundColor="#1c2e45" rounded="0.7rem" maxWidth="md" width="100%" justifyContent="center" flexDirection="column" gap="1rem" marginX="1rem" color="white">
        <Text as="h1" fontSize="2xl" fontWeight="semibold" marginX="auto">
          Forgot Password
        </Text>
        <form onSubmit={handleSubmit}>
          <Flex gap="1.5rem" flexDirection="column">
            <Text>A link to reset your password will be sent to your email.</Text>
            <FormControl isRequired>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} id="email" placeholder="Enter Email" bgColor="white" color="black" />
            </FormControl>
          </Flex>
          <Button colorScheme="blue" type="submit" width="100%" marginTop="2rem" isDisabled={isLoadingButton}>
            {isLoadingButton ? <Spinner /> : "Submit"}
          </Button>
        </form>
        <Text textAlign="center">
          Still remember your password?{" "}
          <Link onClick={() => push("/login")} color="#3b82f6">
            Login
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
};

export default ForgotPassword;
