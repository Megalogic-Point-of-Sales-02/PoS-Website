"use client";

import { CustomerResponse } from "@/interfaces/CustomerResponse";
import { Box, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Text, Flex, Button, Spacer } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const ListCustomers = () => {
  const [customers, setCustomers] = useState<CustomerResponse[] | null | undefined>(null);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetch("/api/v1/customers");
        if (!response.ok) {
          const errorMessage = await response.json();
          console.log(errorMessage);
        } else {
          const data = await response.json();
          setCustomers(data);
        }
      } catch (error) {
        console.error("Error fetching the data");
      }
    }
    fetchCustomers();
  }, []);

  return (
    <div>
      {/* Fetching the API */}
      {customers === null && (
        <>
          <div>Loading Customer...</div>
        </>
      )}

      {/* No Customer */}
      {customers === undefined && (
        <>
          <div>No customer</div>
        </>
      )}

      {/* Show Customers */}
      {customers !== null && customers !== undefined && (
        <>
          {/* Table */}
          <Flex flexDirection="column" rounded="1rem" bgColor="#132337" padding="1.5rem" gap="1rem">
            <Flex flexDirection="row">
              <Text fontSize="2xl">Customer List</Text>
              <Spacer />
              <Button>Add Customer</Button>
            </Flex>
            <TableContainer>
              <Table variant="simple" colorScheme="blackAlpha">
                <Thead bgColor={"#1c2e45"}>
                  <Tr>
                    <Th color="white">Name</Th>
                    <Th color="white">Gender</Th>
                    <Th color="white" isNumeric>
                      Age
                    </Th>
                    <Th color="white">Job</Th>
                    <Th color="white">Segment</Th>
                    <Th color="white" isNumeric>
                      Total Spend
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {customers.map((customer: CustomerResponse) => (
                    <Tr key={customer.id}>
                      <Td>{customer.customer_name}</Td>
                      <Td>{customer.gender}</Td>
                      <Td isNumeric>{customer.age}</Td>
                      <Td>{customer.job}</Td>
                      <Td>{customer.segment}</Td>
                      <Td isNumeric>{customer.total_spend}</Td>
                    </Tr>
                  ))}
                </Tbody>
                <Tfoot></Tfoot>
              </Table>
            </TableContainer>
          </Flex>
        </>
      )}
    </div>
  );
};

export default ListCustomers;
