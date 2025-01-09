import { PrismaAdapter } from "@prisma/client/runtime/library";
import { NextAuthOptions } from "next-auth";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        
        // Fetch user role from database
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true },
        });
        
        if (user) {
          session.user.role = user.role;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  providers: [], // Add your providers here (e.g., Google, Email, etc.)
}; 