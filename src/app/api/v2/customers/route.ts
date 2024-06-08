import { CustomerRequest } from "@/interfaces/CustomerRequest";
import { CustomerUpdateRequest } from "@/interfaces/CustomerUpdateRequest";
import checkToken from "@/utils/checkToken";
import createConnection from "@/utils/db";
import pool from "@/utils/db";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const tokenResponse = checkToken(req);
    if (tokenResponse !== true) return tokenResponse;

    // Perform a query
    const connection = await createConnection();
    const [data] = await connection.query("SELECT * FROM customers_left_join_orders_view"); // changed from table customers to get the order_id that the customers ordered
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
    const tokenResponse = checkToken(req);
    if (tokenResponse !== true) return tokenResponse;

    // Get the request body
    const requestBody: CustomerRequest = await req.json();

    // Insert the data using supabase
    // query = "INSERT INTO customers (customer_name, gender, age, job, segment, total_spend) VALUES ('John Doe', 'Male', 30, 'Engineer', 'Corporate', 25000.00)"
    // const { data, error } = await supabase.from("customers").insert([requestBody]).select();

    // Insert the data using mysql2 connection
    const connection = await createConnection();

    const query = `
      INSERT INTO customers 
        (customer_name, gender, age, job, segment, total_spend) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [requestBody.customer_name, requestBody.gender, requestBody.age, requestBody.job, requestBody.segment, requestBody.total_spend];

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

    return new NextResponse(JSON.stringify({ message: `Customer with ID ${data["insertId"]} added successfully` }), {
      status: 200,
    });
  } catch (error) {
    // Datanya bakal gini klo error
    // {
    //   "message": "Table 'megalogic_dummy.customerss' doesn't exist",
    //   "code": "ER_NO_SUCH_TABLE",
    //   "errno": 1146,
    //   "sql": "\n      INSERT INTO CUSTOMERSS \n        (customer_name, gender, age, job, segment, total_spend) \n      VALUES ('Raihan Kusss', 'Male', 35, 'Data Scientist', 'Home Office', 0)\n    ",
    //   "sqlState": "42S02",
    //   "sqlMessage": "Table 'megalogic_dummy.customerss' doesn't exist"
    // }
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const tokenResponse = checkToken(req);
    if (tokenResponse !== true) return tokenResponse;

    // Get the request body
    const requestBody = await req.json();

    // Extract the id from the request body
    const customerId = requestBody.id;

    // Check if id is provided
    if (!customerId) {
      throw new Error("Customer ID is required");
    }

    // Delete the data using mysql2
    const connection = await createConnection();

    const query = "DELETE FROM customers WHERE id = ?";
    const [data] = await connection.query(query, [customerId]);

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
    return new NextResponse(JSON.stringify({ message: `Customer with ID ${customerId} deleted successfully` }), {
      status: 200,
    });
  } catch (error) {
    // Datanya bakal gini klo error
    // {
    //   "message": "Table 'megalogic_dummy.customerss' doesn't exist",
    //   "code": "ER_NO_SUCH_TABLE",
    //   "errno": 1146,
    //   "sql": "DELETE FROM CUSTOMERSS WHERE id = 3",
    //   "sqlState": "42S02",
    //   "sqlMessage": "Table 'megalogic_dummy.customerss' doesn't exist"
    // }
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const tokenResponse = checkToken(req);
    if (tokenResponse !== true) return tokenResponse;

    // Get the request body
    const requestBody: CustomerUpdateRequest = await req.json();

    // Insert the data using mysql2 connection
    const connection = await createConnection();
    const query = `
      UPDATE customers
      SET ${connection.escapeId(requestBody.columnName)} = ?
      WHERE id = ?;`;
    const values = [requestBody.value, requestBody.customerId];
    const [data] = await connection.query(query, values);

    return new NextResponse(JSON.stringify({ message: `Customer with ID ${requestBody["customerId"]} updated successfully` }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}
