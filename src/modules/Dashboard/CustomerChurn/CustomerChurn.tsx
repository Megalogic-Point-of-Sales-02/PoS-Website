import { CustomerChurnResponse } from "@/interfaces/CustomerChurnResponse";
import { CustomerChurnPredictionContext } from "@/utils/predictionContext";
import { Center, CircularProgress, Text, Flex, Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";

const CustomerChurn = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { customerChurnPredictionStatus, setCustomerChurnPredictionStatus, customerChurnPredictionData, setCustomerChurnPredictionData } = useContext(CustomerChurnPredictionContext);

  useEffect(() => {
    async function fetchCustomerChurn() {
      console.log("customerChurn modules prediction status:", customerChurnPredictionStatus);
    }
    if (session) fetchCustomerChurn();
  }, [session]);

  return (
    <Box flex="1" padding="1.5rem" backgroundColor="#1c2e45" rounded="0.7rem" minH="8rem" width="100%" minWidth={{ base: "100%", sm: "calc(50% - 2rem)", lg: "calc(25% - 2rem)" }}>
      {/* Fetching the API */}
      {isLoading === true && (
        <>
          <CircularProgress isIndeterminate color="green.300" marginBottom="0.5rem" />
        </>
      )}

      {/* No Customer */}
      {/* {totalCustomer === undefined && isLoading === false && (
        <>
          <div>No customer</div>
        </>
      )} */}

      {/* Show Customers */}
      {/* {totalCustomer !== undefined && isLoading === false && (
        <>
          <Text fontSize="1.5rem" fontWeight="medium" color="#3b82f6">
            {totalCustomer}
          </Text>
        </>
      )} */}
      <Text fontSize="lg" fontWeight="medium">
        Total Customer
      </Text>
    </Box>
  );
};

export default CustomerChurn;
