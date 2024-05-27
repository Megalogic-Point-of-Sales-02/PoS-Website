"use client";

import { Center, CircularProgress, Text, Flex, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const TotalProduct = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalProduct, setTotalProduct] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function fetchTotalProduct() {
      try {
        const response = await fetch("/api/v1/products/total");
        if (!response.ok) {
          const errorMessage = await response.json();
          console.log(errorMessage);
        } else {
          const data = await response.json();
          setTotalProduct(data);
        }
      } catch (error) {
        console.error("Error fetching the data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTotalProduct();
  }, []);

  return (
    <>
      {/* Fetching the API */}
      {isLoading === true && (
        <>
          <Center>
            <CircularProgress isIndeterminate color="green.300" marginTop="3rem" />
          </Center>
        </>
      )}

      {/* No Product */}
      {totalProduct === undefined && isLoading === false && (
        <>
          <div>No product</div>
        </>
      )}

      {/* Show Products */}
      {totalProduct !== undefined && isLoading === false && (
        <>
          <Box padding="1.5rem" backgroundColor="#1c2e45" rounded="0.7rem" maxW="17.5rem" w="100%" minH="10rem">
            <Text fontSize="1.5rem" fontWeight="medium" color="#3b82f6">
              {totalProduct}
            </Text>
            <Text fontSize="lg" fontWeight="medium">
              Total Product
            </Text>
          </Box>
        </>
      )}
    </>
  );
};

export default TotalProduct;
