import { OrderRequest } from "@/interfaces/OrderRequest";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Get the data
  // query = "SELECT o.id, o.order_date, o.ship_date, c.customer_name, p.product_name FROM orders o INNER JOIN customers c ON o.customer_id=c.id INNER JOIN products p ON o.product_id=p.id"
  const { data, error } = await supabase.from("orders").select("id, order_date, ship_date, customer_id, product_id");

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

export async function POST(req: NextRequest) {
  // Get the request body
  const requestBody: OrderRequest = await req.json();
  console.log("data: ", requestBody);

  // Insert the data
  // query = "INSERT INTO orders (order_date, ship_date, customer_id, product_id) VALUES ('2023-05-01', '2023-05-03', 1, 1)"
  const { data, error } = await supabase.from("orders").insert([requestBody]).select();

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

export async function DELETE(req: NextRequest) {
  // Get the request body
  const requestBody = await req.json();
  const { error } = await supabase.from("orders").delete().eq("id", requestBody.id);

  // Error
  if (error) {
    return new NextResponse(JSON.stringify(error.message), {
      status: 500,
    });
  }

  // Success
  return new NextResponse(JSON.stringify({ message: `Berhasil menghapus order dengan id: ${requestBody.id}` }), {
    status: 200,
  });
}
