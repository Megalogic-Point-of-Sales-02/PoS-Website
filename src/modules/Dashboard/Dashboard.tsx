"use client";

import { Customer } from "@/interfaces/Customer";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [customers, setCustomers] = useState<Customer[] | null | undefined>(null);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const { data, error } = await supabase.from("customers").select("*");
        if (error) {
          throw error;
        }
        if (data) {
          setCustomers(data);
        }
      } catch (error) {
        console.error("Error fetching customers:");
      }
    }
    fetchCustomers();
  }, []);

  return (
    <>
      <div>Dashboard</div>
      <div>Customer List</div>
      {customers !== null && customers !== undefined && (
        <>
          <ul>
            {customers.map((customer: Customer) => (
              <li key={customer.id}>
                Name: {customer.customer_name}, Gender: {customer.gender}, Age: {customer.age}, Job: {customer.job}, Segment: {customer.segment}, Total Spend: {customer.total_spend}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default Dashboard;
