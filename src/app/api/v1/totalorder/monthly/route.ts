import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Get the search params from url
  const searchParams = req.nextUrl.searchParams;

  // Get the data
  const { data, error } = await supabase.rpc("total_order_monthly", { date_prefix: searchParams.get("date-prefix") }); // call for function total_order_monthly in supabase

  // Error
  if (error) {
    return new NextResponse(JSON.stringify(error.message), {
      status: 500,
    });
  }

  // Success
  if (data === null) {
    // Return no monthly Orders if data is null
    return new NextResponse(JSON.stringify("0"), {
      status: 200,
    });
  } else {
    return new NextResponse(JSON.stringify(data), {
      status: 200,
    });
  }
}
