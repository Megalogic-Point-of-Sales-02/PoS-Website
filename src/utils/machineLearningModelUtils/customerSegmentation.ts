import { supabase } from "@/utils/supabase";
import { Session } from "next-auth";
import { CustomerSegmentationPerformContextType } from "../types";
import createConnection from "../db";

export const triggerCustomerSegmentationPerform = async (session: Session | null, context: CustomerSegmentationPerformContextType) => {
    const { customerSegmentationPerformStatus, setCustomerSegmentationPerformStatus, customerSegmentationPerformData, setCustomerSegmentationPerformData } = context;

    try {
        setCustomerSegmentationPerformStatus({status: "processing" })

        // Get all customers id who ordered
        const methodAndHeader = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session!.user.accessToken}`,
        },
        };
        const response = await fetch("/api/v2/customers/ordered", methodAndHeader);
        if (!response.ok) {
            const errorMessage = await response.json();
            console.log(errorMessage);
            setCustomerSegmentationPerformStatus({ status: "Error in get all customers id who ordered" });
            return;
        }
        const customersId = await response.json();
    
        // Get the predicted values
        const performResponse = await fetch(`${process.env.NEXT_PUBLIC_FAST_API_URL}/cluster`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(customersId),
        });
        if (!performResponse.ok) {
            const errorMessage = await performResponse.json();
            console.log(errorMessage);
            setCustomerSegmentationPerformStatus({ status: "Error in performing the customer segmentation model" });
            return;
          }
        let performSegmentation = await performResponse.json();
        performSegmentation = performSegmentation.segmentation[0];
        setCustomerSegmentationPerformData(performSegmentation);
          
        // Update churn field in the customers table for each customer ID
        for (let i = 0; i < performSegmentation.length; i++) {
            const perform = performSegmentation[i]; // Get the perform based on the i
            const customerId = customersId[i]; // Get the customerId based on the i
            // console.log("customer id: " + customerId + " perform: " + perform);
            const connection = await createConnection();
            const query =`
            UPDATE customers
            SET segmentation = ?
            WHERE id = ?;`
            const values = [perform, customerId];
            const [data] = await connection.query(query,values);
        }
    
        // if completed, set the status to completed
        setCustomerSegmentationPerformStatus({ status: "completed" });
        console.log("Customer Segmentation Perfomance Completed");
    } catch (error) {
        console.error("Error during perform or storing perform result", error);
        setCustomerSegmentationPerformStatus({ status: "error" });
    }
};