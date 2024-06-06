import { Box, Flex, Text } from "@chakra-ui/react";
import MonthlyRevenue from "./Revenues/Monthly/MonthlyRevenue";
import TotalRevenues from "./Revenues/TotalRevenues";
import MonthlyOrder from "./Totalorder/Monthly/MonthlyOrder";
import Totalorder from "./Totalorder/Totalorder";
import TotalCustomer from "./Customer/TotalCustomer";
import TotalProduct from "./Product/TotalProduct";
import CustomerChurn from "./CustomerChurn/CustomerChurn";
import CustomerSegmentation from "./CustomerSegmentation/CustomerSegmentation";
import SalesForecasting from "./SalesForecasting/SalesForecasting";
import StockSales from "./StockSales/StockSales";

const Dashboard = () => {
  return (
    <>
      <Box padding="1rem">
        <Text fontSize="2xl" fontWeight="semibold" marginBottom="1rem" textAlign={{ base: "center", lg: "left" }}>
          Dashboard
        </Text>
        <Flex flexDirection="row" wrap="wrap" gap="2rem">
          <TotalRevenues />
          <Totalorder />
          <TotalCustomer />
          <TotalProduct />
        </Flex>
        <Flex flexDirection="row" wrap="wrap" gap="2rem" marginTop="2rem">
          <MonthlyRevenue />
          <MonthlyOrder />
        </Flex>
        <Flex flexDirection="row" wrap="wrap" gap="2rem" marginTop="2rem">
          <CustomerChurn />
          <CustomerSegmentation />
        </Flex>
        <Box marginTop="2rem">
          <SalesForecasting />
        </Box>
        <Box marginTop="2rem"><StockSales /></Box>
      </Box>
    </>
  );
};

export default Dashboard;
