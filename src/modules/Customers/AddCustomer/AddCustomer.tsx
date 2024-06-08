import { CustomerRequest } from "@/interfaces/CustomerRequest";
import { BoxProps, Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack, Text, useToast, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { useSession } from "next-auth/react";
import validateInput from "@/utils/validateInput";

interface AddCustomerProps extends BoxProps {
  onClose: () => void;
  isOpen: boolean;
  handleCustomerChange: () => void;
}

const AddCustomer = ({ onClose, isOpen, handleCustomerChange }: AddCustomerProps) => {
  const { data: session, status } = useSession();
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);

  // Set the useState type to the interface for request and assign a default placeholder
  const [formData, setFormData] = useState<CustomerRequest>({
    customer_name: "",
    gender: "Male",
    age: "" as unknown as number, // Start with an empty string
    job: "",
    segment: "Consumer",
    total_spend: 0, // Start with an empty string
  });

  const toast = useToast();

  // Set value of a label when there is a change in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });

    if (!validateInput(sanitizedValue)) {
      toast({
        title: "Invalid Input",
        description: "The input contains forbidden characters or patterns.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: sanitizedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingButton(true);
    if (session) {
      try {
        const response = await fetch("/api/v2/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session!.user.accessToken}`,
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          // Wait for the message
          const errorMessage = await response.json();
          // Create an error toast
          toast({
            title: "Error",
            description: errorMessage.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return;
        } else {
          // Wait for the message
          const message = await response.json();
          // Create a success toast
          toast({
            title: "Success",
            description: `${message.message}`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          // Set the form data back to the default
          setFormData({
            customer_name: "",
            gender: "Male",
            age: 0,
            job: "",
            segment: "Consumer",
            total_spend: 0,
          });
          handleCustomerChange(); // call handleCustomerChange to trigger useeffect
          // onClose();   // disabled so it still opens until the modal is closed manually
        }
      } catch (error) {
        console.error("Error submitting form", error);
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
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent maxWidth="800px" marginX="2rem">
          <ModalHeader>Add Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Flex gap="1.5rem" wrap="wrap">
                <FormControl isRequired flex={{ base: "1 1 100%", md: "1 1 40%" }}>
                  <FormLabel htmlFor="customer_name">Customer</FormLabel>
                  <Input name="customer_name" value={formData.customer_name} onChange={handleChange} id="customer_name" placeholder="Enter customer name" />
                </FormControl>

                <FormControl isRequired flex={{ base: "1 1 100%", md: "1 1 40%" }}>
                  <FormLabel htmlFor="gender">Gender</FormLabel>
                  <Select name="gender" value={formData.gender} onChange={handleChange} id="gender">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                </FormControl>

                <FormControl isRequired flex={{ base: "1 1 100%", md: "1 1 40%" }}>
                  <FormLabel htmlFor="age">Age</FormLabel>
                  <Input type="number" min="1" name="age" value={formData.age} onChange={handleChange} id="age" placeholder="Enter age" />
                </FormControl>

                <FormControl isRequired flex={{ base: "1 1 100%", md: "1 1 40%" }}>
                  <FormLabel htmlFor="job">Job</FormLabel>
                  <Input name="job" value={formData.job} onChange={handleChange} id="job" placeholder="Enter job" />
                </FormControl>

                <FormControl isRequired flex={{ base: "1 1 100%", md: "1 1 40%" }}>
                  <FormLabel htmlFor="segment">Segment</FormLabel>
                  <Select name="segment" value={formData.segment} onChange={handleChange} id="segment">
                    <option value="Consumer">Consumer</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Home Office">Home Office</option>
                  </Select>
                </FormControl>

                <FormControl isRequired flex={{ base: "1 1 100%", md: "1 1 40%" }}>
                  <FormLabel htmlFor="total_spend">Total Spend</FormLabel>
                  <Input type="number" name="total_spend" value={0} onChange={handleChange} id="total_spend" isDisabled />
                </FormControl>
              </Flex>
              <Button colorScheme="blue" type="submit" width="100%" marginTop="2rem" isDisabled={isLoadingButton}>
                {isLoadingButton ? <Spinner /> : "Submit"}
              </Button>
            </form>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddCustomer;
