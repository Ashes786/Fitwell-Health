import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { hasPermission } from '@/lib/rbac'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user.role, 'view_dashboard')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, type, address, phone, email, website, isActive } = body

    const organization = await db.organization.update({
      where: { id: params.id },
      data: {
        name,
        type,
        address,
        phone,
        email,
        website,
        isActive
      }
    })

    return NextResponse.json(organization)
  } catch (error) {
    console.error('Error updating organization:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user.role, 'view_dashboard')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await db.organization.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Organization deleted successfully' })
  } catch (error) {
    console.error('Error deleting organization:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}