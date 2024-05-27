export { default } from "next-auth/middleware";

export const config = { matcher: ["/", "/dashboard/:path*", "/customers/:path*", "/orders/:path*", "/products/:path*"] }; // all routes should authenticated
