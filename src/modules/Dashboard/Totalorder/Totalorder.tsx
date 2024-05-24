"use client";

import { Center, CircularProgress, Text, Flex, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Totalorder = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalOrder, setTotalOrder] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function fetchTotalOrder() {
      try {
        const response = await fetch("/api/v1/totalorder");
        if (!response.ok) {
          const errorMessage = await response.json();
          console.log(errorMessage);
        } else {
          const data = await response.json();
          setTotalOrder(data);
        }
      } catch (error) {
        console.error("Error fetching the data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTotalOrder();
  });

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

      {/* No Customer */}
      {totalOrder === undefined && isLoading === false && (
        <>
          <div>No customer</div>
        </>
      )}

      {/* Show Customers */}
      {totalOrder !== undefined && isLoading === false && (
        <>
          <Box padding="1.5rem" backgroundColor="#1c2e45" rounded="0.7rem" maxW="23rem" w="100%" minH="10rem">
            <Text fontSize="1.5rem" fontWeight="medium" color="#3b82f6">
              {totalOrder}
            </Text>
            <Text fontSize="lg" fontWeight="medium">
              Total Order
            </Text>
          </Box>
        </>
      )}
    </>
  );
};

export default Totalorder;
