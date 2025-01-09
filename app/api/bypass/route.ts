import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

type UserRole = 'PATIENT' | 'THERAPIST' | 'ADMIN';

const UserRole = {
  PATIENT: 'PATIENT',
  THERAPIST: 'THERAPIST',
  ADMIN: 'ADMIN',
} as const;

export async function GET() {
  try {
    // Create or find the default user
    const email = 'default@example.com';
    const password = 'defaultpass123';

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const hashedPassword = await hash(password, 12);
      user = await prisma.user.create({
        data: {
          email,
          name: 'Default User',
          passwordHash: hashedPassword,
          role: UserRole.PATIENT,
        },
      });
    }

    // Return the access credentials
    return NextResponse.json({
      message: 'Direct access credentials',
      credentials: {
        email,
        password,
      },
    });
  } catch (error) {
    console.error('Bypass route error:', error);
    return NextResponse.json(
      { message: 'Failed to create direct access' },
      { status: 500 }
    );
  }
} 