const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function assignAllFeaturesToAdmin() {
  try {
    console.log('Starting to assign all features to admin account...')

    // Get the admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@fitwell.health' }
    })

    if (!adminUser) {
      console.error('Admin user not found!')
      return
    }

    // Get the admin record
    const admin = await prisma.admin.findFirst({
      where: { userId: adminUser.id }
    })

    if (!admin) {
      console.error('Admin record not found!')
      return
    }

    // Get the super admin for granting features
    const superAdmin = await prisma.superAdmin.findFirst()

    if (!superAdmin) {
      console.error('Super admin not found!')
      return
    }

    // Get all available features
    const features = await prisma.feature.findMany({
      where: { isActive: true }
    })

    console.log(`Found ${features.length} features to assign`)

    // Assign each feature to the admin
    for (const feature of features) {
      // Check if the feature is already assigned
      const existingAssignment = await prisma.adminFeature.findUnique({
        where: {
          adminId_featureId: {
            adminId: admin.id,
            featureId: feature.id
          }
        }
      })

      if (!existingAssignment) {
        await prisma.adminFeature.create({
          data: {
            adminId: admin.id,
            featureId: feature.id,
            isActive: true,
            grantedBy: superAdmin.id,
            grantedAt: new Date()
          }
        })
        console.log(`Assigned feature: ${feature.name}`)
      } else {
        console.log(`Feature already assigned: ${feature.name}`)
      }
    }

    // Also add some additional features that might be missing
    const additionalFeatures = [
      {
        name: 'Organization Management',
        description: 'Manage organizations and bulk onboarding',
        category: 'ORGANIZATIONS'
      },
      {
        name: 'Network Management',
        description: 'Manage network users and partners',
        category: 'NETWORK'
      },
      {
        name: 'System Settings',
        description: 'Configure system settings and preferences',
        category: 'SETTINGS'
      },
      {
        name: 'Audit Logs',
        description: 'View system audit logs and activities',
        category: 'AUDIT'
      },
      {
        name: 'Notification Management',
        description: 'Manage system notifications and alerts',
        category: 'NOTIFICATIONS'
      }
    ]

    for (const featureData of additionalFeatures) {
      let feature = await prisma.feature.findUnique({
        where: { name: featureData.name }
      })

      if (!feature) {
        feature = await prisma.feature.create({
          data: featureData
        })
        console.log(`Created additional feature: ${feature.name}`)
      }

      // Assign the new feature to admin
      const existingAssignment = await prisma.adminFeature.findUnique({
        where: {
          adminId_featureId: {
            adminId: admin.id,
            featureId: feature.id
          }
        }
      })

      if (!existingAssignment) {
        await prisma.adminFeature.create({
          data: {
            adminId: admin.id,
            featureId: feature.id,
            isActive: true,
            grantedBy: superAdmin.id,
            grantedAt: new Date()
          }
        })
        console.log(`Assigned additional feature: ${feature.name}`)
      }
    }

    console.log('All features have been assigned to the admin account!')
    
    // Verify the assignments
    const adminFeatures = await prisma.adminFeature.findMany({
      where: { adminId: admin.id },
      include: { feature: true }
    })

    console.log(`\nAdmin now has ${adminFeatures.length} features:`)
    adminFeatures.forEach(af => {
      console.log(`- ${af.feature.name} (${af.feature.category})`)
    })

  } catch (error) {
    console.error('Error assigning features:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the function
assignAllFeaturesToAdmin()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })