import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    const admin = await prisma.admin.findUnique({
      where: { admin_email: email },
    });
    
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Admin not found' }), { status: 404 });
    }
    
    console.log('[TEST] Admin found:', admin.admin_name);
    console.log('[TEST] Stored hash:', admin.admin_password);
    console.log('[TEST] Provided password:', password);
    
    const match = await bcrypt.compare(password, admin.admin_password);
    
    console.log('[TEST] Password match result:', match);
    
    return new Response(JSON.stringify({
      admin: admin.admin_name,
      email: admin.admin_email,
      passwordMatch: match,
      hashLength: admin.admin_password.length,
      providedPassword: password,
    }), { status: 200 });
  } catch (error) {
    console.error('[TEST] Error:', error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
}
