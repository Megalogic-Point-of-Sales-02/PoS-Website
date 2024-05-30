// types.d.ts
export interface CustomerChurnPredictionContextType {
  customerChurnPredictionStatus: { status: string };
  setCustomerChurnPredictionStatus: (status: { status: string }) => void;
  customerChurnPredictionData: { result: string[][] } | null;
  setCustomerChurnPredictionData: (data: { result: string[][] } | null) => void;
}
