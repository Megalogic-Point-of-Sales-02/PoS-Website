export interface ProductResponse {
  id: number;
  product_name: string;
  product_category: string;
  product_sub_category: string;
  product_price: number;
  order_id_list: string | null;
}
