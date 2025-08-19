import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return predefined user roles since there's no role model
    const predefinedRoles = [
      {
        id: 'PATIENT',
        name: 'Patient',
        description: 'Regular patient with access to personal health records',
        isActive: true,
        isSystemRole: true,
        permissions: ['view_own_records', 'book_appointments', 'manage_profile'],
        userAssignments: 0
      },
      {
        id: 'DOCTOR',
        name: 'Doctor',
        description: 'Medical doctor with access to patient records and appointments',
        isActive: true,
        isSystemRole: true,
        permissions: ['view_patient_records', 'manage_appointments', 'prescribe_medications', 'view_lab_results'],
        userAssignments: 0
      },
      {
        id: 'ATTENDANT',
        name: 'Attendant',
        description: 'Service attendant for patient registration and basic support',
        isActive: true,
        isSystemRole: true,
        permissions: ['register_patients', 'manage_appointments', 'basic_support'],
        userAssignments: 0
      },
      {
        id: 'CONTROL_ROOM',
        name: 'Control Room',
        description: 'Control room staff for managing doctor assignments and coordination',
        isActive: true,
        isSystemRole: true,
        permissions: ['manage_doctor_assignments', 'coordinate_appointments', 'system_monitoring'],
        userAssignments: 0
      },
      {
        id: 'ADMIN',
        name: 'Admin',
        description: 'Network administrator with full access to network management',
        isActive: true,
        isSystemRole: true,
        permissions: ['user_management', 'appointments', 'billing', 'reports', 'patients', 'doctors', 'subscriptions', 'analytics'],
        userAssignments: 0
      },
      {
        id: 'SUPER_ADMIN',
        name: 'Super Admin',
        description: 'System administrator with full system access',
        isActive: true,
        isSystemRole: true,
        permissions: ['full_system_access', 'manage_admins', 'system_configuration', 'analytics', 'security_management'],
        userAssignments: 0
      }
    ]

    // Get actual user counts for each role
    const userCounts = await db.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    })

    // Update user assignments count
    const rolesWithCounts = predefinedRoles.map(role => {
      const userCount = userCounts.find(uc => uc.role === role.id)
      return {
        ...role,
        userAssignments: userCount?._count.role || 0
      }
    })

    return NextResponse.json({
      roles: rolesWithCounts,
      pagination: {
        page: 1,
        limit: rolesWithCounts.length,
        total: rolesWithCounts.length,
        pages: 1
      }
    })
  } catch (error) {
    console.error('Error fetching roles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ 
      message: 'Role management is not available. User roles are predefined and cannot be modified.',
      availableRoles: [
        'PATIENT',
        'DOCTOR', 
        'ATTENDANT',
        'CONTROL_ROOM',
        'ADMIN',
        'SUPER_ADMIN'
      ]
    })
  } catch (error) {
    console.error('Error processing role request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}