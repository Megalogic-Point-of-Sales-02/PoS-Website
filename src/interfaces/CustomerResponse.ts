export interface CustomerResponse {
  id: number;
  customer_name: string;
  gender: "Male" | "Female" | "Other";
  age: number;
  job: string;
  segment: "Consumer" | "Corporate" | "Home Office";
  total_spend: number;
  churn: string | null;
  segmentation: string | null;
  order_id_list: string | null;
}
