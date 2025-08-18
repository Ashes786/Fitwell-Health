const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    // Add patient management feature
    const patientManagementFeature = await prisma.feature.upsert({
      where: { 
        name: 'Patient Management' 
      },
      update: {},
      create: {
        name: 'Patient Management',
        description: 'Ability to manage patients including adding, editing, and viewing patient records',
        category: 'USER_MANAGEMENT',
        isActive: true
      }
    })

    console.log('Patient Management feature added:', patientManagementFeature)

    // Get the dummy admin account
    const admin = await prisma.admin.findFirst({
      include: {
        user: true
      }
    })

    if (!admin) {
      console.log('No admin account found. Please create an admin account first.')
      return
    }

    console.log('Found admin:', admin.user.email)

    // Get the super admin account to grant the feature
    const superAdmin = await prisma.superAdmin.findFirst({
      include: {
        user: true
      }
    })

    if (!superAdmin) {
      console.log('No super admin account found. Please create a super admin account first.')
      return
    }

    console.log('Found super admin:', superAdmin.user.email)

    // Assign the patient management feature to the admin
    const adminFeature = await prisma.adminFeature.upsert({
      where: { 
        adminId_featureId: {
          adminId: admin.id,
          featureId: patientManagementFeature.id
        }
      },
      update: {
        isActive: true
      },
      create: {
        adminId: admin.id,
        featureId: patientManagementFeature.id,
        isActive: true,
        grantedBy: superAdmin.id
      }
    })

    console.log('Patient Management feature assigned to admin:', adminFeature)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()