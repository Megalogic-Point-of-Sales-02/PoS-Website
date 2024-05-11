export interface Customer {
  id: number;
  customer_name: string;
  gender: "Male" | "Female" | "Other";
  age: number;
  job: string;
  segment: "Consumer" | "Corporate" | "Home Office";
  total_spend: number;
}
