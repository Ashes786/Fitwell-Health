import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

export async function main() {
  console.log('Starting database seeding...')

  // Create Super Admin
  console.log('Creating Super Admin...')
  const superAdminEmail = 'superadmin@fitwell.health'
  const existingSuperAdmin = await db.user.findUnique({
    where: { email: superAdminEmail }
  })

  if (!existingSuperAdmin) {
    const hashedPassword = await bcrypt.hash('superadmin123', 12)
    const superAdminUser = await db.user.create({
      data: {
        email: superAdminEmail,
        password: hashedPassword,
        name: 'Super Admin',
        role: UserRole.SUPER_ADMIN
      }
    })

    await db.superAdmin.create({
      data: {
        userId: superAdminUser.id
      }
    })
    console.log('✅ Created Super Admin: superadmin@fitwell.health / superadmin123')
  } else {
    console.log('✅ Super Admin already exists')
  }

  // Create Admin
  console.log('Creating Admin...')
  const adminEmail = 'admin@fitwell.health'
  const existingAdmin = await db.user.findUnique({
    where: { email: adminEmail }
  })

  let adminUser
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 12)
    adminUser = await db.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Network Admin',
        role: UserRole.ADMIN
      }
    })

    const superAdmin = await db.superAdmin.findFirst()
    if (superAdmin) {
      await db.admin.create({
        data: {
          userId: adminUser.id,
          networkName: 'HealthCare Network',
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
    }
    console.log('✅ Created Admin: admin@fitwell.health / admin123')
  } else {
    adminUser = existingAdmin
    console.log('✅ Admin already exists')
  }

  // Create System Status entries
  console.log('Creating System Status entries...')
  const systemStatuses = [
    {
      serviceName: 'DATABASE',
      status: 'ONLINE',
      responseTime: 15,
      message: 'Database connection is stable'
    },
    {
      serviceName: 'API',
      status: 'ONLINE',
      responseTime: 25,
      message: 'API services are running normally'
    },
    {
      serviceName: 'STORAGE',
      status: 'ONLINE',
      responseTime: 30,
      message: 'File storage is operational'
    }
  ]

  const superAdmin = await db.superAdmin.findFirst()
  if (superAdmin) {
    for (const status of systemStatuses) {
      const existingStatus = await db.systemStatus.findFirst({
        where: { 
          superAdminId: superAdmin.id,
          serviceName: status.serviceName 
        }
      })

      if (!existingStatus) {
        await db.systemStatus.create({
          data: {
            superAdminId: superAdmin.id,
            ...status,
            status: status.status as 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'MAINTENANCE'
          }
        })
        console.log(`✅ Created system status: ${status.serviceName}`)
      }
    }
  }

  // Create Sample Subscription Plan
  console.log('Creating Sample Subscription Plan...')
  const admin = await db.admin.findFirst()
  if (admin) {
    const existingPlan = await db.subscriptionPlan.findFirst({
      where: { name: 'Premium Health Plan' }
    })

    if (!existingPlan) {
      await db.subscriptionPlan.create({
        data: {
          adminId: admin.id,
          name: 'Premium Health Plan',
          description: 'Comprehensive healthcare plan for all users',
          price: 99.99,
          duration: 30,
          durationUnit: 'DAYS',
          category: 'PREMIUM',
          features: JSON.stringify(['user-management', 'analytics-reports', 'partner-management']),
          isActive: true
        }
      })
      console.log('✅ Created sample subscription plan')
    }
  }

  // Create Doctors
  console.log('Creating Doctors...')
  const doctors = [
    {
      email: 'sarah.johnson@fitwell.health',
      password: 'doctor123',
      name: 'Dr. Sarah Johnson',
      phone: '+1 (555) 123-4567',
      licenseNumber: 'MD123456',
      specialization: 'Cardiologist',
      experience: 15,
      rating: 4.8,
      consultationFee: 150,
      city: 'New York',
      bio: 'Experienced cardiologist specializing in heart disease prevention and treatment.'
    },
    {
      email: 'michael.chen@fitwell.health',
      password: 'doctor123',
      name: 'Dr. Michael Chen',
      phone: '+1 (555) 234-5678',
      licenseNumber: 'MD234567',
      specialization: 'Dermatologist',
      experience: 12,
      rating: 4.9,
      consultationFee: 200,
      city: 'Los Angeles',
      bio: 'Board-certified dermatologist with expertise in skin cancer detection and treatment.'
    },
    {
      email: 'emily.rodriguez@fitwell.health',
      password: 'doctor123',
      name: 'Dr. Emily Rodriguez',
      phone: '+1 (555) 345-6789',
      licenseNumber: 'MD345678',
      specialization: 'General Practitioner',
      experience: 8,
      rating: 4.7,
      consultationFee: 100,
      city: 'Chicago',
      bio: 'Family medicine physician providing comprehensive healthcare for all ages.'
    }
  ]

  for (const doctor of doctors) {
    const existingDoctor = await db.user.findUnique({
      where: { email: doctor.email },
      include: { doctor: true }
    })

    if (!existingDoctor) {
      const hashedPassword = await bcrypt.hash(doctor.password, 12)
      const user = await db.user.create({
        data: {
          email: doctor.email,
          password: hashedPassword,
          name: doctor.name,
          phone: doctor.phone,
          role: UserRole.DOCTOR
        }
      })
      
      await db.doctor.create({
        data: {
          userId: user.id,
          licenseNumber: doctor.licenseNumber,
          specialization: doctor.specialization,
          experience: doctor.experience,
          rating: doctor.rating,
          consultationFee: doctor.consultationFee,
          city: doctor.city,
          bio: doctor.bio
        }
      })
      
      console.log(`✅ Created doctor: ${doctor.name} (${doctor.email})`)
    }
  }

  // Create Patients
  console.log('Creating Patients...')
  const patients = [
    {
      email: 'john.doe@fitwell.health',
      password: 'patient123',
      name: 'John Doe',
      phone: '+1 (555) 111-2222',
      dateOfBirth: new Date('1980-01-15'),
      gender: 'MALE',
      bloodGroup: 'A+',
      city: 'New York',
      address: '123 Main St, New York, NY 10001'
    },
    {
      email: 'jane.smith@fitwell.health',
      password: 'patient123',
      name: 'Jane Smith',
      phone: '+1 (555) 222-3333',
      dateOfBirth: new Date('1985-03-22'),
      gender: 'FEMALE',
      bloodGroup: 'B+',
      city: 'Los Angeles',
      address: '456 Oak Ave, Los Angeles, CA 90210'
    },
    {
      email: 'robert.brown@fitwell.health',
      password: 'patient123',
      name: 'Robert Brown',
      phone: '+1 (555) 333-4444',
      dateOfBirth: new Date('1975-07-10'),
      gender: 'MALE',
      bloodGroup: 'O+',
      city: 'Chicago',
      address: '789 Elm St, Chicago, IL 60601'
    }
  ]

  for (const patient of patients) {
    const existingPatient = await db.user.findUnique({
      where: { email: patient.email },
      include: { patient: true }
    })

    if (!existingPatient) {
      const hashedPassword = await bcrypt.hash(patient.password, 12)
      const user = await db.user.create({
        data: {
          email: patient.email,
          password: hashedPassword,
          name: patient.name,
          phone: patient.phone,
          role: UserRole.PATIENT
        }
      })
      
      await db.patient.create({
        data: {
          userId: user.id,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender as 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY',
          bloodGroup: patient.bloodGroup,
          city: patient.city,
          address: patient.address
        }
      })
      
      console.log(`✅ Created patient: ${patient.name} (${patient.email})`)
    }
  }

  // Create Attendant
  console.log('Creating Attendant...')
  const attendantEmail = 'attendant@fitwell.health'
  const existingAttendant = await db.user.findUnique({
    where: { email: attendantEmail },
    include: { attendant: true }
  })

  if (!existingAttendant) {
    const hashedPassword = await bcrypt.hash('staff123', 12)
    const user = await db.user.create({
      data: {
        email: attendantEmail,
        password: hashedPassword,
        name: 'Service Attendant',
        phone: '+1 (555) 999-8888',
        role: UserRole.ATTENDANT
      }
    })
    
    await db.attendant.create({
      data: {
        userId: user.id,
        employeeId: 'ATT001',
        department: 'Patient Services'
      }
    })
    
    console.log(`✅ Created attendant: Service Attendant (${attendantEmail})`)
  }

  // Create Control Room Staff
  console.log('Creating Control Room Staff...')
  const controlEmail = 'control@fitwell.health'
  const existingControl = await db.user.findUnique({
    where: { email: controlEmail },
    include: { controlRoom: true }
  })

  if (!existingControl) {
    const hashedPassword = await bcrypt.hash('staff123', 12)
    const user = await db.user.create({
      data: {
        email: controlEmail,
        password: hashedPassword,
        name: 'Control Room Staff',
        phone: '+1 (555) 888-7777',
        role: UserRole.CONTROL_ROOM
      }
    })
    
    await db.controlRoom.create({
      data: {
        userId: user.id,
        employeeId: 'CTRL001'
      }
    })
    
    console.log(`✅ Created control room staff: Control Room Staff (${controlEmail})`)
  }

  console.log('\n🎉 Database seeding completed successfully!')
  console.log('\n📋 Dummy Credentials:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('👑 SUPER ADMIN:')
  console.log('   Email: superadmin@fitwell.health')
  console.log('   Password: superadmin123')
  console.log('')
  console.log('👨‍💼 ADMIN:')
  console.log('   Email: admin@fitwell.health')
  console.log('   Password: admin123')
  console.log('')
  console.log('👨‍⚕️ DOCTORS:')
  console.log('   Email: sarah.johnson@fitwell.health')
  console.log('   Password: doctor123')
  console.log('   Email: michael.chen@fitwell.health')
  console.log('   Password: doctor123')
  console.log('   Email: emily.rodriguez@fitwell.health')
  console.log('   Password: doctor123')
  console.log('')
  console.log('👥 PATIENTS:')
  console.log('   Email: john.doe@fitwell.health')
  console.log('   Password: patient123')
  console.log('   Email: jane.smith@fitwell.health')
  console.log('   Password: patient123')
  console.log('   Email: robert.brown@fitwell.health')
  console.log('   Password: patient123')
  console.log('')
  console.log('👨‍🔧 STAFF:')
  console.log('   Attendant: attendant@fitwell.health / staff123')
  console.log('   Control Room: control@fitwell.health / staff123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })