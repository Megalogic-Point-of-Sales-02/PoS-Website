import { supabase } from "@/utils/supabase";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useContext } from "react";
import { CustomerChurnPredictionContext } from "../predictionContext";
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
    console.log("customers id:", customersId);

    // Get the predicted values
    const predictResponse = await fetch(`http://localhost:8000/predict`, {
      method: "POST",
      body: JSON.stringify(customersId),
    });
    let predictionResult = await predictResponse.json();
    if (!predictionResult.ok) {
      const errorMessage = await predictionResult.json();
      console.log(errorMessage);
      setCustomerChurnPredictionStatus({ status: "Error in predicting the customer churn model" });
      return;
    }
    console.log("prediction result sebelum:", predictionResult);
    predictionResult = predictionResult.result[0];
    console.log("prediction result setelah:", predictionResult);
    setCustomerChurnPredictionData(predictionResult);

    // Update churn field in the customers table for each customer ID
    for (let i = 0; i < predictionResult.length; i++) {
      const prediction = predictionResult[i]; // Get the prediction based on the i
      const customerId = predictionResult[i]; // Get the customerId based on the i
      if (prediction === "Not Churn" || prediction === "Churn") {
        const { data, error } = await supabase
          .from("customers")
          .update({ churn: prediction })
          .match({ id: customerId }) // Match the customer by their ID
          .single();

        if (error) {
          throw error;
        }
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
