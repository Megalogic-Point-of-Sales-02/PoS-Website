"use client";

import { OrderResponse } from "@/interfaces/OrderResponse";
import { useEffect, useState } from "react";
import { Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Text, Flex, Button, Spacer } from "@chakra-ui/react";
import { FaTrashAlt } from "react-icons/fa";

const ListOrders = () => {
  const [orders, setOrders] = useState<OrderResponse[] | null | undefined>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/v1/orders");
        if (!response.ok) {
          const errorMessage = await response.json();
          console.log(errorMessage);
        } else {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching the data");
      }
    }
    fetchOrders();
  }, []);
  return (
    <div>
      {/* Fetching the API */}
      {orders === null && (
        <>
          <div>Loading Orders...</div>
        </>
      )}

      {/* No Customer */}
      {orders === undefined && (
        <>
          <div>No Orders</div>
        </>
      )}

      {/* Show Customers */}
      {orders !== null && orders !== undefined && (
        <>
          {/* Table */}
          <Flex flexDirection="column" rounded="1rem" bgColor="#132337" padding="1.5rem" gap="1rem" margin="1rem">
            <Flex flexDirection="row">
              <Text fontSize="2xl">Order List</Text>
              <Spacer />
              <Button>Add order</Button>
            </Flex>
            <TableContainer>
              <Table variant="simple" colorScheme="blackAlpha">
                <Thead bgColor={"#1c2e45"}>
                  <Tr>
                    <Th color="white">ID</Th>
                    <Th color="white">Order Date</Th>
                    <Th color="white">Shipping Date</Th>
                    <Th color="white">Customer</Th>
                    <Th color="white">Product</Th>
                    <Th width="5rem"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {orders.map((order: OrderResponse) => (
                    <Tr key={order.id}>
                      <Td>{order.id}</Td>
                      <Td>{order.order_date.toString()}</Td>
                      <Td>{order.ship_date.toString()}</Td>
                      <Td>{order.customers.customer_name}</Td>
                      <Td>{order.products.product_name}</Td>
                      <Td width="5rem">
                        <Button colorScheme="red" size="sm" variant="outline">
                          <FaTrashAlt />
                        </Button>
                      </Td>
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

export default ListOrders;
