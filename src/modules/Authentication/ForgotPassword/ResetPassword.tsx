"use client";

import { ResetPasswordRequest } from "@/interfaces/ResetPasswordRequest";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Flex, FormControl, FormLabel, InputRightElement, Button, Spinner, Input, useToast, Text, Link, Box, InputGroup } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ResetPassword = () => {
  const { push } = useRouter();
  const toast = useToast();
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Get the token from the params
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState<ResetPasswordRequest>({
    password: "",
    confirm_password: "",
    reset_token: token || undefined,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingButton(true);
    if (formData.password !== formData.confirm_password) {
      toast({
        title: "Error",
        description: "The password and the confirmation password don't match",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsLoadingButton(false);
      return;
    }

    try {
      const response = await fetch("/api/v2/auth/reset-password", {
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
          description: message.message,
          status: "success",
          duration: 5000,
          isClosable: true,
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
  };

  return (
    <Flex bgColor="#0f1824" alignItems="center" justifyContent="center" height="calc(100vh)" border="1px solid green" flexDir="column" rowGap="2rem" paddingX="1rem">
      <Text as="h1" color="white" fontSize="4xl" fontWeight="semibold" whiteSpace="pre-line" textAlign="center">
        {"Megalogic\nPoint of Sales"}
      </Text>
      <Flex padding="1.5rem" backgroundColor="#1c2e45" rounded="0.7rem" maxWidth="md" width="100%" justifyContent="center" flexDirection="column" gap="1rem" marginX="1rem" color="white">
        <Text as="h1" fontSize="2xl" fontWeight="semibold" marginX="auto">
          Reset Password
        </Text>
        <form onSubmit={handleSubmit}>
          <Flex gap="1.5rem" flexDirection="column">
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
            <FormControl isRequired>
              <FormLabel htmlFor="confirm_password">Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  id="confirm_password"
                  placeholder="Enter confirm password"
                  bgColor="white"
                  color="black"
                />
                <InputRightElement marginRight="2">
                  <Button name="Toggle confirm password visibility" type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} height="8" fontSize="sm" bg="transparent">
                    {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Flex>
          <Button colorScheme="blue" type="submit" width="100%" marginTop="2rem" isDisabled={isLoadingButton}>
            {isLoadingButton ? <Spinner /> : "Submit"}
          </Button>
        </form>
      </Flex>
    </Flex>
  );
};

export default ResetPassword;
