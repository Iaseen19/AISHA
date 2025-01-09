import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

type UserRole = 'PATIENT' | 'THERAPIST' | 'ADMIN';

const UserRole = {
  PATIENT: 'PATIENT',
  THERAPIST: 'THERAPIST',
  ADMIN: 'ADMIN',
} as const;

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = new URL(req.url).searchParams;
    const specialization = searchParams.get('specialization');
    const availability = searchParams.get('availability');

    let query: any = {
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        availability: true,
      },
    };

    if (specialization) {
      query.where = {
        ...query.where,
        specializations: {
          has: specialization,
        },
      };
    }

    const therapists = await prisma.therapist.findMany(query);
    return NextResponse.json(therapists);
  } catch (error) {
    console.error('Error fetching therapists:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { userId, specializations, availability } = data;

    const therapist = await prisma.therapist.create({
      data: {
        userId,
        specializations,
        availability: {
          createMany: {
            data: availability,
          },
        },
      },
      include: {
        user: true,
        availability: true,
      },
    });

    return NextResponse.json(therapist);
  } catch (error) {
    console.error('Error creating therapist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 