"use client";

import { Center, CircularProgress, Text, Flex, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const TotalCustomer = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalCustomer, setTotalCustomer] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function fetchTotalCustomer() {
      try {
        const response = await fetch("/api/v1/customers/total");
        if (!response.ok) {
          const errorMessage = await response.json();
          console.log(errorMessage);
        } else {
          const data = await response.json();
          setTotalCustomer(data);
        }
      } catch (error) {
        console.error("Error fetching the data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTotalCustomer();
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

      {/* No Customer */}
      {totalCustomer === undefined && isLoading === false && (
        <>
          <div>No customer</div>
        </>
      )}

      {/* Show Customers */}
      {totalCustomer !== undefined && isLoading === false && (
        <>
          <Box padding="1.5rem" backgroundColor="#1c2e45" rounded="0.7rem" maxW="17.5rem" w="100%" minH="10rem">
            <Text fontSize="1.5rem" fontWeight="medium" color="#3b82f6">
              {totalCustomer}
            </Text>
            <Text fontSize="lg" fontWeight="medium">
              Total Customer
            </Text>
          </Box>
        </>
      )}
    </>
  );
};

export default TotalCustomer;
