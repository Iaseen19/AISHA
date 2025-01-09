import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import type { JWT } from "@auth/core/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

type UserRole = 'user' | 'admin' | 'therapist';

declare module "@auth/core/types" {
  interface User {
    role: UserRole;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    }
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role: UserRole;
  }
}

const config = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { 
          label: "Email", 
          type: "email",
          placeholder: "example@example.com" 
        },
        password: { 
          label: "Password", 
          type: "password",
          placeholder: "Enter your password"
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { 
              email: (credentials.email as string).toLowerCase()
            },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              passwordHash: true,
            },
          });

          if (!user) {
            throw new Error("Invalid email or password");
          }

          const isPasswordValid = await compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as UserRole,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(config); 