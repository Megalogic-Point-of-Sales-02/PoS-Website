"use client";

import convertRupiah from "@/utils/convertRupiah";
import { Center, CircularProgress, Text, Flex, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const TotalRevenues = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [revenue, setRevenue] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function fetchRevenue() {
      try {
        const response = await fetch("/api/v1/revenues");
        if (!response.ok) {
          const errorMessage = await response.json();
          console.log(errorMessage);
        } else {
          const data = await response.json();
          setRevenue(data);
        }
      } catch (error) {
        console.error("Error fetching the data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchRevenue();
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
      {revenue === undefined && isLoading === false && (
        <>
          <div>No customer</div>
        </>
      )}

      {/* Show Customers */}
      {revenue !== undefined && isLoading === false && (
        <>
          <Box padding="1.5rem" backgroundColor="#1c2e45" rounded="0.7rem" maxW="17.5rem" w="100%" minH="10rem">
            <Text fontSize="1.5rem" fontWeight="medium" color="#3b82f6">
              {convertRupiah(revenue)}
            </Text>
            <Text fontSize="lg" fontWeight="medium">
              Total Revenues
            </Text>
          </Box>
        </>
      )}
    </>
  );
};

export default TotalRevenues;
