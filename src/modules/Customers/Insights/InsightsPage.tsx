"use client";

import { InsightResponse } from "@/interfaces/InsightResponse";
import { Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Text, Flex, Button, Spacer, useDisclosure, Center, CircularProgress, Input } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import React from "react";
import convertRupiah from "@/utils/convertRupiah";
import { useSession } from "next-auth/react";
import convertDate from "@/utils/convertDate";

const InsightsPage = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshData, setRefreshData] = useState<boolean>(false);
  const { isOpen: isAddCustOpen, onOpen: onAddCustOpen, onClose: onAddCustClose } = useDisclosure();
  const { isOpen: isDeleteCustOpen, onOpen: onDeleteCustOpen, onClose: onDeleteCustClose } = useDisclosure();
  const [insights, setInsights] = useState<InsightResponse[] | undefined>(undefined);
  const [currentCustomerId, setCurrentCustomerId] = useState<number | null>(null); // State for the current insight ID to be deleted
  const [currentCustomerNumber, setCurrentCustomerNumber] = useState<number | null>(null); // State for the current insight number index to be deleted
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const [filteredInsights, setFilteredInsights] = useState<InsightResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function fetchInsights() {
      try {
        const methodAndHeader = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session!.user.accessToken}`,
          },
        };
        const response = await fetch("/api/v2/insights", methodAndHeader);
        if (!response.ok) {
          const errorMessage = await response.json();
          console.log(errorMessage);
        } else {
          const data = await response.json();
          setInsights(data);
          setFilteredInsights(data)
        }
      } catch (error) {
        console.error("Error fetching the data");
      } finally {
        setIsLoading(false);
      }
    }
    if (session) fetchInsights();
  }, [refreshData, session]);

  const handleCustomerChange = () => {
    setIsLoading(true);
    setRefreshData((prev) => !prev); // Toggle refreshData state to trigger useEffect
  };

  const handleDeleteClick = (id: number, number: number) => {
    setCurrentCustomerId(id);
    setCurrentCustomerNumber(number);
    onDeleteCustOpen();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (insights) {
      const filtered = insights.filter((insight) => insight.cust_name.toLowerCase().includes(query));
      setFilteredInsights(filtered);
    }
  };

  return (
    <div>
      {/* Table */}
      <Flex flexDirection="column" rounded="1rem" bgColor="#132337" padding="1.5rem" gap="1rem" margin="1rem">
        <Flex flexDirection={{ base: "column", sm: "row" }} alignItems="center" rowGap="0.25rem">
          <Text fontSize="2xl">Customer Insight</Text>
          <Spacer />
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
        {insights === undefined && isLoading === false && (
          <>
            <div>No insight</div>
          </>
        )}
        {/* Show Customers */}
        {insights !== undefined && isLoading === false && (
          <>
            {/* Input Search */}
            <Input placeholder="Search customer..." value={searchQuery} onChange={handleSearchChange} w="100%" className="!bg-white !text-black !border-white" />
            {/* Table */}
            <TableContainer>
              <Table variant="simple" colorScheme="blackAlpha">
                <Thead bgColor={"#1c2e45"}>
                  <Tr>
                    {/* <Th color="white">ID</Th> */}
                    <Th color="white">No.</Th>
                    <Th color="white">Name</Th>
                    <Th color="white" isNumeric>Order Count</Th>
                    <Th color="white">Segmentation</Th>
                    <Th color="white">Churn</Th>
                    <Th color="white">First Transaction</Th>
                    <Th color="white">Last Transaction</Th>
                    <Th color="white" isNumeric>Avg. Spend per Month</Th>
                    <Th color="white" isNumeric>Days as Customer</Th>
                    <Th color="white" isNumeric>Months as Customer</Th>
                    <Th color="white" isNumeric>Years as Customer</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredInsights.map((insight: InsightResponse, index) => (
                    <Tr key={insight.customer_id} color="#92afd3">
                      {/* <Td>{insight.id}</Td> */}
                      <Td>{index + 1}</Td>
                      <Td color="white">{insight.cust_name}</Td>
                      <Td isNumeric>{insight.total_order_count}</Td>
                      <Td>{insight.segmentation === null ? "Not Yet Ordered" : insight.segmentation}</Td>
                      <Td>{insight.churn === null ? "Not Yet Ordered" : insight.churn}</Td>
                      <Td>{convertDate(insight.first_transaction)}</Td>
                      <Td>{convertDate(insight.last_transaction)}</Td>
                      <Td isNumeric color="#3b82f6">{convertRupiah(insight.average_spend_per_month)}</Td>
                      <Td isNumeric>{insight.days_as_customer}</Td>
                      <Td isNumeric>{insight.months_as_customer}</Td>
                      <Td isNumeric>{insight.years_as_customer}</Td>
                    </Tr>
                  ))}
                </Tbody>
                <Tfoot></Tfoot>
              </Table>
            </TableContainer>
          </>
        )}
      </Flex>
    </div>
  );
};

export default InsightsPage;
