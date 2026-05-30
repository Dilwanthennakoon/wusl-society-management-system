import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('[LOGIN API] Request received');
    const { email, password } = await req.json();

    console.log('[LOGIN API] Email:', email);

    // Validate input
    if (!email || !password) {
      console.log('[LOGIN API] Missing email or password');
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('[LOGIN API] Querying database for admin...');
    
    // Find admin by email with timeout
    const admin = await Promise.race([
      prisma.admin.findUnique({
        where: { admin_email: email },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database query timeout')), 5000)
      ),
    ]);

    console.log('[LOGIN API] Admin found:', admin ? 'yes' : 'no');

    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if admin is active
    if (admin.status !== 'Active') {
      return NextResponse.json(
        { message: 'This account is inactive' },
        { status: 401 }
      );
    }

    console.log('[LOGIN API] Verifying password...');
    // Verify password
    const passwordMatch = await bcrypt.compare(password, admin.admin_password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('[LOGIN API] Password verified, generating token');
    // Generate JWT token
    const token = jwt.sign(
      {
        adminId: admin.admin_id,
        email: admin.admin_email,
        role: admin.admin_role,
      },
      process.env.JWT_SECRET || 'wusl_society_2026_JWT_SECRET_7xKp92LmQzA4vN8rT5sDqE1hY6bC',
      { expiresIn: '24h' }
    );

    const response = NextResponse.json(
      {
        message: 'Login successful',
        token,
        adminId: admin.admin_id,
        adminName: admin.admin_name,
        adminRole: admin.admin_role,
      },
      { status: 200 }
    );
    
    // Set cookie for middleware to read
    response.cookies.set('authToken', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });
    
    const duration = Date.now() - startTime;
    console.log(`[LOGIN API] Success (${duration}ms)`);
    return response;
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[LOGIN API] Error after ${duration}ms:`, error.message);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
