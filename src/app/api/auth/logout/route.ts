import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Clear authentication from client side
  // (Client will handle removing localStorage)
  
  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );

  return response;
}
