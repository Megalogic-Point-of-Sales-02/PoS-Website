import { CustomerResponse } from "@/interfaces/CustomerResponse";
import { OrderRequest } from "@/interfaces/OrderRequest";
import { ProductResponse } from "@/interfaces/ProductResponse";
import { BoxProps, Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast, Spinner } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import ReactSelect from "react-select";
import DOMPurify from "isomorphic-dompurify";
import { useSession } from "next-auth/react";
import { triggerCustomerChurnPrediction } from "@/utils/machineLearningModelUtils/customerChurn";
import { CustomerChurnPredictionContext } from "@/utils/predictionContext";
import { triggerCustomerSegmentationPerform } from "@/utils/machineLearningModelUtils/customerSegmentation";
import { CustomerSegmentationPerformContext } from "@/utils/performContext";
import { supabase } from "@/utils/supabase";

interface AddOrderProps extends BoxProps {
  onClose: () => void;
  isOpen: boolean;
  handleOrderChange: () => void;
}

const AddOrder = ({ onClose, isOpen, handleOrderChange }: AddOrderProps) => {
  const contextChurn = useContext(CustomerChurnPredictionContext);
  const contextSegmentation = useContext(CustomerSegmentationPerformContext);

  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [isLoadingPrice, setIsLoadingPrice] = useState<boolean>(false);

  const { data: session, status } = useSession();
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
        const methodAndHeader = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session!.user.accessToken}`,
          },
        };
        const [customersResponse, productsResponse] = await Promise.all([fetch("/api/v1/customers", methodAndHeader), fetch("/api/v1/products", methodAndHeader)]);

        if (!customersResponse.ok || !productsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const customersData = await customersResponse.json();
        const productsData = await productsResponse.json();

        console.log(customersData);
        console.log(productsData);

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
      const methodAndHeader = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session!.user.accessToken}`,
        },
      };
      const response = await fetch(`/api/v1/products?id=${formData.product_id}`, methodAndHeader);
      const productData = await response.json();
      const sales = productData[0].product_price * formData.quantity;
      setFormData((prevData) => ({
        ...prevData,
        sales: sales,
      }));
      setIsLoadingPrice(false);
    };
    if (formData.product_id && formData.quantity && session) {
      setIsLoadingPrice(true);
      calculateSales();
    }
  }, [formData.product_id, formData.quantity, session]);

  // Set value of a label when there is a change in the form
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });
    console.log("sanitized value: " + sanitizedValue);
    setFormData((prevData) => ({
      ...prevData,
      [name]: new Date(sanitizedValue),
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
    setIsLoadingButton(true);
    if (session) {
      try {
        const response = await fetch("/api/v1/orders", {
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

          // Run predict machine learning model in background
          triggerCustomerChurnPrediction(session, contextChurn);
          triggerCustomerSegmentationPerform(session, contextSegmentation);

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
      } finally {
        setIsLoadingButton(false);
      }
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
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent maxWidth="800px" marginX="2rem">
          <ModalHeader>Add Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Flex gap="1.5rem" wrap="wrap">
                <FormControl isRequired flex={{ base: "1 1 100%", md: "1 1 40%" }}>
                  <FormLabel htmlFor="order_date">Order Date</FormLabel>
                  <Input isDisabled type="date" name="order_date" value={formData.order_date.toISOString().substring(0, 10)} onChange={handleDateChange} id="order_date" />
                </FormControl>

                <FormControl isRequired flex={{ base: "1 1 100%", md: "1 1 40%" }}>
                  <FormLabel htmlFor="ship_date">Ship Date</FormLabel>
                  <Input type="date" name="ship_date" value={formData.ship_date.toISOString().substring(0, 10)} min={new Date().toISOString().substring(0, 10)} onChange={handleDateChange} id="ship_date" />
                </FormControl>

                <FormControl isRequired flex={{ base: "1 1 100%", md: "1 1 40%" }}>
                  <FormLabel htmlFor="customer_id">Customer Name</FormLabel>
                  <ReactSelect name="customer_id" options={customerOptions} onChange={handleSelectChange} placeholder="Select customer" />
                </FormControl>

                <FormControl isRequired flex={{ base: "1 1 100%", md: "1 1 40%" }}>
                  <FormLabel htmlFor="product_id">Product Name</FormLabel>
                  <ReactSelect name="product_id" options={productOptions} onChange={handleSelectChange} placeholder="Select product" />
                </FormControl>

                <FormControl isRequired flex={{ base: "1 1 100%", md: "1 1 40%" }}>
                  <FormLabel htmlFor="quantity">Quantity</FormLabel>
                  <Input type="number" min="1" name="quantity" value={formData.quantity} onChange={handleChange} id="quantity" placeholder="Enter quantity" />
                </FormControl>

                <FormControl isRequired flex={{ base: "1 1 100%", md: "1 1 40%" }} position="relative">
                  <FormLabel htmlFor="sales">Sales</FormLabel>
                  <Input type="number" name="sales" value={isLoadingPrice ? 0 : formData.sales} id="sales" isDisabled />
                  {isLoadingPrice && <Spinner size="sm" position="absolute" right="8px" top="60%" />} {/* Show spinner while loading */}
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

export default AddOrder;
