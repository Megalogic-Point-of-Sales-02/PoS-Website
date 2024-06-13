import { Session } from "next-auth";

// types.d.ts
export interface CustomerChurnPredictionContextType {
  triggerCustomerChurnPredictionContext: (session: Session) => void;
}

export interface CustomerSegmentationPerformContextType{
  triggerCustomerSegmentationPerformContext: (session: Session) => void;
}