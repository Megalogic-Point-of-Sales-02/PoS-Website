import { CustomerRequest } from "@/interfaces/CustomerRequest";
import createConnection from "@/utils/db";
import pool from "@/utils/db";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Perform a query
    const connection = await createConnection();
    const [data] = await connection.query("SHOW TABLES");
    return new NextResponse(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}
