import { LoginRequest } from "@/interfaces/LoginRequest";
import createConnection from "@/utils/db";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const requestBody: LoginRequest = await req.json();

    // Initialize connection
    const connection = await createConnection();

    // Check the data
    const [userData] = await connection.query(`SELECT * FROM users WHERE username = ?`, [requestBody.username]);

    // Data not found
    if (userData[0] === undefined) {
      return new NextResponse(JSON.stringify({ message: "User not found!" }), { status: 409 });
    }

    // Success
    return new NextResponse(JSON.stringify(userData), {
      status: 200,
    });
  } catch (error) {
    // Error
    if (error) {
      return new NextResponse(JSON.stringify(error), {
        status: 500,
      });
    }
  }
}
