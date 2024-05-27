import { LoginRequest } from "@/interfaces/LoginRequest";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestBody: LoginRequest = await req.json();
  let data: any, error: any;

  // Check the data
  ({ data, error } = await supabase.from("users").select("*").eq("username", requestBody.username));

  // Error
  if (error) {
    return new NextResponse(JSON.stringify(error.message), {
      status: 500,
    });
  }

  // Success
  if (data) {
    return new NextResponse(JSON.stringify(data), {
      status: 200,
    });
  }
}
