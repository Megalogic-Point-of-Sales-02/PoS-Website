"use client";

import { ProductResponse } from "@/interfaces/ProductResponse";
import { useEffect, useState } from "react";
import { Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Text, Flex, Button, Spacer, Center, CircularProgress } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { FaTrashAlt } from "react-icons/fa";
import convertRupiah from "@/utils/convertRupiah";

const ListProducts = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<ProductResponse[] | undefined>(undefined);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/v1/products");
        if (!response.ok) {
          const errorMessage = await response.json();
          console.log(errorMessage);
        } else {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching the data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
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

      {/* No product */}
      {products === undefined && isLoading === false && (
        <>
          <div>No Products</div>
        </>
      )}

      {/* Show products */}
      {isLoading === false && products !== undefined && (
        <>
          {/* Table */}
          <Flex flexDirection="column" rounded="1rem" bgColor="#132337" padding="1.5rem" gap="1rem" margin="1rem">
            <Flex flexDirection="row">
              <Text fontSize="2xl">Product List</Text>
              <Spacer />
              <Button leftIcon={<AddIcon />}>Add Product</Button>
            </Flex>
            <TableContainer>
              <Table variant="simple" colorScheme="blackAlpha">
                <Thead bgColor={"#1c2e45"}>
                  <Tr>
                    <Th color="white">ID</Th>
                    <Th color="white">Name</Th>
                    <Th color="white">Category</Th>
                    <Th color="white">Subcategory</Th>
                    <Th color="white" isNumeric>
                      Price
                    </Th>
                    <Th width="5rem"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {products.map((product: ProductResponse) => (
                    <Tr key={product.id} color="#92afd3">
                      <Td>{product.id}</Td>
                      <Td color="white">{product.product_name}</Td>
                      <Td>{product.product_category}</Td>
                      <Td>{product.product_sub_category}</Td>
                      <Td isNumeric color="#3b82f6">
                        {convertRupiah(product.product_price)}
                      </Td>
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

export default ListProducts;
