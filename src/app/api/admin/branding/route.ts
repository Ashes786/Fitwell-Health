import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { updateAdminBranding, getAdminBranding } from '@/lib/branding'
import { authenticateRequest, createAuthenticatedGETHandler, createAuthenticatedPOSTHandler } from '@/lib/api-auth'
import { UserRole } from '@prisma/client'

const getHandler = async (request: NextRequest, auth: any) => {
  try {
    // Get admin profile
    const admin = await db.admin.findUnique({
      where: { userId: auth.user.id }
    })

    if (!admin) {
      const { NextResponse } = await import('next/server')
      return NextResponse.json({ error: 'Admin profile not found' }, { status: 404 })
    }

    // Get current branding
    const branding = await getAdminBranding(admin.id)

    return { 
      success: true, 
      branding: branding || {
        logo: '/logo.svg',
        primaryColor: '#10b981',
        secondaryColor: '#059669',
        accentColor: '#34d399',
        companyName: admin.networkName || 'Fitwell H.E.A.L.T.H.',
        tagline: `${admin.networkName} Healthcare Network`
      }
    }
  } catch (error) {
    console.error('Error fetching branding:', error)
    const { NextResponse } = await import('next/server')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const postHandler = async (request: NextRequest, auth: any) => {
  try {
    const body = await request.json()
    const {
      logo,
      primaryColor,
      secondaryColor,
      accentColor,
      companyName,
      tagline,
      website,
      supportEmail,
      supportPhone,
      customCSS
    } = body

    // Get admin profile
    const admin = await db.admin.findUnique({
      where: { userId: auth.user.id }
    })

    if (!admin) {
      const { NextResponse } = await import('next/server')
      return NextResponse.json({ error: 'Admin profile not found' }, { status: 404 })
    }

    // Update branding
    const result = await updateAdminBranding(admin.id, {
      logo,
      primaryColor,
      secondaryColor,
      accentColor,
      companyName,
      tagline,
      website,
      supportEmail,
      supportPhone,
      customCSS
    })

    if (!result.success) {
      const { NextResponse } = await import('next/server')
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return { 
      success: true, 
      message: 'Branding updated successfully',
      branding: {
        logo,
        primaryColor,
        secondaryColor,
        accentColor,
        companyName,
        tagline,
        website,
        supportEmail,
        supportPhone,
        customCSS
      }
    }
  } catch (error) {
    console.error('Error updating branding:', error)
    const { NextResponse } = await import('next/server')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const GET = createAuthenticatedGETHandler(getHandler, [UserRole.ADMIN])
export const POST = createAuthenticatedPOSTHandler(postHandler, [UserRole.ADMIN])