export interface OrderRequest {
  order_date: Date;
  ship_date: Date;
  customer_id: number;
  product_id: number;
  quantity: number;
  sales: number;
}
