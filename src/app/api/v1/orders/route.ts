import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Get the data
  // query = "SELECT o.id, o.order_date, o.ship_date, c.customer_name, p.product_name FROM orders o INNER JOIN customers c ON o.customer_id=c.id INNER JOIN products p ON o.product_id=p.id"
  const { data, error } = await supabase.from("orders").select("id, order_date, ship_date, customers(customer_name), products(product_name)");

  // Error
  if (error) {
    return new NextResponse(JSON.stringify(error.message), {
      status: 500,
    });
  }

  // Success
  if (data) {
    return new NextResponse(JSON.stringify(data), {
      status: 200,
    });
  }
}

export async function POST(req: NextRequest) {}
