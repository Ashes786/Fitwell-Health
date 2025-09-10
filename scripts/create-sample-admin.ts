import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createSampleAdmin() {
  try {
    // Check if super admin exists
    const superAdmin = await prisma.superAdmin.findFirst()
    if (!superAdmin) {
      console.log('No super admin found. Please create a super admin first.')
      return
    }

    // Check if sample admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    })

    if (existingAdmin) {
      console.log('Sample admin already exists.')
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Create user and admin in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name: 'Sample Admin',
          email: 'admin@example.com',
          password: hashedPassword,
          phone: '+1234567890',
          role: 'ADMIN'
        }
      })

      // Create admin with default permissions
      const admin = await tx.admin.create({
        data: {
          userId: user.id,
          networkName: 'Sample Healthcare Network',
          createdBy: superAdmin.id,
          permissions: JSON.stringify({
            userManagement: true,
            appointments: true,
            billing: true,
            reports: true,
            patients: true,
            doctors: true,
            subscriptions: true,
            analytics: true
          })
        }
      })

      return { user, admin }
    })

    console.log('Sample admin created successfully:')
    console.log('Email: admin@example.com')
    console.log('Password: admin123')
    console.log('Network Name: Sample Healthcare Network')

  } catch (error) {
    console.error('Error creating sample admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleAdmin()