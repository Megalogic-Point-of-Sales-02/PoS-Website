import { RegisterRequest } from "@/interfaces/RegisterRequest";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import createConnection from "@/utils/db";

export async function POST(req: NextRequest) {
  try {
    const requestBody: RegisterRequest = await req.json();

    // Initialize connection
    const connection = await createConnection();

    // Check if username exist
    const [CheckUsernameExistData] = await connection.query(`SELECT * FROM users WHERE username = ?`, [requestBody.username]);
    if (CheckUsernameExistData[0] !== undefined) {
      return new NextResponse(JSON.stringify({ message: "Username already taken!" }), { status: 409 });
    }

    // // Check if email exist
    const [CheckEmailExistData] = await connection.query(`SELECT * FROM users WHERE email = ?`, [requestBody.email]);
    if (CheckEmailExistData[0] !== undefined) {
      return new NextResponse(JSON.stringify({ message: "Email already taken!" }), { status: 409 });
    }

    // // Encrypt the password
    const newPassword = await bcrypt.hash(requestBody.password, 10);
    const newRequestBody = {
      ...requestBody,
      password: newPassword,
      reset_token: null,
      reset_token_expiration: null,
    };

    // // Send to database
    const query = `
      INSERT INTO users 
        (username, fullname, email, password, reset_token, reset_token_expiration) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [newRequestBody.username, newRequestBody.fullname, newRequestBody.email, newRequestBody.password, newRequestBody.reset_token, newRequestBody.reset_token_expiration];

    const [registerData] = await connection.query(query, values);

    // Success
    return new NextResponse(JSON.stringify({ message: "Register Successful!" }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}
