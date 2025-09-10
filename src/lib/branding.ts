import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

/**
 * Branding interface for network and organization branding
 */
export interface Branding {
  logo?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  companyName?: string
  tagline?: string
  website?: string
  supportEmail?: string
  supportPhone?: string
  customCSS?: string
}

/**
 * Get branding for a user based on their network/organization
 */
export async function getUserBranding(userId: string, userRole: UserRole): Promise<Branding> {
  try {
    const defaultBranding: Branding = {
      logo: '/logo.svg',
      primaryColor: '#10b981', // emerald-600
      secondaryColor: '#059669', // emerald-700
      accentColor: '#34d399', // emerald-400
      companyName: 'Fitwell H.E.A.L.T.H.',
      tagline: 'Healthcare Excellence & Advanced Longevity Through Health',
      website: 'https://fitwell.health',
      supportEmail: 'support@fitwell.health',
      supportPhone: '+1-800-HEALTH'
    }

    // Super Admin gets default branding
    if (userRole === UserRole.SUPER_ADMIN) {
      return defaultBranding
    }

    // Get user with network/organization info
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        admin: {
          include: {
            networkUsers: {
              include: {
                user: true
              }
            }
          }
        },
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
      return defaultBranding
    }

    // Check if user belongs to an admin's network
    const networkUser = user.networkUsers[0]
    if (networkUser?.admin) {
      const admin = networkUser.admin
      
      // Return admin's branding if available
      if (admin.branding) {
        try {
          const adminBranding = JSON.parse(admin.branding) as Branding
          return {
            ...defaultBranding,
            ...adminBranding
          }
        } catch (error) {
          console.error('Error parsing admin branding:', error)
        }
      }
      
      // Return admin-based branding
      return {
        ...defaultBranding,
        companyName: admin.networkName || defaultBranding.companyName,
        tagline: `${admin.networkName} Healthcare Network`
      }
    }

    // Check if user belongs to an organization (for patients)
    if (user.patient) {
      if (user.patient.organizationId) {
        // Get organization branding
        const organization = await db.organization.findUnique({
          where: { id: user.patient.organizationId }
        })
        
        if (organization?.branding) {
          try {
            const orgBranding = JSON.parse(organization.branding) as Branding
            return {
              ...defaultBranding,
              ...orgBranding
            }
          } catch (error) {
            console.error('Error parsing organization branding:', error)
          }
        }
        
        // Return organization-based branding
        return {
          ...defaultBranding,
          companyName: organization.name || defaultBranding.companyName,
          tagline: `${organization.name} Healthcare Organization`
        }
      }
    }

    return defaultBranding
  } catch (error) {
    console.error('Error getting user branding:', error)
    return {
      logo: '/logo.svg',
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      accentColor: '#34d399',
      companyName: 'Fitwell H.E.A.L.T.H.',
      tagline: 'Healthcare Excellence & Advanced Longevity Through Health'
    }
  }
}

/**
 * Get admin branding configuration
 */
export async function getAdminBranding(adminId: string): Promise<Branding | null> {
  try {
    const admin = await db.admin.findUnique({
      where: { id: adminId }
    })

    if (!admin?.branding) {
      return null
    }

    try {
      return JSON.parse(admin.branding) as Branding
    } catch (error) {
      console.error('Error parsing admin branding:', error)
      return null
    }
  } catch (error) {
    console.error('Error getting admin branding:', error)
    return null
  }
}

/**
 * Update admin branding configuration
 */
export async function updateAdminBranding(
  adminId: string, 
  branding: Partial<Branding>
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await db.admin.findUnique({
      where: { id: adminId }
    })

    if (!admin) {
      return { success: false, error: 'Admin not found' }
    }

    // Get existing branding or create new
    let existingBranding: Branding = {}
    if (admin.branding) {
      try {
        existingBranding = JSON.parse(admin.branding)
      } catch (error) {
        console.error('Error parsing existing branding:', error)
      }
    }

    // Merge with new branding
    const updatedBranding = {
      ...existingBranding,
      ...branding
    }

    await db.admin.update({
      where: { id: adminId },
      data: {
        branding: JSON.stringify(updatedBranding)
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating admin branding:', error)
    return { success: false, error: 'Failed to update branding' }
  }
}

/**
 * Get organization branding configuration
 */
export async function getOrganizationBranding(organizationId: string): Promise<Branding | null> {
  try {
    const organization = await db.organization.findUnique({
      where: { id: organizationId }
    })

    if (!organization?.branding) {
      return null
    }

    try {
      return JSON.parse(organization.branding) as Branding
    } catch (error) {
      console.error('Error parsing organization branding:', error)
      return null
    }
  } catch (error) {
    console.error('Error getting organization branding:', error)
    return null
  }
}

/**
 * Update organization branding configuration
 */
export async function updateOrganizationBranding(
  organizationId: string, 
  branding: Partial<Branding>
): Promise<{ success: boolean; error?: string }> {
  try {
    const organization = await db.organization.findUnique({
      where: { id: organizationId }
    })

    if (!organization) {
      return { success: false, error: 'Organization not found' }
    }

    // Get existing branding or create new
    let existingBranding: Branding = {}
    if (organization.branding) {
      try {
        existingBranding = JSON.parse(organization.branding)
      } catch (error) {
        console.error('Error parsing existing branding:', error)
      }
    }

    // Merge with new branding
    const updatedBranding = {
      ...existingBranding,
      ...branding
    }

    await db.organization.update({
      where: { id: organizationId },
      data: {
        branding: JSON.stringify(updatedBranding)
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating organization branding:', error)
    return { success: false, error: 'Failed to update branding' }
  }
}

/**
 * Generate CSS custom properties from branding
 */
export function generateBrandingCSS(branding: Branding): string {
  return `
    :root {
      --brand-primary: ${branding.primaryColor || '#10b981'};
      --brand-secondary: ${branding.secondaryColor || '#059669'};
      --brand-accent: ${branding.accentColor || '#34d399'};
      --brand-company-name: '${branding.companyName || 'Fitwell H.E.A.L.T.H.'}';
      --brand-tagline: '${branding.tagline || 'Healthcare Excellence & Advanced Longevity Through Health'}';
    }
    
    ${branding.customCSS || ''}
  `
}

/**
 * Branding context provider data structure
 */
export interface BrandingContext {
  branding: Branding
  isAdmin: boolean
  isOrganization: boolean
  networkName?: string
  organizationName?: string
}