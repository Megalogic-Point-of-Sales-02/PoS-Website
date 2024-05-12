"use client";

import { ProductResponse } from "@/interfaces/ProductResponse";
import { useEffect, useState } from "react";

const Products = () => {
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

      {/* No Customer */}
      {products === undefined && (
        <>
          <div>No Products</div>
        </>
      )}

      {/* Show Customers */}
      {products !== null && products !== undefined && (
        <>
          <ul>
            {products.map((product: ProductResponse) => (
              <li key={product.id}>
                Product Name: {product.product_name}, Category: {product.product_category}, Sub Category: {product.product_sub_category}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Products;
