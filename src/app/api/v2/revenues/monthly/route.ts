import checkToken from "@/utils/checkToken";
import createConnection from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const tokenResponse = checkToken(req);
    if (tokenResponse !== true) return tokenResponse;

    // Get the search params from url
    const searchParams = req.nextUrl.searchParams;
    const date = searchParams.get("date-prefix");

    const connection = await createConnection();
    const [result] = await connection.query(
      `SELECT SUM(p.product_price) AS total
       FROM orders o
       INNER JOIN products p ON o.product_id = p.id
       WHERE DATE_FORMAT(o.order_date, '%Y-%m') LIKE CONCAT(?, '%')`,
      [date]
    );

    const finalData = Number(result[0]["total"]);

    return new NextResponse(JSON.stringify(finalData), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}
