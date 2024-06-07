import checkToken from "@/utils/checkToken";
import createConnection from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // const tokenResponse = checkToken(req);
    // if(tokenResponse !== true) return tokenResponse;

    // Perform a query
    const connection = await createConnection();
    const query = `
    SELECT COUNT(c.id) as count, c.segmentation
    FROM customers c
    WHERE c.segmentation IS NOT NULL
    GROUP BY c.segmentation`;

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
