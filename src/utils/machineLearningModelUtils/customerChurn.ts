import { supabase } from "@/utils/supabase";
import { Session } from "next-auth";
import { CustomerChurnPredictionContextType } from "../types";

export const triggerCustomerChurnPrediction = async (session: Session | null, context: CustomerChurnPredictionContextType) => {
  const { customerChurnPredictionStatus, setCustomerChurnPredictionStatus, customerChurnPredictionData, setCustomerChurnPredictionData } = context;

  try {
    // Set status
    setCustomerChurnPredictionStatus({ status: "processing" });

    // Get all customers id who ordered
    const methodAndHeader = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session!.user.accessToken}`,
      },
    };
    const response = await fetch("/api/v1/customers/ordered", methodAndHeader);
    if (!response.ok) {
      const errorMessage = await response.json();
      console.log(errorMessage);
      setCustomerChurnPredictionStatus({ status: "Error in get all customers id who ordered" });
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
      setCustomerChurnPredictionStatus({ status: "Error in predicting the customer churn model" });
      return;
    }
    let predictionResult = await predictResponse.json();
    predictionResult = predictionResult.result[0];
    setCustomerChurnPredictionData(predictionResult);

    // Update churn field in the customers table for each customer ID
    for (let i = 0; i < predictionResult.length; i++) {
      const prediction = predictionResult[i]; // Get the prediction based on the i
      const customerId = customersId[i]; // Get the customerId based on the i
      // console.log("customer id: " + customerId + " prediction: " + prediction);
      const { data, error } = await supabase
        .from("customers")
        .update({ churn: prediction })
        .eq("id", customerId) // Match the customer by their ID
        .select();

      if (error) {
        throw error;
      }
    }

    // if completed, set the status to completed
    setCustomerChurnPredictionStatus({ status: "completed" });
    console.log("Customer Churn Prediction Completed");
  } catch (error) {
    console.error("Error during prediction or storing prediction result", error);
    setCustomerChurnPredictionStatus({ status: "error" });
  }
};
