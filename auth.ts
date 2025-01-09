import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

interface CustomUser extends User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
}

interface CustomSession extends Session {
  user: CustomUser;
}

interface Credentials {
  email: string;
  password: string;
}

interface CustomToken extends JWT {
  id: string;
  role: UserRole;
}

export const authConfig = {
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
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const { email, password } = credentials as Credentials;

        try {
          const user = await prisma.user.findUnique({
            where: { 
              email: email.toLowerCase()
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
            return null;
          }

          const isPasswordValid = await compare(password, user.passwordHash);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
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
    async session({ session, token }): Promise<CustomSession> {
      if (!session?.user) {
        throw new Error("Missing user on session");
      }

      const customToken = token as CustomToken;

      return {
        ...session,
        user: {
          ...session.user,
          id: customToken.id,
          role: customToken.role,
        } as CustomUser,
      };
    },
    async jwt({ token, user }): Promise<CustomToken> {
      if (!token.id && user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
        } as CustomToken;
      }
      return token as CustomToken;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(authConfig); 