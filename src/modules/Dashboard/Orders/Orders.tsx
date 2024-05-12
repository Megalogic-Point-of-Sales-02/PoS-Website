"use client";

import { OrderResponse } from "@/interfaces/OrderResponse";
import { useEffect, useState } from "react";

const Orders = () => {
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
          <ul>
            {orders.map((order: OrderResponse) => (
              <li key={order.id}>
                Customer Name: {order.customer_name}, Product Name: {order.product_name}, Order Date: {order.order_date.toString()}, Ship Date: {order.ship_date.toString()}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Orders;
