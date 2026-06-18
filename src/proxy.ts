import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Next.js 16 "proxy" convention (formerly "middleware").
export const { auth: proxy } = NextAuth(authConfig);

export default proxy;

export const config = {
  // Protect everything under /admin (the authorized callback allows /admin/login).
  matcher: ["/admin/:path*"],
};
