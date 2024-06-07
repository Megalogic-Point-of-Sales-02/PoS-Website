import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { ForgotPasswordRequest } from "@/interfaces/ForgotPasswordRequest";
import { sendPasswordResetEmail } from "@/utils/mailer";
import createConnection from "@/utils/db";
const crypto = require("crypto");

export async function POST(req: NextRequest) {
  try {
    const requestBody: ForgotPasswordRequest = await req.json();

    // Initialize connection
    const connection = await createConnection();

    // Check if email exist
    const [CheckEmailExistData] = await connection.query(`SELECT * FROM users WHERE email = ?`, [requestBody.email]);
    if (CheckEmailExistData[0] === undefined) {
      return new NextResponse(JSON.stringify({ message: "No email registered!" }), { status: 409 });
    }

    // Create reset token
    const reset_token = crypto.randomBytes(32).toString("hex");
    const reset_token_expiration = new Date();
    reset_token_expiration.setHours(reset_token_expiration.getHours() + 1); // Token expires in 1 hour

    const newRequestBody = {
      ...requestBody,
      reset_token: reset_token,
      reset_token_expiration: reset_token_expiration,
    };

    // Send to database
    const query = `
    UPDATE users
    SET reset_token = ?, reset_token_expiration = ?
    WHERE email = ?;`;
    const values = [newRequestBody.reset_token, newRequestBody.reset_token_expiration, newRequestBody.email];
    const [sendData] = await connection.query(query, values);
    // Send email
    await sendPasswordResetEmail(newRequestBody.email, newRequestBody.reset_token);

    // Success
    return new NextResponse(JSON.stringify({ message: "We sent a link to your email. Please check it!" }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}
