"use client";

import { CustomerResponse } from "@/interfaces/CustomerResponse";
import { useEffect, useState } from "react";

const Customers = () => {
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
          <ul>
            {customers.map((customer: CustomerResponse) => (
              <li key={customer.id}>
                Name: {customer.customer_name}, Gender: {customer.gender}, Age: {customer.age}, Job: {customer.job}, Segment: {customer.segment}, Total Spend: {customer.total_spend}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Customers;
