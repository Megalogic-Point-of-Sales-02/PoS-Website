import checkToken from "@/utils/checkToken";
import createConnection from "@/utils/db";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

// This is a function to get distinct of customers ids that is in order table
export async function GET(req: NextRequest) {
  try {
    const tokenResponse = checkToken(req);
    if (tokenResponse !== true) return tokenResponse;

    // Perform a query
    const connection = await createConnection();
    const query = `
    SELECT JSON_ARRAYAGG(id) AS ids
    FROM (
      SELECT DISTINCT c.id
      FROM customers c
      INNER JOIN orders o ON c.id = o.customer_id
      ORDER BY c.id ASC
    ) AS distinct_ids;`;

    const [data] = await connection.query(query);
    const finalData = JSON.parse(data[0]["ids"]); // Turns from [{ids: [1,2,3]}] into [1,2,3]

    return new NextResponse(JSON.stringify(finalData), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}
