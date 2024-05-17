import { Box, Flex, Text } from "@chakra-ui/react";
import MonthylRevenue from "./Revenues/Monthly/MonthylRevenue";
import Revenues from "./Revenues/Revenues";
import MonthlyOrder from "./Totalorder/Monthly/MonthlyOrder";

const Dashboard = () => {
  return (
    <>
      <Box padding="1rem">
        <Text fontSize="2xl" marginBottom="1rem">
          Dashboard
        </Text>
        <Flex flexDirection="row" wrap="wrap" gap="2rem">
          <Revenues />
          <MonthylRevenue />
          <MonthlyOrder />
        </Flex>
      </Box>
    </>
  );
};

export default Dashboard;
