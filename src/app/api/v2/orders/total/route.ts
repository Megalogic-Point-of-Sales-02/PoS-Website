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
    const [rows] = await connection.query(`SELECT COUNT(id) FROM orders`);
    const finalData = rows[0]["COUNT(id)"]; //  Turns [{"count(id)": 10}] into 10

    return new NextResponse(JSON.stringify(finalData), {
      status: 200,
    });
 } catch(error){
    return new NextResponse(JSON.stringify(error), {
    status: 500,
    });
 }
}
