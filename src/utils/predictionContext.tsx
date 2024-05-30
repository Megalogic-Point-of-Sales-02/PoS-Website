"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CustomerChurnPredictionContextType } from "./types";

const defaultValue: CustomerChurnPredictionContextType = {
  customerChurnPredictionStatus: { status: "idle" },
  setCustomerChurnPredictionStatus: () => {},
  customerChurnPredictionData: null,
  setCustomerChurnPredictionData: () => {},
};

export const CustomerChurnPredictionContext = createContext<CustomerChurnPredictionContextType>(defaultValue);

export const CustomerChurnPredictionProvider = ({ children }: { children: ReactNode }) => {
  const [customerChurnPredictionStatus, setCustomerChurnPredictionStatus] = useState<{ status: string }>({ status: "idle" });
  const [customerChurnPredictionData, setCustomerChurnPredictionData] = useState<{ result: string[][] } | null>(null);

  return (
    <CustomerChurnPredictionContext.Provider
      value={{
        customerChurnPredictionStatus,
        setCustomerChurnPredictionStatus,
        customerChurnPredictionData,
        setCustomerChurnPredictionData,
      }}
    >
      {children}
    </CustomerChurnPredictionContext.Provider>
  );
};
