import checkToken from "@/utils/checkToken";
import { CustomerRequest } from "@/interfaces/CustomerRequest";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import createConnection from "@/utils/db";

export async function GET(req: NextRequest) {
  try {
    // const tokenResponse = checkToken(req);
    // if(tokenResponse !== true) return tokenResponse;

    // Perform a query
    const connection = await createConnection();
    const query = `SELECT count(id) FROM customers`;

    const [data] = await connection.query(query);
    const finalData = data[0]["count(id)"]; //  Turns [{"count(id)": 10}] into 10
    return new NextResponse(JSON.stringify(finalData), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}
