"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CustomerSegmentationPerformContextType } from "./types";
import { Session } from "next-auth";
import { triggerCustomerSegmentationPerform } from "./machineLearningModelUtils/customerSegmentation";

const defaultValue: CustomerSegmentationPerformContextType = {
  triggerCustomerSegmentationPerformContext: () => {},
};

export const CustomerSegmentationPerformContext = createContext<CustomerSegmentationPerformContextType>(defaultValue);

export const CustomerSegmentationPerformProvider = ({ children }: { children: ReactNode }) => {
  const triggerCustomerSegmentationPerformContext = async (session: Session) => {
    await triggerCustomerSegmentationPerform(session);
    // console.log("SELESAI PERFORM CONTEXT")
  };
  return (
    <CustomerSegmentationPerformContext.Provider
      value={{
        triggerCustomerSegmentationPerformContext,
      }}
    >
      {children}
    </CustomerSegmentationPerformContext.Provider>
  );
};
