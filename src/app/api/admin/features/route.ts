import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get admin ID from session
    const admin = await db.admin.findFirst({
      where: { userId: session.user.id }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    const adminFeatures = await db.adminFeature.findMany({
      where: { adminId: admin.id },
      include: {
        feature: true
      },
      orderBy: {
        grantedAt: 'desc'
      }
    })

    return NextResponse.json(adminFeatures)
  } catch (error) {
    console.error('Error fetching admin features:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}