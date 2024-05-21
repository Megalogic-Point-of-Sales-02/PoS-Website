import { CustomerRequest } from "@/interfaces/CustomerRequest";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Get the data
  // query = "SELECT * FROM customers"
  const { data, error } = await supabase.from("customers").select("*");

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
  const requestBody: CustomerRequest = await req.json();
  console.log("data: ", requestBody);

  // Insert the data
  // query = "INSERT INTO customers (customer_name, gender, age, job, segment, total_spend) VALUES ('John Doe', 'Male', 30, 'Engineer', 'Corporate', 25000.00)"
  const { data, error } = await supabase.from("customers").insert([requestBody]).select();

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
  const { error } = await supabase.from("customers").delete().eq("id", requestBody.id);

  // Error
  if (error) {
    return new NextResponse(JSON.stringify(error.message), {
      status: 500,
    });
  }

  // Success
  return new NextResponse(JSON.stringify({ message: `Berhasil menghapus customers dengan id: ${requestBody.id}` }), {
    status: 200,
  });
}
