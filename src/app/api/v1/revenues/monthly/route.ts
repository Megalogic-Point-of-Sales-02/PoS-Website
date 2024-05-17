import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Get the search params from url
  const searchParams = req.nextUrl.searchParams;
  console.log(searchParams.get("date-prefix"));

  // Get the data
  // query = "select sum(product_price) from orders o INNER JOIN products p ON o.product_id=p.id WHERE CAST(o.order_date as varchar) like '2023-05%'"
  const { data, error } = await supabase.rpc("calculate_sum_product_price_monthly", { date_prefix: searchParams.get("date-prefix") }); // call for function calculate_sum_product_price_monthly in supabase

  // Error
  if (error) {
    return new NextResponse(JSON.stringify(error.message), {
      status: 500,
    });
  }

  // Success
  if (data === null) {
    // Return no monthly revenue if data is null
    return new NextResponse(JSON.stringify("0"), {
      status: 200,
    });
  } else {
    return new NextResponse(JSON.stringify(data), {
      status: 200,
    });
  }
}
