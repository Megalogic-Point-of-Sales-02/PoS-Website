import { RegisterRequest } from "@/interfaces/RegisterRequest";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { ResetPasswordRequest } from "@/interfaces/ResetPasswordRequest";
import createConnection from "@/utils/db";

export async function POST(req: NextRequest) {
  try {
    // Get the request body
    const requestBody: ResetPasswordRequest = await req.json();
    let data: any, error: any;

    // Initialize connection
    const connection = await createConnection();

    // Check the email from the reset token
    const [emailData] = await connection.query(`SELECT users.email FROM users WHERE reset_token = ?`, [requestBody.reset_token]);
    if (emailData[0] === undefined) {
      return new NextResponse(JSON.stringify({ message: "No email registered!" }), { status: 409 });
    }

    // Get the email
    const email = emailData[0]["email"];
    // Encrypt the new password
    const newPasswordEncrypted = await bcrypt.hash(requestBody.password, 10);

    // Send to database
    const query = `
    UPDATE users
    SET password = ?
    WHERE email = ?;`;
    const values = [newPasswordEncrypted, email];
    const [changePasswordData] = await connection.query(query, values);

    // Success
    return new NextResponse(JSON.stringify({ message: "Password changed successfully!" }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}
