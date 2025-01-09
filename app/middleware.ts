import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store for rate limiting
const rateLimit = new Map<string, { count: number; timestamp: number }>();

export function middleware(request: NextRequest) {
  const ip = request.ip ?? 'anonymous';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 60; // Maximum requests per minute

  const currentLimit = rateLimit.get(ip) ?? { count: 0, timestamp: now };

  // Reset if outside window
  if (now - currentLimit.timestamp > windowMs) {
    currentLimit.count = 0;
    currentLimit.timestamp = now;
  }

  if (currentLimit.count >= maxRequests) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  currentLimit.count++;
  rateLimit.set(ip, currentLimit);

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}; 