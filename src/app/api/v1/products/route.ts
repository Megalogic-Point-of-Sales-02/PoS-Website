import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import { ProductRequest } from "@/interfaces/ProductRequest";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  let data, error;

  // API to get the product based on id
  if (searchParams.get("id") !== null) {
    const id = searchParams.get("id");
    ({ data, error } = await supabase.from("products").select("*").eq("id", Number(id)));
    console.log("MASUK BE");
    console.log(id);
  } else {
    // API to get all products
    ({ data, error } = await supabase.from("products").select("*"));
  }

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

export async function POST(req: NextRequest) {
  // Get the request body
  const requestBody: ProductRequest = await req.json();
  console.log("data: ", requestBody);

  // Insert the data
  const { data, error } = await supabase.from("products").insert([requestBody]).select();

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

export async function DELETE(req: NextRequest) {
  // Get the request body
  const requestBody = await req.json();
  const { error } = await supabase.from("products").delete().eq("id", requestBody.id);

  // Error
  if (error) {
    return new NextResponse(JSON.stringify(error.message), {
      status: 500,
    });
  }

  // Success
  return new NextResponse(JSON.stringify({ message: `Berhasil menghapus order dengan id: ${requestBody.id}` }), {
    status: 200,
  });
}
