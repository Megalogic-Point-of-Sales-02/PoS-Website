"use client";

import { CustomerResponse } from "@/interfaces/CustomerResponse";
import { Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Text, Flex, Button, Spacer, useDisclosure, Center, CircularProgress } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import AddCustomer from "../AddCustomer/AddCustomer";
import React from "react";
import DeleteCustomer from "../DeleteCustomer/DeleteCustomer";
import convertRupiah from "@/utils/convertRupiah";

const ListCustomers = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isOpen: isAddCustOpen, onOpen: onAddCustOpen, onClose: onAddCustClose } = useDisclosure();
  const { isOpen: isDeleteCustOpen, onOpen: onDeleteCustOpen, onClose: onDeleteCustClose } = useDisclosure();
  const [customers, setCustomers] = useState<CustomerResponse[] | undefined>(undefined);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

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
      } finally {
        setIsLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  return (
    <div>
      {/* Fetching the API */}
      {isLoading === true && (
        <>
          <Center>
            <CircularProgress isIndeterminate color="green.300" marginTop="3rem" />
          </Center>
        </>
      )}

      {/* No Customer */}
      {customers === undefined && isLoading === false && (
        <>
          <div>No customer</div>
        </>
      )}

      {/* Show Customers */}
      {customers !== undefined && isLoading === false && (
        <>
          {/* Table */}
          <Flex flexDirection="column" rounded="1rem" bgColor="#132337" padding="1.5rem" gap="1rem" margin="1rem">
            <Flex flexDirection="row">
              <Text fontSize="2xl">Customer List</Text>
              <Spacer />
              <Button onClick={onAddCustOpen}>Add Customer</Button>
              <AddCustomer isOpen={isAddCustOpen} onClose={onAddCustClose} />
            </Flex>
            <TableContainer>
              <Table variant="simple" colorScheme="blackAlpha">
                <Thead bgColor={"#1c2e45"}>
                  <Tr>
                    <Th color="white">ID</Th>
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
                    <Th width="5rem"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {customers.map((customer: CustomerResponse) => (
                    <Tr key={customer.id} color="#92afd3">
                      <Td>{customer.id}</Td>
                      <Td color="white">{customer.customer_name}</Td>
                      <Td>{customer.gender}</Td>
                      <Td isNumeric>{customer.age}</Td>
                      <Td>{customer.job}</Td>
                      <Td>{customer.segment}</Td>
                      <Td isNumeric color="#3b82f6">
                        {convertRupiah(customer.total_spend)}
                      </Td>
                      <Td width="5rem">
                        <Button colorScheme="red" size="sm" variant="outline" onClick={onDeleteCustOpen}>
                          <FaTrashAlt />
                        </Button>
                        <DeleteCustomer id={customer.id} isOpen={isDeleteCustOpen} onClose={onDeleteCustClose} cancelRef={cancelRef} />
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

export default ListCustomers;
