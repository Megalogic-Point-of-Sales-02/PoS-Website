import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Get the data
  // query = "SELECT sum(total_spend) FROM customers"
  const { data, error } = await supabase.rpc("total_spend_sum"); // call for function total_spend_sum in supabase

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
