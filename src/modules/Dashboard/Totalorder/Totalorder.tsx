"use client";

import { Center, CircularProgress, Text, Flex, Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Totalorder = () => {
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalOrder, setTotalOrder] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function fetchTotalOrder() {
      try {
        const methodAndHeader = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session!.user.accessToken}`,
          },
        };
        const response = await fetch("/api/v2/orders/total", methodAndHeader);
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
    if (session) fetchTotalOrder();
  }, [session]);

  return (
    <Box flex="1" padding="1.5rem" backgroundColor="#1c2e45" rounded="0.7rem" minH="8rem" width="100%" minWidth={{ base: "100%", sm: "calc(50% - 2rem)", xl: "calc(25% - 2rem)" }} alignContent="center">
      {/* Fetching the API */}
      {isLoading === true && (
        <>
          <CircularProgress isIndeterminate color="green.300" marginBottom="0.5rem" />
        </>
      )}

      {/* No TotalOrder */}
      {totalOrder === undefined && isLoading === false && (
        <>
          <div>No Total Order</div>
        </>
      )}

      {/* Show TotalOrders */}
      {totalOrder !== undefined && isLoading === false && (
        <>
          <Text fontSize="1.5rem" fontWeight="medium" color="#3b82f6">
            {totalOrder}
          </Text>
        </>
      )}
      <Text fontSize="lg" fontWeight="medium">
        Total Order
      </Text>
    </Box>
  );
};

export default Totalorder;
