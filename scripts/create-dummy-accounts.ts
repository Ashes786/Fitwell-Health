import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function createDummyAccounts() {
  try {
    console.log('Creating dummy accounts...')

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 12)

    // Check and create Super Admin
    const existingSuperAdmin = await db.superAdmin.findFirst()
    let superAdminId: string

    if (!existingSuperAdmin) {
      console.log('Creating Super Admin...')
      const superAdminUser = await db.user.create({
        data: {
          email: 'superadmin@healthcare.com',
          password: hashedPassword,
          name: 'Super Admin',
          role: 'SUPER_ADMIN',
        },
      })

      const superAdmin = await db.superAdmin.create({
        data: {
          userId: superAdminUser.id,
        },
      })
      superAdminId = superAdmin.id
    } else {
      console.log('Super Admin already exists')
      superAdminId = existingSuperAdmin.id
    }

    // Check and create Admin
    const existingAdmin = await db.admin.findFirst()
    if (!existingAdmin) {
      console.log('Creating Admin...')
      const adminUser = await db.user.create({
        data: {
          email: 'admin@healthcare.com',
          password: hashedPassword,
          name: 'Network Admin',
          role: 'ADMIN',
        },
      })

      await db.admin.create({
        data: {
          userId: adminUser.id,
          networkName: 'Healthcare Network',
          permissions: JSON.stringify({
            canManageUsers: true,
            canManagePartners: true,
            canManageSubscriptions: true,
            canViewAnalytics: true,
          }),
          createdBy: superAdminId,
        },
      })
    } else {
      console.log('Admin already exists')
    }

    // Check and create Patient
    const existingPatient = await db.patient.findFirst()
    if (!existingPatient) {
      console.log('Creating Patient...')
      const patientUser = await db.user.create({
        data: {
          email: 'patient@healthcare.com',
          password: hashedPassword,
          name: 'John Patient',
          phone: '+1234567890',
          role: 'PATIENT',
        },
      })

      await db.patient.create({
        data: {
          userId: patientUser.id,
          nhrNumber: 'NHR123456',
          cnicNumber: '12345-1234567-1',
          dateOfBirth: new Date('1990-01-01'),
          gender: 'MALE',
          bloodGroup: 'O+',
          emergencyContact: '+1234567891',
          address: '123 Main St, City, State',
          city: 'City',
          state: 'State',
          country: 'Country',
          postalCode: '12345',
        },
      })
    } else {
      console.log('Patient already exists')
    }

    // Check and create Doctor
    const existingDoctor = await db.doctor.findFirst()
    if (!existingDoctor) {
      console.log('Creating Doctor...')
      const doctorUser = await db.user.create({
        data: {
          email: 'doctor@healthcare.com',
          password: hashedPassword,
          name: 'Dr. Sarah Smith',
          phone: '+1234567892',
          role: 'DOCTOR',
        },
      })

      await db.doctor.create({
        data: {
          userId: doctorUser.id,
          licenseNumber: 'DOC123456',
          cnicNumber: '12345-1234567-2',
          specialization: 'General Practitioner',
          experience: 10,
          consultationFee: 100.0,
          bio: 'Experienced general practitioner with 10 years of experience in family medicine.',
          address: '456 Medical Center Dr, City, State',
          city: 'City',
          state: 'State',
          country: 'Country',
          postalCode: '12345',
        },
      })
    } else {
      console.log('Doctor already exists')
    }

    // Check and create Attendant
    const existingAttendant = await db.attendant.findFirst()
    if (!existingAttendant) {
      console.log('Creating Attendant...')
      const attendantUser = await db.user.create({
        data: {
          email: 'attendant@healthcare.com',
          password: hashedPassword,
          name: 'Mike Attendant',
          role: 'ATTENDANT',
        },
      })

      await db.attendant.create({
        data: {
          userId: attendantUser.id,
          employeeId: 'ATT123456',
          department: 'Patient Services',
        },
      })
    } else {
      console.log('Attendant already exists')
    }

    // Check and create Control Room
    const existingControlRoom = await db.controlRoom.findFirst()
    if (!existingControlRoom) {
      console.log('Creating Control Room...')
      const controlRoomUser = await db.user.create({
        data: {
          email: 'controlroom@healthcare.com',
          password: hashedPassword,
          name: 'Control Room Operator',
          role: 'CONTROL_ROOM',
        },
      })

      await db.controlRoom.create({
        data: {
          userId: controlRoomUser.id,
          employeeId: 'CR123456',
        },
      })
    } else {
      console.log('Control Room already exists')
    }

    console.log('\n✅ Dummy accounts setup completed!')
    console.log('\nLogin credentials:')
    console.log('Super Admin: superadmin@healthcare.com / password123')
    console.log('Admin: admin@healthcare.com / password123')
    console.log('Patient: patient@healthcare.com / password123')
    console.log('Doctor: doctor@healthcare.com / password123')
    console.log('Attendant: attendant@healthcare.com / password123')
    console.log('Control Room: controlroom@healthcare.com / password123')

  } catch (error) {
    console.error('Error creating dummy accounts:', error)
  } finally {
    await db.$disconnect()
  }
}

createDummyAccounts()