"use client";

import convertRupiah from "@/utils/convertRupiah";
import { Box, Button, Center, CircularProgress, Flex, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const MonthlyRevenue = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState(null);

  const getCurrentDatePrefix = () => {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; // months from 1-12
    const monthPadded = month.toString().padStart(2, "0"); // Turns 1 into 01 (add 0 in the start until the length is 2)
    const year = dateObj.getUTCFullYear();

    const currentDatePrefix = year + "-" + monthPadded;
    return currentDatePrefix;
  };

  const [datePrefix, setDatePrefix] = useState(getCurrentDatePrefix());

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/v1/revenues/monthly?date-prefix=" + datePrefix);
    if (!response.ok) {
      const errorMessage = await response.json();
      console.log(errorMessage);
    } else {
      const data = await response.json();
      setMonthlyRevenue(data);
    }
  };

  useEffect(() => {
    async function fetchTotalOrder() {
      try {
        const response = await fetch("/api/v1/revenues/monthly?date-prefix=" + datePrefix);
        if (!response.ok) {
          const errorMessage = await response.json();
          console.log(errorMessage);
        } else {
          const data = await response.json();
          setMonthlyRevenue(data);
        }
      } catch (error) {
        console.error("Error fetching the data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTotalOrder();
  }, []);

  return (
    <>
      <Flex flex="1" padding="1.5rem" backgroundColor="#1c2e45" rounded="0.7rem" minWidth={{ base: "100%", lg: "calc(50% - 2rem)" }} w="100%" minH="10rem" flexDirection="column" alignItems="center">
        {isLoading && (
          <Center>
            <CircularProgress isIndeterminate color="green.300" />
          </Center>
        )}

        {monthlyRevenue !== null && (
          <>
            <Text fontSize="1.5rem" fontWeight="medium" color="#3b82f6">
              {convertRupiah(monthlyRevenue)}
            </Text>
          </>
        )}
        <Text fontSize="lg" fontWeight="medium">
          Monthly Revenue
        </Text>
        <Box width="100%">
          <form onSubmit={handleSubmit}>
            <FormControl>
              <Flex flexDirection="column">
                <FormLabel htmlFor="date-prefix" color="#92afd3" textAlign="center">
                  Select Month and Year
                </FormLabel>
                <Flex flexDirection="row" flexWrap="wrap" gap="0.5rem" justifyContent="center">
                  <Input
                    bgColor="white"
                    type="month"
                    id="date-prefix"
                    name="date-prefix"
                    value={datePrefix}
                    max={getCurrentDatePrefix()}
                    maxWidth="12rem"
                    height="2.8rem"
                    color="#0f1824"
                    onChange={(e) => {
                      setDatePrefix(e.target.value);
                      console.log(e.target.value);
                    }}
                  />
                  <Button colorScheme="blue" type="submit" padding="1.4rem" height="2.8rem">
                    Calculate
                  </Button>
                </Flex>
              </Flex>
            </FormControl>
          </form>
        </Box>
      </Flex>
    </>
  );
};

export default MonthlyRevenue;
