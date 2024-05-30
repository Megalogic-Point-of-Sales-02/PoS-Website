import checkToken from "@/utils/checkToken";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

// This is a function to get distinct of customers ids that is in order table
export async function GET(req: NextRequest) {
  const tokenResponse = checkToken(req);
  if (tokenResponse !== true) return tokenResponse;

  // Get the data
  // query = "select array(select distinct(c.id) from customers c inner join orders o on c.id=o.customer_id order by c.id asc)"
  const { data, error } = await supabase.rpc("get_distinct_customer_ids");

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
