import { CustomerResponse } from "@/interfaces/CustomerResponse";
import { OrderRequest } from "@/interfaces/OrderRequest";
import { ProductResponse } from "@/interfaces/ProductResponse";
import { BoxProps, Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";

interface AddOrderProps extends BoxProps {
  onClose: () => void;
  isOpen: boolean;
  handleOrderChange: () => void;
}

const AddOrder = ({ onClose, isOpen, handleOrderChange }: AddOrderProps) => {
  // Set the useState type to the interface for request and assign a default placeholder
  const [formData, setFormData] = useState<OrderRequest>({
    order_date: new Date(),
    ship_date: new Date(),
    customer_id: "" as unknown as number, // Start with an empty string;
    product_id: "" as unknown as number, // Start with an empty string;
    quantity: 1,
    sales: 0,
  });

  const toast = useToast();

  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);

  useEffect(() => {
    const fetchCustomersAndProducts = async () => {
      try {
        const [customersResponse, productsResponse] = await Promise.all([fetch("/api/v1/customers"), fetch("/api/v1/products")]);

        if (!customersResponse.ok || !productsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const customersData = await customersResponse.json();
        const productsData = await productsResponse.json();

        setCustomers(customersData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data", error);
        toast({
          title: "Error",
          description: "An error occurred while fetching customer and product data.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchCustomersAndProducts();
  }, [toast]);

  useEffect(() => {
    const calculateSales = async () => {
      console.log("DIHITUNG");
      const response = await fetch(`/api/v1/products?id=${formData.product_id}`);
      const productData = await response.json();
      const sales = productData[0].product_price * formData.quantity;
      setFormData((prevData) => ({
        ...prevData,
        sales: sales,
      }));
    };
    if (formData.product_id && formData.quantity) {
      calculateSales();
    }
  }, [formData.product_id, formData.quantity]);

  // Set value of a label when there is a change in the form
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: new Date(value),
    }));
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOption.value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch("/api/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        // Wait for the message
        const errorMessage = await response.json();
        // Create an error toast
        toast({
          title: "Error",
          description: errorMessage.error,
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
          description: `Order with ID ${message[0].id} added successfully`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // Set the form data back to the default
        setFormData({
          order_date: new Date(),
          ship_date: new Date(),
          customer_id: "" as unknown as number, // Start with an empty string;
          product_id: "" as unknown as number, // Start with an empty string;
          quantity: 1,
          sales: 0,
        });
        handleOrderChange(); // call handleOrderChange to trigger useeffect
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

  const customerOptions = customers.map((customer) => ({
    value: customer.id,
    label: `${customer.id} - ${customer.customer_name}`,
  }));

  const productOptions = products.map((product) => ({
    value: product.id,
    label: `${product.id} - ${product.product_name}`,
  }));

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth="800px">
          <ModalHeader>Add Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Flex gap="1.5rem" wrap="wrap">
                <FormControl isRequired flex="1 1 40%">
                  <FormLabel htmlFor="order_date">Order Date</FormLabel>
                  <Input type="date" name="order_date" value={formData.order_date.toISOString().substring(0, 10)} onChange={handleDateChange} id="order_date" />
                </FormControl>

                <FormControl isRequired flex="1 1 40%">
                  <FormLabel htmlFor="ship_date">Ship Date</FormLabel>
                  <Input type="date" name="ship_date" value={formData.ship_date.toISOString().substring(0, 10)} onChange={handleDateChange} id="ship_date" />
                </FormControl>

                <FormControl isRequired flex="1 1 40%">
                  <FormLabel htmlFor="customer_id">Customer ID</FormLabel>
                  <ReactSelect name="customer_id" options={customerOptions} onChange={handleSelectChange} placeholder="Select customer" />
                </FormControl>

                <FormControl isRequired flex="1 1 40%">
                  <FormLabel htmlFor="product_id">Product ID</FormLabel>
                  <ReactSelect name="product_id" options={productOptions} onChange={handleSelectChange} placeholder="Select product" />
                </FormControl>

                <FormControl isRequired flex="1 1 40%">
                  <FormLabel htmlFor="quantity">Quantity</FormLabel>
                  <Input type="number" name="quantity" value={formData.quantity} onChange={handleChange} id="quantity" placeholder="Enter quantity" />
                </FormControl>

                <FormControl isRequired flex="1 1 40%">
                  <FormLabel htmlFor="sales">Sales</FormLabel>
                  <Input type="number" name="sales" value={formData.sales} id="sales" isDisabled />
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

export default AddOrder;
