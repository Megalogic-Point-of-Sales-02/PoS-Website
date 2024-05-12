export interface OrderResponse {
  id: number;
  order_date: Date;
  ship_date: Date;
  customers: {
    customer_name: string;
  };
  products: {
    product_name: string;
  };
}
