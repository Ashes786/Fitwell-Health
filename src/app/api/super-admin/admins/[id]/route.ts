import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { NotificationHelpers } from '@/lib/notification-helpers'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.role || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Optimized query with minimal includes
    const admin = await db.admin.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        networkName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        permissions: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isActive: true
          }
        }
        // Removed adminFeatures include that was causing performance issues
      }
    })

    if (!admin) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 })
    }

    return NextResponse.json(admin)
  } catch (error) {
    console.error('Error fetching admin:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.role || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { isActive, action, name, email, phone, networkName } = body

    // Get current admin data
    const currentAdmin = await db.admin.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isActive: true
          }
        }
      }
    })

    if (!currentAdmin) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 })
    }

    // Update admin and user data
    const updatedAdmin = await db.$transaction(async (tx) => {
      // Update user data if provided
      const userUpdate: any = {}
      if (name !== undefined) userUpdate.name = name
      if (email !== undefined) userUpdate.email = email
      if (phone !== undefined) userUpdate.phone = phone
      if (isActive !== undefined) userUpdate.isActive = isActive

      if (Object.keys(userUpdate).length > 0) {
        await tx.user.update({
          where: { id: currentAdmin.user.id },
          data: userUpdate
        })
      }

      // Update admin data if provided
      const adminUpdate: any = {}
      if (networkName !== undefined) adminUpdate.networkName = networkName
      if (isActive !== undefined) adminUpdate.isActive = isActive

      const updated = await tx.admin.update({
        where: { id: params.id },
        data: adminUpdate,
        select: {
          id: true,
          networkName: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              isActive: true
            }
          }
        }
      })

      return updated
    })

    // Trigger notifications based on action
    if (isActive !== undefined) {
      const actionBy = session.user.name || session.user.email || 'Super Admin'
      
      if (isActive && !currentAdmin.user.isActive) {
        // Admin was activated
        await NotificationHelpers.onAdminActivated(
          currentAdmin.user.name || currentAdmin.user.email,
          actionBy
        )
      } else if (!isActive && currentAdmin.user.isActive) {
        // Admin was deactivated
        await NotificationHelpers.onAdminDeactivated(
          currentAdmin.user.name || currentAdmin.user.email,
          actionBy
        )
      }
    }

    return NextResponse.json({ 
      message: 'Admin updated successfully',
      admin: updatedAdmin 
    })
  } catch (error) {
    console.error('Error updating admin:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.role || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get current admin data
    const currentAdmin = await db.admin.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true
          }
        }
      }
    })

    if (!currentAdmin) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 })
    }

    // Check if admin has active subscriptions or other dependencies
    const activeSubscriptions = await db.userSubscription.findMany({
      where: {
        userId: currentAdmin.user.id,
        isActive: true
      }
    })

    if (activeSubscriptions.length > 0) {
      return NextResponse.json({ 
        message: 'Cannot delete admin with active subscriptions',
        activeSubscriptions: activeSubscriptions.length 
      }, { status: 400 })
    }

    // Delete admin and user in transaction
    await db.$transaction(async (tx) => {
      // Delete admin
      await tx.admin.delete({
        where: { id: params.id }
      })

      // Delete user
      await tx.user.delete({
        where: { id: currentAdmin.user.id }
      })
    })

    // Trigger notification for admin deletion
    const actionBy = session.user.name || session.user.email || 'Super Admin'
    await NotificationHelpers.onAdminDeleted(
      currentAdmin.user.name || currentAdmin.user.email,
      actionBy
    )

    return NextResponse.json({ 
      message: 'Admin deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting admin:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}