"use client";

import { OrderResponse } from "@/interfaces/OrderResponse";
import { useEffect, useState } from "react";
import { Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Text, Flex, Button, Spacer, CircularProgress, Center, useDisclosure } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { FaTrashAlt } from "react-icons/fa";
import convertDate from "@/utils/convertDate";
import DeleteOrder from "../DeleteOrder/DeleteOrder";
import React from "react";
import AddOrder from "../AddOrder/AddOrder";
import convertRupiah from "@/utils/convertRupiah";
import { useSession } from "next-auth/react";

const ListOrders = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshData, setRefreshData] = useState<boolean>(false);
  const [orders, setOrders] = useState<OrderResponse[] | undefined>(undefined);
  const { isOpen: isAddOrderOpen, onOpen: onAddOrderOpen, onClose: onAddOrderClose } = useDisclosure();
  const { isOpen: isDeleteOrderOpen, onOpen: onDeleteOrderOpen, onClose: onDeleteOrderClose } = useDisclosure();
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null); // State for the current order ID to be deleted
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const methodAndHeader = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session!.user.accessToken}`,
          },
        };
        const response = await fetch("/api/v2/orders", methodAndHeader);
        if (!response.ok) {
          const errorMessage = await response.json();
          console.log(errorMessage);
        } else {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching the data");
      } finally {
        setIsLoading(false);
      }
    }
    if (session) fetchOrders();
  }, [refreshData, session]);

  const handleOrderChange = () => {
    setIsLoading(true);
    setRefreshData((prev) => !prev); // Toggle refreshData state to trigger useEffect
  };

  const handleDeleteClick = (id: number) => {
    setCurrentOrderId(id);
    onDeleteOrderOpen();
  };
  return (
    <div>
      {/* Table */}
      <Flex flexDirection="column" rounded="1rem" bgColor="#132337" padding="1.5rem" gap="1rem" margin="1rem">
        <Flex flexDirection={{ base: "column", sm: "row" }} alignItems="center" rowGap="0.25rem">
          <Text fontSize="2xl">Order List</Text>
          <Spacer />
          {isLoading === false && (
            <>
              <Button colorScheme="blue" leftIcon={<AddIcon />} onClick={onAddOrderOpen} w={{ base: "100%", sm: "fit-content" }}>
                Add Order
              </Button>

              <AddOrder isOpen={isAddOrderOpen} onClose={onAddOrderClose} handleOrderChange={handleOrderChange} />
            </>
          )}
        </Flex>
        {/* Fetching the API */}
        {isLoading === true && (
          <>
            <Center>
              <CircularProgress isIndeterminate color="green.300" />
            </Center>
          </>
        )}
        {/* No Customer */}
        {orders === undefined && isLoading === false && (
          <>
            <div>No Orders</div>
          </>
        )}
        {/* Show Customers */}
        {isLoading === false && orders !== undefined && (
          <>
            <TableContainer>
              <Table variant="simple" colorScheme="blackAlpha">
                <Thead bgColor={"#1c2e45"}>
                  <Tr>
                    <Th color="white">ID</Th>
                    <Th color="white">Order Date</Th>
                    <Th color="white">Shipping Date</Th>
                    <Th color="white">Customer</Th>
                    <Th color="white">Product</Th>
                    <Th color="white">Quantity</Th>
                    <Th color="white">Sales</Th>
                    <Th width="5rem"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {orders.map((order: OrderResponse) => (
                    <Tr key={order.id} color="#92afd3">
                      <Td>{order.id}</Td>
                      <Td>{convertDate(order.order_date)}</Td>
                      <Td>{convertDate(order.ship_date)}</Td>
                      <Td color="#3b82f6">{order.customer_id}</Td>
                      <Td color="#3b82f6">{order.product_id}</Td>
                      <Td color="#3b82f6">{order.quantity}</Td>
                      <Td color="#3b82f6">{convertRupiah(order.sales)}</Td>
                      <Td width="5rem">
                        <Button onClick={() => handleDeleteClick(order.id)} colorScheme="red" size="sm" variant="outline">
                          <FaTrashAlt />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
                <Tfoot></Tfoot>
              </Table>
            </TableContainer>
            <DeleteOrder id={currentOrderId} isOpen={isDeleteOrderOpen} onClose={onDeleteOrderClose} cancelRef={cancelRef} handleOrderChange={handleOrderChange} />
          </>
        )}
      </Flex>
    </div>
  );
};

export default ListOrders;
