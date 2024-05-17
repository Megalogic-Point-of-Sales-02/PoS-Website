import { ProductRequest } from "@/interfaces/ProductRequest";
import { BoxProps, Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";

interface AddProductProps extends BoxProps {
  onClose: () => void;
  isOpen: boolean;
}

const AddProduct = ({ onClose, isOpen }: AddProductProps) => {
  const [formData, setFormData] = useState<ProductRequest>({
    product_name: "",
    product_category: "",
    product_sub_category: "" ,
    product_price: "" as unknown as number,
  });

  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch("/api/v1/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorMessage = await response.json();
        toast({
          title: "Error",
          description: errorMessage.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      } else {
        const message = await response.json();
        toast({
          title: "Success",
          description: `Product with data: ${message} added successfully`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setFormData({
            product_name: "",
            product_category: "",
            product_sub_category: "",
            product_price: "" as unknown as number,
            });
        onClose();
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
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth="800px">
          <ModalHeader>Add Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Flex gap="1.5rem" wrap="wrap">
                <FormControl isRequired flex="1 1 40%">
                  <FormLabel htmlFor="product_name">Product Name</FormLabel>
                  <Input name="product_name" value={formData.product_name} onChange={handleChange} id="product_name" placeholder="Enter product name" />
                </FormControl>

                <FormControl isRequired flex="1 1 40%">
                  <FormLabel htmlFor="product_category">Category</FormLabel>
                  <Input name="product_category" value={formData.product_category} onChange={handleChange} id="product_category" placeholder="Enter category" />
                </FormControl>

                <FormControl isRequired flex="1 1 40%">
                  <FormLabel htmlFor="product_sub_category">Sub Category</FormLabel>
                  <Input type="product_sub_category" name="product_sub_category" value={formData.product_sub_category} onChange={handleChange} id="product_sub_category" placeholder="Enter sub category" />
                </FormControl>

                <FormControl isRequired flex="1 1 40%">
                  <FormLabel htmlFor="product_price">Price</FormLabel>
                  <Input type="number" name="product_price" value={formData.product_price} onChange={handleChange} id="product_price" placeholder="Enter price" />
                </FormControl>
                
              </Flex>
              <Button type="submit" width="100%" marginTop="2rem">
                Submit
              </Button>
            </form>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
        </>
    );
};

export default AddProduct;