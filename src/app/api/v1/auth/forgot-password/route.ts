import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { ForgotPasswordRequest } from "@/interfaces/ForgotPasswordRequest";
import { sendPasswordResetEmail } from "@/utils/mailer";
const crypto = require("crypto");

export async function POST(req: NextRequest) {
  const requestBody: ForgotPasswordRequest = await req.json();
  let data: any, error: any;

  // Check if email exist
  ({ data, error } = await supabase.from("users").select("*").eq("email", requestBody.email));
  if (error) {
    return new NextResponse(JSON.stringify(error.message), {
      status: 500,
    });
  }
  const length = data.length;
  if (length === 0) {
    return new NextResponse(JSON.stringify({ message: "No email registered!" }), { status: 409 });
  }

  console.log("requestBody: ", requestBody);
  // Create reset token
  const reset_token = crypto.randomBytes(32).toString("hex");
  const reset_token_expiration = new Date();
  reset_token_expiration.setHours(reset_token_expiration.getHours() + 1); // Token expires in 1 hour

  const newRequestBody = {
    ...requestBody,
    reset_token: reset_token,
    reset_token_expiration: reset_token_expiration,
  };
  console.log("new requestBody: ", newRequestBody);

  // Send to database
  ({ data, error } = await supabase.from("users").update({ reset_token: newRequestBody.reset_token, reset_token_expiration: newRequestBody.reset_token_expiration }).eq("email", newRequestBody.email).select());

  //   Check if error
  if (error) {
    return new NextResponse(JSON.stringify(error.message), {
      status: 500,
    });
  }

  // Send email
  await sendPasswordResetEmail(newRequestBody.email, newRequestBody.reset_token);

  // Success
  if (data) {
    return new NextResponse(JSON.stringify({ message: "We sent a link to your email. Please check it!" }), {
      status: 200,
    });
  }
}
