export interface OrderResponse {
  id: number;
  order_date: Date;
  ship_date: Date;
  customer_id: number;
  product_id: number;
  quantity: number;
}
