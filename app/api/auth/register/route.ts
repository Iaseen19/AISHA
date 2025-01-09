import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  isAdmin: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    console.log("Registration attempt started");
    const body = await req.json();
    console.log("Registration request body:", { ...body, password: '[REDACTED]' });
    
    const { name, email, password, isAdmin } = registerSchema.parse(body);

    // Check if user already exists
    console.log("Checking for existing user:", email);
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("User already exists:", email);
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    console.log("Hashing password for user:", email);
    const hashedPassword = await hash(password, 12);

    // Create user
    console.log("Creating new user:", { name, email, role: isAdmin ? "ADMIN" : "USER" });
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: isAdmin ? "ADMIN" : "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    console.log("User created successfully:", { id: user.id, email: user.email, role: user.role });
    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input data", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 