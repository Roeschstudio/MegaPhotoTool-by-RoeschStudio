import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Socket.IO is not fully supported in Vercel serverless functions
// This is a placeholder that returns a proper response
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Socket.IO endpoint - WebSocket connections are handled differently in production',
    note: 'For real-time functionality, consider using Vercel Edge Functions with WebSockets or a third-party service'
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Socket.IO endpoint - WebSocket connections are handled differently in production',
    note: 'For real-time functionality, consider using Vercel Edge Functions with WebSockets or a third-party service'
  });
}