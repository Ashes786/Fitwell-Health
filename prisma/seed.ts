import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create a Super Admin user
  const superAdminPassword = await bcrypt.hash('password123', 12)
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@healthcare.com' },
    update: {},
    create: {
      email: 'superadmin@healthcare.com',
      password: superAdminPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  })

  // Create Super Admin profile
  const superAdminProfile = await prisma.superAdmin.upsert({
    where: { userId: superAdmin.id },
    update: {},
    create: {
      userId: superAdmin.id,
    },
  })

  // Create an Admin user
  const adminPassword = await bcrypt.hash('password123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@healthcare.com' },
    update: {},
    create: {
      email: 'admin@healthcare.com',
      password: adminPassword,
      name: 'Network Admin',
      role: 'ADMIN',
      isActive: true,
    },
  })

  // Create Admin profile
  await prisma.admin.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      networkName: 'HealthPay Network',
      permissions: JSON.stringify(['manage_users', 'manage_patients', 'manage_doctors']),
      isActive: true,
      createdBy: superAdminProfile.id,
    },
  })

  // Create a Doctor user
  const doctorPassword = await bcrypt.hash('password123', 12)
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@healthcare.com' },
    update: {},
    create: {
      email: 'doctor@healthcare.com',
      password: doctorPassword,
      name: 'Dr. Sarah Johnson',
      role: 'DOCTOR',
      isActive: true,
    },
  })

  // Create Doctor profile
  await prisma.doctor.upsert({
    where: { userId: doctor.id },
    update: {},
    create: {
      userId: doctor.id,
      licenseNumber: 'DOC123456',
      specialization: 'General Practitioner',
      experience: 10,
      rating: 4.5,
      consultationFee: 150.00,
      isAvailable: true,
      bio: 'Experienced general practitioner with 10 years of experience in family medicine.',
    },
  })

  // Create a Patient user
  const patientPassword = await bcrypt.hash('password123', 12)
  const patient = await prisma.user.upsert({
    where: { email: 'patient@healthcare.com' },
    update: {},
    create: {
      email: 'patient@healthcare.com',
      password: patientPassword,
      name: 'John Doe',
      role: 'PATIENT',
      isActive: true,
    },
  })

  // Create Patient profile
  await prisma.patient.upsert({
    where: { userId: patient.id },
    update: {},
    create: {
      userId: patient.id,
      nhrNumber: 'NHR123456',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'MALE',
      bloodGroup: 'O+',
      emergencyContact: 'Jane Doe - +1234567890',
    },
  })

  // Create an Attendant user
  const attendantPassword = await bcrypt.hash('password123', 12)
  const attendant = await prisma.user.upsert({
    where: { email: 'attendant@healthcare.com' },
    update: {},
    create: {
      email: 'attendant@healthcare.com',
      password: attendantPassword,
      name: 'Alice Smith',
      role: 'ATTENDANT',
      isActive: true,
    },
  })

  // Create Attendant profile
  await prisma.attendant.upsert({
    where: { userId: attendant.id },
    update: {},
    create: {
      userId: attendant.id,
      employeeId: 'ATT123456',
      department: 'Front Desk',
    },
  })

  // Create a Control Room user
  const controlRoomPassword = await bcrypt.hash('password123', 12)
  const controlRoom = await prisma.user.upsert({
    where: { email: 'controlroom@healthcare.com' },
    update: {},
    create: {
      email: 'controlroom@healthcare.com',
      password: controlRoomPassword,
      name: 'Control Room Operator',
      role: 'CONTROL_ROOM',
      isActive: true,
    },
  })

  // Create Control Room profile
  await prisma.controlRoom.upsert({
    where: { userId: controlRoom.id },
    update: {},
    create: {
      userId: controlRoom.id,
      employeeId: 'CTRL123456',
    },
  })

  console.log('Database seeded successfully!')
  console.log('Test users created:')
  console.log('Super Admin: superadmin@healthcare.com / password123')
  console.log('Admin: admin@healthcare.com / password123')
  console.log('Doctor: doctor@healthcare.com / password123')
  console.log('Patient: patient@healthcare.com / password123')
  console.log('Attendant: attendant@healthcare.com / password123')
  console.log('Control Room: controlroom@healthcare.com / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })