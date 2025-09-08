import { UserRole } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

/**
 * Check if user has permission to access a specific resource
 * This ensures users can only see data within their network/organization
 */
export async function checkResourceAccess(
  userId: string,
  userRole: UserRole,
  resourceType: 'patient' | 'doctor' | 'attendant' | 'organization' | 'admin',
  resourceId?: string
): Promise<{ hasAccess: boolean; errorMessage?: string }> {
  try {
    // Super Admin has access to everything
    if (userRole === UserRole.SUPER_ADMIN) {
      return { hasAccess: true }
    }

    // Get user with their network/organization info
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        admin: true,
        patient: true,
        doctor: true,
        attendant: true,
        networkUsers: {
          include: {
            admin: true
          }
        }
      }
    })

    if (!user) {
      return { hasAccess: false, errorMessage: 'User not found' }
    }

    // Admin can only access users within their network
    if (userRole === UserRole.ADMIN) {
      const admin = user.admin
      if (!admin) {
        return { hasAccess: false, errorMessage: 'Admin profile not found' }
      }

      // Check if the resource belongs to this admin's network
      if (resourceId) {
        switch (resourceType) {
          case 'patient':
            const patient = await db.patient.findUnique({
              where: { id: resourceId },
              include: {
                user: {
                  include: {
                    networkUsers: {
                      where: { adminId: admin.id }
                    }
                  }
                }
              }
            })
            return { 
              hasAccess: !!patient?.user?.networkUsers.length,
              errorMessage: 'Patient not found in your network'
            }

          case 'doctor':
            const doctor = await db.doctor.findUnique({
              where: { id: resourceId },
              include: {
                user: {
                  include: {
                    networkUsers: {
                      where: { adminId: admin.id }
                    }
                  }
                }
              }
            })
            return { 
              hasAccess: !!doctor?.user?.networkUsers.length,
              errorMessage: 'Doctor not found in your network'
            }

          case 'attendant':
            const attendant = await db.attendant.findUnique({
              where: { id: resourceId },
              include: {
                user: {
                  include: {
                    networkUsers: {
                      where: { adminId: admin.id }
                    }
                  }
                }
              }
            })
            return { 
              hasAccess: !!attendant?.user?.networkUsers.length,
              errorMessage: 'Attendant not found in your network'
            }

          case 'organization':
            // Admin can only access their own organizations
            return { hasAccess: true } // Organizations are owned by admins

          case 'admin':
            // Admins can only access themselves (handled by Super Admin)
            return { hasAccess: false, errorMessage: 'Access denied' }
        }
      }
      
      return { hasAccess: true } // Admin can list resources in their network
    }

    // Other roles (Patient, Doctor, Attendant) can only access their own data
    if (resourceId) {
      switch (resourceType) {
        case 'patient':
          if (userRole === UserRole.PATIENT) {
            const patient = await db.patient.findUnique({
              where: { id: resourceId, userId: userId }
            })
            return { 
              hasAccess: !!patient,
              errorMessage: 'Access denied to patient data'
            }
          }
          break

        case 'doctor':
          if (userRole === UserRole.DOCTOR) {
            const doctor = await db.doctor.findUnique({
              where: { id: resourceId, userId: userId }
            })
            return { 
              hasAccess: !!doctor,
              errorMessage: 'Access denied to doctor data'
            }
          }
          break

        case 'attendant':
          if (userRole === UserRole.ATTENDANT) {
            const attendant = await db.attendant.findUnique({
              where: { id: resourceId, userId: userId }
            })
            return { 
              hasAccess: !!attendant,
              errorMessage: 'Access denied to attendant data'
            }
          }
          break
      }
    }

    return { hasAccess: false, errorMessage: 'Access denied' }
  } catch (error) {
    console.error('Error checking resource access:', error)
    return { hasAccess: false, errorMessage: 'Internal server error' }
  }
}

/**
 * Get filtered data based on user's network/organization access
 */
