"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CustomerChurnPredictionContextType } from "./types";
import { Session } from "next-auth";
import { triggerCustomerChurnPrediction } from "./machineLearningModelUtils/customerChurn";

const defaultValue: CustomerChurnPredictionContextType = {
  triggerCustomerChurnPredictionContext: () => {},
};

export const CustomerChurnPredictionContext = createContext<CustomerChurnPredictionContextType>(defaultValue);

export const CustomerChurnPredictionProvider = ({ children }: { children: ReactNode }) => {
  const triggerCustomerChurnPredictionContext = async (session: Session) => {
    await triggerCustomerChurnPrediction(session);
    // console.log("SELESAI PREDITION CONTEXT")
  };

  return (
    <CustomerChurnPredictionContext.Provider
      value={{
        triggerCustomerChurnPredictionContext,
      }}
    >
      {children}
    </CustomerChurnPredictionContext.Provider>
  );
};
