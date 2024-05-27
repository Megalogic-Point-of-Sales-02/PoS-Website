import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const checkToken = (req: NextRequest) => {
  const token = req.headers.get("authorization");
  if (token === null) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized: No token provided" }), { status: 401 });
  }
  const splittedToken = token.split(" ")[1]; // Extract the token after "Bearer"
  const decoded = jwt.verify(splittedToken, process.env.NEXTAUTH_SECRET); // Verify the token
  if (decoded === null) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized: Invalid Token" }), { status: 401 });
  }
  return true;
};

export default checkToken;
