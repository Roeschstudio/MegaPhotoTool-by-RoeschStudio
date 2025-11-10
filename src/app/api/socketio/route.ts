import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Socket.IO placeholder for Vercel deployment
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Socket.IO endpoint',
    status: 'ok',
    note: 'WebSocket connections are not supported in this environment'
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Socket.IO endpoint',
    status: 'ok',
    note: 'WebSocket connections are not supported in this environment'
  });
}