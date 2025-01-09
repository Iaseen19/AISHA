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
    if (!session || session.user.role !== UserRole.THERAPIST) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const therapistId = session.user.id;

    const patients = await prisma.user.findMany({
      where: {
        role: 'PATIENT',
        appointments: {
          some: {
            therapistId: therapistId
          }
        }
      },
      include: {
        Appointment: {
          orderBy: {
            datetime: 'desc',
          },
          take: 10,
        },
        analyticsData: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== UserRole.THERAPIST) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { email, name } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Patient already exists' },
        { status: 400 }
      );
    }

    const patient = await prisma.user.create({
      data: {
        email,
        name,
        role: UserRole.PATIENT,
      },
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== UserRole.THERAPIST) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { id, ...updateData } = data;

    const patient = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 