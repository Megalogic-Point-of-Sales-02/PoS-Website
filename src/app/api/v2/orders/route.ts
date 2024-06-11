import { OrderRequest } from "@/interfaces/OrderRequest";
import checkToken from "@/utils/checkToken";
import createConnection from "@/utils/db";
import pool from "@/utils/db";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const tokenResponse = checkToken(req);
    if (tokenResponse !== true) return tokenResponse;

    // Perform a query
    const connection = await createConnection();
    const [data] = await connection.query("SELECT * FROM orders_view");
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
    const requestBody: OrderRequest = await req.json();

    // Insert the data using supabase
    // query = "INSERT INTO customers (customer_name, gender, age, job, segment, total_spend) VALUES ('John Doe', 'Male', 30, 'Engineer', 'Corporate', 25000.00)"
    // const { data, error } = await supabase.from("customers").insert([requestBody]).select();

    // Insert the data using mysql2 connection
    const connection = await createConnection();

    // Insert data to order
    const insertQuery = `
      INSERT INTO orders 
        (order_date, ship_date, customer_id, product_id, quantity, sales) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    // Create the values
    const insertValues = [requestBody.order_date, requestBody.ship_date, requestBody.customer_id, requestBody.product_id, requestBody.quantity, requestBody.sales];

    const [insertData] = await connection.query(insertQuery, insertValues);

    // Update Customers Total Spend
    const incrementTotalSpendQuery = `
    UPDATE customers
    SET total_spend = total_spend + ?
    WHERE id = ?;`;
    const incrementTotalSpendValues = [requestBody.sales, requestBody.customer_id];

    const [incrementTotalSpendData] = await connection.query(incrementTotalSpendQuery, incrementTotalSpendValues);

    return new NextResponse(JSON.stringify({ message: `Order with ID ${insertData["insertId"]} added successfully` }), {
      status: 200,
    });
  } catch (error) {
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
    const orderId = requestBody.id;

    // Check if id is provided
    if (!orderId) {
      throw new Error("Order ID is required");
    }

    // Delete the data using mysql2
    const connection = await createConnection();

    const query = "DELETE FROM orders WHERE id = ?";
    const [data] = await connection.query(query, [orderId]);

    // Tidak ada rows yg berubah
    if (data["affectedRows"] === 0) {
      return new NextResponse(JSON.stringify({ message: "Tidak ada rows yang berubah" }), {
        status: 500,
      });
    }

    // Ada rows yg berubah
    return new NextResponse(JSON.stringify({ message: `Order with ID ${orderId} deleted successfully` }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}
