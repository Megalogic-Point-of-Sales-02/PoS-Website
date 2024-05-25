import { Box, Flex, Text } from "@chakra-ui/react";
import MonthlyRevenue from "./Revenues/Monthly/MonthlyRevenue";
import TotalRevenues from "./Revenues/TotalRevenues";
import MonthlyOrder from "./Totalorder/Monthly/MonthlyOrder";
import Totalorder from "./Totalorder/Totalorder";

const Dashboard = () => {
  return (
    <>
      <Box padding="1rem">
        <Text fontSize="2xl" marginBottom="1rem">
          Dashboard
        </Text>
        <Flex flexDirection="row" wrap="wrap" gap="2rem">
          <TotalRevenues />
          <Totalorder />
          <MonthlyRevenue />
          <MonthlyOrder />
        </Flex>
      </Box>
    </>
  );
};

export default Dashboard;
