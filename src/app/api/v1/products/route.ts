import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import { ProductRequest } from "@/interfaces/ProductRequest";

export async function GET(req: NextRequest) {
    // Get the data
    const { data, error } = await supabase.from("products").select("*");
    
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