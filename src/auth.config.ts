import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config (no Prisma / bcrypt imports).
 * Used by middleware to read the session cookie and guard /admin.
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith("/admin/login");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin", nextUrl));
        }
        return true;
      }
      if (isOnAdmin) {
        return isLoggedIn; // redirects to signIn page when false
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
