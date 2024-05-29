import { RegisterRequest } from "@/interfaces/RegisterRequest";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const requestBody: RegisterRequest = await req.json();
  let data: any, error: any;

  // Check if username exist
  ({ data, error } = await supabase.from("users").select("*").eq("username", requestBody.username));
  if (error) {
    return new NextResponse(JSON.stringify(error.message), {
      status: 500,
    });
  }
  if (data?.length !== 0) {
    return new NextResponse(JSON.stringify({ message: "Username already taken!" }), { status: 409 });
  }

  // Check if email exist
  ({ data, error } = await supabase.from("users").select("*").eq("email", requestBody.email));
  if (error) {
    return new NextResponse(JSON.stringify(error.message), {
      status: 500,
    });
  }
  if (data?.length !== 0) {
    return new NextResponse(JSON.stringify({ message: "Email already taken!" }), { status: 409 });
  }

  console.log("requestBody: ", requestBody);
  // Encrypt the password
  const newPassword = await bcrypt.hash(requestBody.password, 10);
  const newRequestBody = {
    ...requestBody,
    password: newPassword,
    reset_token: null,
    reset_token_expiration: null,
  };
  console.log("new requestBody: ", newRequestBody);

  // Send to database
  ({ data, error } = await supabase.from("users").insert([newRequestBody]).select());

  // Error
  if (error) {
    return new NextResponse(JSON.stringify(error.message), {
      status: 500,
    });
  }

  // Success
  if (data) {
    return new NextResponse(JSON.stringify({ message: "Register Successful!" }), {
      status: 200,
    });
  }
}
