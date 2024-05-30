"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CustomerSegmentationPerformContextType } from "./types";

const defaultValue: CustomerSegmentationPerformContextType = {
  customerSegmentationPerformStatus: { status: "idle" },
  setCustomerSegmentationPerformStatus: () => {},
  customerSegmentationPerformData: null,
  setCustomerSegmentationPerformData: () => {},
};

export const CustomerSegmentationPerformContext = createContext<CustomerSegmentationPerformContextType>(defaultValue);

export const CustomerSegmentationPerformProvider = ({ children }: { children: ReactNode }) => {
  const [customerSegmentationPerformStatus, setCustomerSegmentationPerformStatus] = useState<{ status: string }>({ status: "idle" });
  const [customerSegmentationPerformData, setCustomerSegmentationPerformData] = useState<{ result: string[][] } | null>(null);

  return (
    <CustomerSegmentationPerformContext.Provider
      value={{
        customerSegmentationPerformStatus,
        setCustomerSegmentationPerformStatus,
        customerSegmentationPerformData,
        setCustomerSegmentationPerformData,
      }}
    >
      {children}
    </CustomerSegmentationPerformContext.Provider>
  );
};