export async function getFilteredData<T>(
  userId: string,
  userRole: UserRole,
  resourceType: 'patients' | 'doctors' | 'attendants' | 'organizations',
  additionalFilters?: any
): Promise<{ data: T[]; hasAccess: boolean }> {
  try {
    // Super Admin sees everything
    if (userRole === UserRole.SUPER_ADMIN) {
      switch (resourceType) {
        case 'patients':
          const allPatients = await db.patient.findMany({
            include: { user: true },
            ...additionalFilters
          }) as T[]
          return { data: allPatients, hasAccess: true }

        case 'doctors':
          const allDoctors = await db.doctor.findMany({
            include: { user: true },
            ...additionalFilters
          }) as T[]
          return { data: allDoctors, hasAccess: true }

        case 'attendants':
          const allAttendants = await db.attendant.findMany({
            include: { user: true },
            ...additionalFilters
          }) as T[]
          return { data: allAttendants, hasAccess: true }

        case 'organizations':
          const allOrganizations = await db.organization.findMany({
            ...additionalFilters
          }) as T[]
          return { data: allOrganizations, hasAccess: true }
      }
    }

    // Get user with network info
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        admin: true,
        networkUsers: true
      }
    })

    if (!user) {
      return { data: [], hasAccess: false }
    }

    // Admin sees only their network users
    if (userRole === UserRole.ADMIN && user.admin) {
      const adminId = user.admin.id
      
      switch (resourceType) {
        case 'patients':
          const adminPatients = await db.patient.findMany({
            where: {
              user: {
                networkUsers: {
                  some: { adminId }
                }
              }
            },
            include: { user: true },
            ...additionalFilters
          }) as T[]
          return { data: adminPatients, hasAccess: true }

        case 'doctors':
          const adminDoctors = await db.doctor.findMany({
            where: {
              user: {
                networkUsers: {
                  some: { adminId }
                }
              }
            },
            include: { user: true },
            ...additionalFilters
          }) as T[]
          return { data: adminDoctors, hasAccess: true }

        case 'attendants':
          const adminAttendants = await db.attendant.findMany({
            where: {
              user: {
                networkUsers: {
                  some: { adminId }
                }
              }
            },
            include: { user: true },
            ...additionalFilters
          }) as T[]
          return { data: adminAttendants, hasAccess: true }

        case 'organizations':
          // Admin sees all organizations (they manage them)
          const adminOrganizations = await db.organization.findMany({
            ...additionalFilters
          }) as T[]
          return { data: adminOrganizations, hasAccess: true }
      }
    }

    // Other roles see only their own data
    switch (resourceType) {
      case 'patients':
        if (userRole === UserRole.PATIENT) {
          const patientData = await db.patient.findMany({
            where: { userId },
            include: { user: true },
            ...additionalFilters
          }) as T[]
          return { data: patientData, hasAccess: true }
        }
        break

      case 'doctors':
        if (userRole === UserRole.DOCTOR) {
          const doctorData = await db.doctor.findMany({
            where: { userId },
            include: { user: true },
            ...additionalFilters
          }) as T[]
          return { data: doctorData, hasAccess: true }
        }
        break

      case 'attendants':
        if (userRole === UserRole.ATTENDANT) {
          const attendantData = await db.attendant.findMany({
            where: { userId },
            include: { user: true },
            ...additionalFilters
          }) as T[]
          return { data: attendantData, hasAccess: true }
        }
        break
    }

    return { data: [], hasAccess: false }
  } catch (error) {
    console.error('Error getting filtered data:', error)
    return { data: [], hasAccess: false }
  }
}

/**
 * Middleware to check user permissions before processing API requests
 */
export async function withPermissionCheck(
  request: Request,
  requiredRole: UserRole,
  resourceType?: 'patient' | 'doctor' | 'attendant' | 'organization' | 'admin',
  resourceId?: string
): Promise<{ session: any; hasAccess: boolean; errorMessage?: string }> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return { 
        session: null, 
        hasAccess: false, 
        errorMessage: 'Unauthorized' 
      }
    }

    if (session.user.role !== requiredRole) {
      return { 
        session, 
        hasAccess: false, 
        errorMessage: 'Insufficient permissions' 
      }
    }

    // If resource access check is needed
    if (resourceType && resourceId) {
      const accessCheck = await checkResourceAccess(
        session.user.id,
        session.user.role as UserRole,
        resourceType,
        resourceId
      )

      if (!accessCheck.hasAccess) {
        return { 
          session, 
          hasAccess: false, 
          errorMessage: accessCheck.errorMessage 
        }
      }
    }

    return { session, hasAccess: true }
  } catch (error) {
    console.error('Permission check error:', error)
    return { 
      session: null, 
      hasAccess: false, 
      errorMessage: 'Internal server error' 
    }
  }
}