import { RegisterRequest } from "@/interfaces/RegisterRequest";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { ResetPasswordRequest } from "@/interfaces/ResetPasswordRequest";

export async function POST(req: NextRequest) {
  // Get the request body
  const requestBody: ResetPasswordRequest = await req.json();
  let data: any, error: any;

  // Check the email from the reset token
  ({ data, error } = await supabase.from("users").select("*").eq("reset_token", requestBody.reset_token).single());

  if (error || !data) {
    return new NextResponse(JSON.stringify(error.message), {
      status: 500,
    });
  }

  // Get the email
  const email = data.email;
  // Encrypt the password
  // Encrypt the new password
  const newPasswordEncrypted = await bcrypt.hash(requestBody.password, 10);

  // Send to database
  ({ data, error } = await supabase.from("users").update({ password: newPasswordEncrypted }).eq("email", email).select());

  // Error
  if (error) {
    return new NextResponse(JSON.stringify(error.message), {
      status: 500,
    });
  }

  // Success
  if (data) {
    return new NextResponse(JSON.stringify({ message: "Password changed successfully!" }), {
      status: 200,
    });
  }
}
