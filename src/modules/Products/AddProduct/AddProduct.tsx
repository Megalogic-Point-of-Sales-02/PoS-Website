import { ProductRequest } from "@/interfaces/ProductRequest";
import { BoxProps, Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spinner, useToast } from "@chakra-ui/react";
import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { useSession } from "next-auth/react";
import validateInput from "@/utils/validateInput";
import { CategoriesList } from "@/utils/categoryProduct";

interface AddProductProps extends BoxProps {
  onClose: () => void;
  isOpen: boolean;
  handleProductChange: () => void;
}

const AddProduct = ({ onClose, isOpen, handleProductChange }: AddProductProps) => {
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const { data: session } = useSession();

  const [formData, setFormData] = useState<ProductRequest>({
    product_name: "",
    product_category: "",
    product_sub_category: "",
    product_price: "" as unknown as number,
  });

  const toast = useToast();

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
        const response = await fetch("/api/v1/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.accessToken}`,
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
            description: `Product with ID ${message[0].id} added successfully`,
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
          handleProductChange();
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

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      product_category: value,
      product_sub_category: "", // Reset sub-category when category changes
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent maxWidth="800px" marginX="2rem">
        <ModalHeader>Add Product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Flex gap="1.5rem" wrap="wrap">
              <FormControl isRequired flex={{ base: "1 1 100%", md: "1 1 40%" }}>
                <FormLabel htmlFor="product_name">Product Name</FormLabel>
                <Input name="product_name" value={formData.product_name} onChange={handleChange} id="product_name" placeholder="Enter product name" />
              </FormControl>

              <FormControl isRequired flex={{ base: "1 1 100%", md: "1 1 40%" }}>
                <FormLabel htmlFor="product_category">Category</FormLabel>
                <Select name="product_category" value={formData.product_category} onChange={handleCategoryChange} id="product_category" placeholder="Select category">
                  {Object.keys(CategoriesList).map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired flex={{ base: "1 1 100%", md: "1 1 40%" }}>
                <FormLabel htmlFor="product_sub_category">Sub Category</FormLabel>
                <Select name="product_sub_category" value={formData.product_sub_category} onChange={handleChange} id="product_sub_category" placeholder="Select sub category" isDisabled={!formData.product_category}>
                  {formData.product_category && CategoriesList[formData.product_category].map((subCategory) => (
                    <option key={subCategory} value={subCategory}>{subCategory}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired flex={{ base: "1 1 100%", md: "1 1 40%" }}>
                <FormLabel htmlFor="product_price">Price</FormLabel>
                <Input type="number" min="1" name="product_price" value={formData.product_price} onChange={handleChange} id="product_price" placeholder="Enter price" />
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
  );
};

export default AddProduct;
