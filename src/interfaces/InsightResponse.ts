export interface InsightResponse {
    customer_id: number;
    cust_name: string;
    total_order_count: number;
    segmentation: string;
    churn: string;
    first_transaction: Date;
    last_transaction: Date;
    average_spend_per_month: number;
    days_as_customer: number;
    months_as_customer: number;
    years_as_customer: number;
  }
  