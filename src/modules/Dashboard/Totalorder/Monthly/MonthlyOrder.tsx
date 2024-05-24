"use client";

import { Box, Button, Flex, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { useState } from "react";

const MonthlyOrder = () => {
  const [monthlyOrder, setMonthlyOrder] = useState(null);

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
    const response = await fetch("/api/v1/totalorder/monthly?date-prefix=" + datePrefix);
    if (!response.ok) {
      const errorMessage = await response.json();
      console.log(errorMessage);
    } else {
      const data = await response.json();
      setMonthlyOrder(data);
    }
  };

  return (
    <>
      <Box padding="1.5rem" backgroundColor="#1c2e45" rounded="0.7rem" maxW="23rem" w="100%" minH="10rem">
        {monthlyOrder !== null && (
          <>
            <Text fontSize="1.5rem" fontWeight="medium" color="#3b82f6">
              {monthlyOrder}
            </Text>
          </>
        )}
        <Text fontSize="lg" fontWeight="medium">
          Monthly Order
        </Text>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel htmlFor="date-prefix" color="#92afd3">
              Select Month and Year
            </FormLabel>
            <Flex flexDirection="row" columnGap="1rem">
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
              <Button type="submit" padding="1.4rem" height="2.8rem" bgColor="white">
                Calculate
              </Button>
            </Flex>
          </FormControl>
        </form>
      </Box>
    </>
  );
};

export default MonthlyOrder;
