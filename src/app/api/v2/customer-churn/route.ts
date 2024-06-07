import checkToken from "@/utils/checkToken";
import createConnection from "@/utils/db";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const tokenResponse = checkToken(req);
    if (tokenResponse !== true) return tokenResponse;

    // Perform a query
    const connection = await createConnection();
    const query = `
    SELECT c.churn, COUNT(c.id) as count
    FROM customers c
    WHERE c.churn IS NOT NULL
    GROUP BY c.churn;`;

    const [data] = await connection.query(query);
    return new NextResponse(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}
