import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { Prisma } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const role = session.user.role;

    // Get basic metrics
    const totalSessions = await prisma.appointment.count({
      where: role === 'THERAPIST' 
        ? { therapist: { userId } } 
        : { patientId: userId },
    });

    const activePatients = await prisma.user.count({
      where: {
        role: 'PATIENT',
        patientAppointments: {
          some: {
            therapist: { userId },
            status: 'SCHEDULED',
          },
        },
      },
    });

    // Calculate average session duration
    const analytics = await prisma.analyticsData.aggregate({
      where: role === 'THERAPIST' ? { userId } : undefined,
      _avg: {
        sessionDuration: true,
      },
    });

    // Get session trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessionTrends = await prisma.appointment.groupBy({
      by: ['datetime'],
      where: {
        datetime: {
          gte: thirtyDaysAgo,
        },
        ...(role === 'THERAPIST' 
          ? { therapist: { userId } } 
          : { patientId: userId }),
      },
      _count: {
        id: true,
      },
    });

    // Get demographics data
    const demographics = await prisma.user.groupBy({
      by: ['role'],
      where: {
        patientAppointments: {
          some: {
            therapist: { userId },
          },
        },
      },
      _count: {
        id: true,
      },
    });

    // Calculate progress metrics
    const progressMetrics = await prisma.analyticsData.findMany({
      where: {
        userId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        progressMetrics: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const response = {
      totalSessions,
      activePatients,
      avgSessionDuration: Math.round(analytics._avg.sessionDuration || 0),
      satisfaction: 92, // Placeholder - implement actual calculation
      sessionTrends: sessionTrends.map((trend: { datetime: Date; _count: { id: number } }) => ({
        date: trend.datetime,
        sessions: trend._count.id,
      })),
      demographics: demographics.map((demo: { role: string; _count: { id: number } }) => ({
        name: demo.role,
        value: demo._count.id,
      })),
      progress: progressMetrics.map((metric: { createdAt: Date; progressMetrics: any[] }) => ({
        week: metric.createdAt,
        improvement: metric.progressMetrics,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 