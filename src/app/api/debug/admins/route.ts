import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Get all admins
    const admins = await prisma.admin.findMany();
    
    return new Response(JSON.stringify({
      admins: admins.map(a => ({
        id: a.admin_id,
        name: a.admin_name,
        email: a.admin_email,
        status: a.status,
        passwordHash: a.admin_password.substring(0, 20) + '...',
      })),
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
}
