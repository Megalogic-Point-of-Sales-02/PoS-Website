import checkToken from "@/utils/checkToken";
import { CustomerRequest } from "@/interfaces/CustomerRequest";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const tokenResponse = checkToken(req);
  if (tokenResponse !== true) return tokenResponse;

  // Get the data
  // query = "SELECT count(id) FROM customers"
  const { data, error } = await supabase.rpc("total_customer");

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
