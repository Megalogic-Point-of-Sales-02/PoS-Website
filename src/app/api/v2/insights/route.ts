import checkToken from "@/utils/checkToken";
import createConnection from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
      const tokenResponse = checkToken(req);
      if (tokenResponse !== true) return tokenResponse;
  
      // Perform a query
      const connection = await createConnection();
      const [data] = await connection.query("select * from customers_insight_view");
      return new NextResponse(JSON.stringify(data), {
        status: 200,
      });
    } catch (error) {
      return new NextResponse(JSON.stringify(error), {
        status: 500,
      });
    }
  }