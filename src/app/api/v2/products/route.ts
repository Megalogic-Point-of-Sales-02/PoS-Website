import { ProductRequest } from "@/interfaces/ProductRequest";
import checkToken from "@/utils/checkToken";
import createConnection from "@/utils/db";
import pool from "@/utils/db";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // const tokenResponse = checkToken(req);
    // if(tokenResponse !== true) return tokenResponse;

    // Perform a query
    const connection = await createConnection();
    const [data] = await connection.query("SELECT * FROM PRODUCTS");
    console.log(data);
    return new NextResponse(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    // const tokenResponse = checkToken(req);
    // if(tokenResponse !== true) return tokenResponse;

    // Get the request body
    const requestBody: ProductRequest = await req.json();
    console.log("data: ", requestBody);

    // Insert the data using mysql2 connection
    const connection = await createConnection();

    const query = `
      INSERT INTO PRODUCTS 
        (product_name, product_category, product_sub_category, product_price) 
      VALUES (?, ?, ?, ?)
    `;
    const values = [requestBody.product_name, requestBody.product_category, requestBody.product_sub_category, requestBody.product_price];

    const [data] = await connection.query(query, values);
    console.log(data);
    // Datanya bakal ky gini klo berhasil
    // {
    //   "fieldCount": 0,
    //   "affectedRows": 1,
    //   "insertId": 3,
    //   "info": "",
    //   "serverStatus": 2,
    //   "warningStatus": 0,
    //   "changedRows": 0
    // }

    return new NextResponse(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    // Datanya bakal gini klo error
    // {
    //   "message": "Table 'megalogic_dummy.products' doesn't exist",
    //   "code": "ER_NO_SUCH_TABLE",
    //   "errno": 1146,
    //   "sql": "\n      INSERT INTO PRODUCTS \n        (product_name, product_category, product_sub_category, product_price) \n      VALUES ('Raihan Kusss', 'Male', 35, 'Data Scientist', 'Home Office', 0)\n    ",
    //   "sqlState": "42S02",
    //   "sqlMessage": "Table 'megalogic_dummy.products' doesn't exist"
    // }
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // const tokenResponse = checkToken(req);
    // if(tokenResponse !== true) return tokenResponse;

    // Get the request body
    const requestBody = await req.json();

    // Extract the id from the request body
    const productId = requestBody.id;

    // Check if id is provided
    if (!productId) {
      throw new Error("Product ID is required");
    }

    // Delete the data using mysql2
    const connection = await createConnection();

    const query = "DELETE FROM PRODUCTS WHERE id = ?";
    const [data] = await connection.query(query, [productId]);

    // Datanya bakal ky gini klo berhasil
    // {
    //   "fieldCount": 0,
    //   "affectedRows": 1,
    //   "insertId": 0,
    //   "info": "",
    //   "serverStatus": 2,
    //   "warningStatus": 0,
    //   "changedRows": 0
    // }

    // gini klo gagal (status response tetep 200)
    // {
    //   "fieldCount": 0,
    //   "affectedRows": 0,
    //   "insertId": 0,
    //   "info": "",
    //   "serverStatus": 2,
    //   "warningStatus": 0,
    //   "changedRows": 0
    // }

    // Tidak ada rows yg berubah
    if (data["affectedRows"] === 0) {
      return new NextResponse(JSON.stringify({ message: "Tidak ada rows yang berubah" }), {
        status: 500,
      });
    }

    // Ada rows yg berubah
    return new NextResponse(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    // Datanya bakal gini klo error
    // {
    //   "message": "Table 'megalogic_dummy.products' doesn't exist",
    //   "code": "ER_NO_SUCH_TABLE",
    //   "errno": 1146,
    //   "sql": "DELETE FROM PRODUCTS WHERE id = 3",
    //   "sqlState": "42S02",
    //   "sqlMessage": "Table 'megalogic_dummy.products' doesn't exist"
    // }
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}
