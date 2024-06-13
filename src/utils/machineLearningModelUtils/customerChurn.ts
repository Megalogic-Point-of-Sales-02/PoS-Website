import { supabase } from "@/utils/supabase";
import { Session } from "next-auth";
import { CustomerChurnPredictionContextType } from "../types";
import createConnection from "../db";
import { CustomerUpdateRequest } from "@/interfaces/CustomerUpdateRequest";


export const triggerCustomerChurnPrediction = async (session: Session | null) => {

  try {
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
      return;
    }
    const customersId = await response.json();

    // Get the predicted values
    const predictResponse = await fetch(`${process.env.NEXT_PUBLIC_FAST_API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customersId),
    });
    if (!predictResponse.ok) {
      const errorMessage = await predictResponse.json();
      console.log(errorMessage);
      return;
    }
    let predictionResult = await predictResponse.json();
    predictionResult = predictionResult.result[0];

    // Update churn field in the customers table for each customer ID
    for (let i = 0; i < predictionResult.length; i++) {
      const prediction = predictionResult[i]; // Get the prediction based on the i
      const customerId = customersId[i]; // Get the customerId based on the i
      const reqBody: CustomerUpdateRequest = {
        customerId: customerId,
        columnName: "churn",
        value: prediction,
      };
      const updateResponse = await fetch("/api/v2/customers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session!.user.accessToken}`,
        },
        body: JSON.stringify(reqBody),
      });
      if (!updateResponse.ok) {
        const errorMessage = await updateResponse.json();
        console.log(errorMessage);
      }
      // console.log("CUST CHURN UPDATE CUST:", i)
    }

    // if completed, set the status to completed
    console.log("Customer Churn Prediction Completed");
  } catch (error) {
    console.error(error);
  }
};
