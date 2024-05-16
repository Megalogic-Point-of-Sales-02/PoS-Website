"use client";

import { ProductResponse } from "@/interfaces/ProductResponse";
import { useEffect, useState } from "react";
import { Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Text, Flex, Button, Spacer } from "@chakra-ui/react";

const ListProducts = () => {
  const [products, setProducts] = useState<ProductResponse[] | null | undefined>(null);

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
      }
    }
    fetchProducts();
  }, []);
  return (
    <div>
      {/* Fetching the API */}
      {products === null && (
        <>
          <div>Loading Products...</div>
        </>
      )}

      {/* No product */}
      {products === undefined && (
        <>
          <div>No Products</div>
        </>
      )}

      {/* Show products */}
      {products !== null && products !== undefined && (
        <>
          {/* Table */}
          <Flex flexDirection="column" rounded="1rem" bgColor="#132337" padding="1.5rem" gap="1rem">
            <Flex flexDirection="row">
              <Text fontSize="2xl">Product List</Text>
              <Spacer />
              <Button>Add product</Button>
            </Flex>
            <TableContainer>
              <Table variant="simple" colorScheme="blackAlpha">
                <Thead bgColor={"#1c2e45"}>
                  <Tr>
                    <Th color="white">Name</Th>
                    <Th color="white">Category</Th>
                    <Th color="white">Subcategory</Th>
                    <Th color="white" isNumeric>
                      Price
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {products.map((product: ProductResponse) => (
                    <Tr key={product.id}>
                      <Td>{product.product_name}</Td>
                      <Td>{product.product_category}</Td>
                      <Td>{product.product_sub_category}</Td>
                      <Td isNumeric>{product.product_price}</Td>
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
