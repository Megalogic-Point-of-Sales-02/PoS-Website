import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

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