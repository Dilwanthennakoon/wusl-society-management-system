const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestAdmin() {
  try {
    // Password to hash
    const plainPassword = 'test123';
    
    // Generate hashed password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    console.log('🔐 Hashed Password:', hashedPassword);
    console.log('\n');

    // Create admin in database
    const admin = await prisma.admin.create({
      data: {
        admin_name: 'Dr. Perera',
        admin_email: 'perera@university.edu',
        admin_password: hashedPassword,
        admin_role: 'Society Admin',
        status: 'Active',
      },
    });

    console.log('✅ Test Admin Created Successfully!');
    console.log('📧 Email:', admin.admin_email);
    console.log('🔑 Password: test123');
    console.log('👤 Name:', admin.admin_name);
    console.log('🎯 Role:', admin.admin_role);
    console.log('\n✨ You can now log in with these credentials!');

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Admin with this email already exists!');
      console.log('Try different email or use existing account.');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestAdmin();
