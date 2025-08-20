import { db } from './src/lib/db'

const defaultFeatures = [
  // Dashboard Features
  {
    name: 'Dashboard Overview',
    description: 'View main dashboard with analytics and overview',
    category: 'DASHBOARD',
    icon: 'LayoutDashboard',
    path: '/dashboard'
  },
  {
    name: 'Analytics Dashboard',
    description: 'Access detailed analytics and reports',
    category: 'DASHBOARD',
    icon: 'ChartBar',
    path: '/dashboard/analytics'
  },
  
  // User Management Features
  {
    name: 'User Management',
    description: 'Manage system users',
    category: 'USER_MANAGEMENT',
    icon: 'Users',
    path: '/dashboard/users'
  },
  {
    name: 'Doctor Management',
    description: 'Manage doctors in the system',
    category: 'USER_MANAGEMENT',
    icon: 'Stethoscope',
    path: '/dashboard/doctors'
  },
  {
    name: 'Patient Management',
    description: 'Manage patient records',
    category: 'USER_MANAGEMENT',
    icon: 'UserCheck',
    path: '/dashboard/patients'
  },
  
  // Appointment Features
  {
    name: 'Appointment Scheduling',
    description: 'Schedule and manage appointments',
    category: 'APPOINTMENTS',
    icon: 'Calendar',
    path: '/dashboard/appointments'
  },
  {
    name: 'Book Appointment',
    description: 'Book new appointments',
    category: 'APPOINTMENTS',
    icon: 'Plus',
    path: '/dashboard/book-appointment'
  },
  {
    name: 'Doctor Assignment',
    description: 'Assign doctors to appointments',
    category: 'APPOINTMENTS',
    icon: 'Clipboard',
    path: '/dashboard/doctor-assignment'
  },
  
  // Medical Records Features
  {
    name: 'Health Records',
    description: 'Access patient health records',
    category: 'MEDICAL_RECORDS',
    icon: 'FileText',
    path: '/dashboard/health-records'
  },
  {
    name: 'Prescriptions',
    description: 'Manage patient prescriptions',
    category: 'MEDICAL_RECORDS',
    icon: 'FileText',
    path: '/dashboard/prescriptions'
  },
  {
    name: 'Vitals Monitoring',
    description: 'Monitor patient vitals',
    category: 'MEDICAL_RECORDS',
    icon: 'HeartPulse',
    path: '/dashboard/vitals'
  },
  
  // Communication Features
  {
    name: 'Messaging System',
    description: 'Send and receive messages',
    category: 'COMMUNICATION',
    icon: 'MessageSquare',
    path: '/dashboard/messages'
  },
  {
    name: 'Notifications',
    description: 'Manage system notifications',
    category: 'COMMUNICATION',
    icon: 'Bell',
    path: '/dashboard/notifications'
  },
  
  // Admin Features
  {
    name: 'Admin Management',
    description: 'Manage admin users',
    category: 'ADMIN',
    icon: 'Users',
    path: '/dashboard/admin/admins'
  },
  {
    name: 'Subscription Plans',
    description: 'Manage subscription plans',
    category: 'ADMIN',
    icon: 'DollarSign',
    path: '/dashboard/admin/subscription-plans'
  },
  {
    name: 'Network Management',
    description: 'Manage network partners',
    category: 'ADMIN',
    icon: 'Building',
    path: '/dashboard/admin/network'
  },
  
  // Super Admin Features
  {
    name: 'System Status',
    description: 'Monitor system status and performance',
    category: 'SUPER_ADMIN',
    icon: 'Server',
    path: '/dashboard/super-admin/system-status'
  },
  {
    name: 'Feature Management',
    description: 'Manage system features and permissions',
    category: 'SUPER_ADMIN',
    icon: 'Settings',
    path: '/dashboard/super-admin/features'
  },
  {
    name: 'System Analytics',
    description: 'View system-wide analytics',
    category: 'SUPER_ADMIN',
    icon: 'ChartBar',
    path: '/dashboard/super-admin/analytics'
  },
  
  // AI Features
  {
    name: 'AI Health Reports',
    description: 'Generate AI-powered health reports',
    category: 'AI_FEATURES',
    icon: 'FileText',
    path: '/dashboard/ai-reports'
  },
  
  // Billing Features
  {
    name: 'Billing Management',
    description: 'Manage billing and payments',
    category: 'BILLING',
    icon: 'DollarSign',
    path: '/dashboard/billing'
  },
  
  // Settings Features
  {
    name: 'Profile Settings',
    description: 'Manage user profile',
    category: 'SETTINGS',
    icon: 'User',
    path: '/dashboard/profile'
  },
  {
    name: 'System Settings',
    description: 'Manage system settings',
    category: 'SETTINGS',
    icon: 'Settings',
    path: '/dashboard/settings'
  }
]

async function seedFeatures() {
  try {
    console.log('Seeding features...')
    
    for (const feature of defaultFeatures) {
      const existingFeature = await db.feature.findUnique({
        where: { name: feature.name }
      })
      
      if (!existingFeature) {
        await db.feature.create({
          data: feature
        })
        console.log(`Created feature: ${feature.name}`)
      } else {
        console.log(`Feature already exists: ${feature.name}`)
      }
    }
    
    console.log('Features seeding completed!')
  } catch (error) {
    console.error('Error seeding features:', error)
  } finally {
    await db.$disconnect()
  }
}

seedFeatures()