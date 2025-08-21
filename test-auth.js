const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('Testing authentication...');
    
    // Test user lookup
    const user = await prisma.user.findUnique({
      where: { email: 'john.doe@fitwell.health' },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        isActive: true
      }
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('✅ User role:', user.role);
    console.log('✅ User active:', user.isActive);
    
    // Test password comparison
    const testPassword = 'patient123';
    const isPasswordValid = await bcrypt.compare(testPassword, user.password);
    
    console.log('✅ Password valid:', isPasswordValid);
    
    if (isPasswordValid) {
      console.log('🎉 Authentication test successful!');
      console.log('📋 Credentials:', user.email, '/', testPassword);
    } else {
      console.log('❌ Password validation failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing authentication:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();