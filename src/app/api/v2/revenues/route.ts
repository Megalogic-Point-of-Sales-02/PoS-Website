import checkToken from "@/utils/checkToken"
import createConnection from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try{
    // const tokenResponse = checkToken(req);
    // if (tokenResponse !== true) return tokenResponse;

    // Perform a query
    const connection = await createConnection();
    // Execute the query
    const [results] = await connection.query(`SELECT SUM(sales) AS total FROM orders;`);
    const finalData = results[0]["total"];

    return new NextResponse(JSON.stringify(finalData), {
      status: 200,
    });
 } catch(error){
    return new NextResponse(JSON.stringify(error), {
    status: 500,
    });
 }
}
