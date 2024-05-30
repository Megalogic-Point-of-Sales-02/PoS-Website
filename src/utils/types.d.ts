// types.d.ts
export interface CustomerChurnPredictionContextType {
  customerChurnPredictionStatus: { status: string };
  setCustomerChurnPredictionStatus: (status: { status: string }) => void;
  customerChurnPredictionData: { result: string[][] } | null;
  setCustomerChurnPredictionData: (data: { result: string[][] } | null) => void;
}

export interface CustomerSegmentationPerformContextType{
  customerSegmentationPerformStatus: { status: string };
  setCustomerSegmentationPerformStatus: (status: { status: string }) => void;
  customerSegmentationPerformData: { result: string[][] } | null;
  setCustomerSegmentationPerformData: (data: { result: string[][] } | null) => void;
}