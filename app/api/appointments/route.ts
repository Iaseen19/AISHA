import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

type AppointmentType = 'VIDEO' | 'CHAT' | 'VOICE';
type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

const AppointmentStatus = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const role = session.user.role;

    const appointments = await prisma.appointment.findMany({
      where: role === UserRole.THERAPIST 
        ? { therapistId: userId }
        : { patientId: userId },
      include: {
        therapist: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        patient: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
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
    const { therapistId, datetime, type } = data;

    const appointment = await prisma.appointment.create({
      data: {
        therapistId,
        patientId: session.user.id,
        datetime: new Date(datetime),
        status: AppointmentStatus.SCHEDULED as AppointmentStatus,
        type: type as AppointmentType,
      },
      include: {
        therapist: {
          include: {
            user: true,
          },
        },
        patient: true,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { id, status, notes } = data;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { 
        status: status as AppointmentStatus,
        notes,
        updatedAt: new Date(),
      },
      include: {
        therapist: {
          include: {
            user: true,
          },
        },
        patient: true,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 