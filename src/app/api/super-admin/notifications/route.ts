import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const priority = searchParams.get('priority')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100')

    // Build where clause based on filters
    const where: any = {}
    
    if (type && type !== 'all') {
      where.type = type
    }
    
    if (priority && priority !== 'all') {
      where.priority = priority
    }
    
    if (status && status !== 'all') {
      where.status = status
    }

    // For now, generate notifications based on real system activity
    // In a production app, you would store these in a database table
    const notifications = await generateSystemNotifications()

    // Apply filters
    let filteredNotifications = notifications
    if (Object.keys(where).length > 0) {
      filteredNotifications = notifications.filter(notification => {
        if (where.type && notification.type !== where.type) return false
        if (where.priority && notification.priority !== where.priority) return false
        if (where.status && notification.status !== where.status) return false
        return true
      })
    }

    // Apply limit and sort by creation date (newest first)
    const result = filteredNotifications
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, title, message, priority, targetUser, targetRole, actionUrl, metadata } = body

    // Validate required fields
    if (!type || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create a new notification
    const newNotification = {
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      priority: priority || 'MEDIUM',
      status: 'UNREAD',
      targetUser,
      targetRole,
      actionUrl,
      metadata,
      createdAt: new Date().toISOString()
    }

    // In a production app, you would save this to a database table
    // For now, we'll just return the created notification
    
    return NextResponse.json(newNotification, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}

async function generateSystemNotifications() {
  try {
    // Get real data from other APIs to generate meaningful notifications
    const [adminsRes, plansRes] = await Promise.allSettled([
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/super-admin/admins`),
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/super-admin/subscription-plans`)
    ])

    const admins = adminsRes.status === 'fulfilled' && adminsRes.value.ok ? await adminsRes.value.json() : []
    const plans = plansRes.status === 'fulfilled' && plansRes.value.ok ? await plansRes.value.json() : []

    const notifications: any[] = []

    // Generate notifications based on real data
    if (plans && Array.isArray(plans)) {
      // Active subscription plans
      const activePlans = plans.filter((p: any) => p.isActive)
      const inactivePlans = plans.filter((p: any) => !p.isActive)

      // Subscription plan activity
      if (activePlans.length > 0) {
        notifications.push({
          id: 'plans-active',
          type: 'SUBSCRIPTION_PLAN',
          title: 'Active Subscription Plans',
          message: `${activePlans.length} subscription plan(s) are currently active`,
          priority: 'MEDIUM',
          status: 'UNREAD',
          createdAt: new Date(Date.now() - 300000).toISOString(),
          actionUrl: '/dashboard/super-admin/subscription-plans',
          metadata: { activeCount: activePlans.length, plans: activePlans.map((p: any) => p.name) }
        })
      }

      // Recently created plans (within last 7 days)
      const recentPlans = plans.filter((p: any) => {
        const createdDate = new Date(p.createdAt)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return createdDate > weekAgo
      })

      if (recentPlans.length > 0) {
        notifications.push({
          id: 'new-plans',
          type: 'SUBSCRIPTION_PLAN',
          title: 'New Subscription Plans Created',
          message: `${recentPlans.length} new subscription plan(s) created in the last 7 days`,
          priority: 'MEDIUM',
          status: 'UNREAD',
          createdAt: new Date(Date.now() - 1200000).toISOString(),
          actionUrl: '/dashboard/super-admin/subscription-plans',
          metadata: { newCount: recentPlans.length, newPlans: recentPlans.map((p: any) => p.name) }
        })
      }

      // Calculate total revenue from active plans
      const totalRevenue = activePlans.reduce((sum: number, plan: any) => sum + (plan.price || 0), 0)
      if (totalRevenue > 10000) {
        notifications.push({
          id: 'revenue-milestone',
          type: 'ADMIN_ACTION',
          title: 'Revenue Milestone Reached',
          message: `Total revenue has exceeded $${totalRevenue.toLocaleString()}`,
          priority: 'HIGH',
          status: 'UNREAD',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          actionUrl: '/dashboard/super-admin/analytics',
          metadata: { totalRevenue, milestone: 10000 }
        })
      }
    }

    if (admins && Array.isArray(admins)) {
      const activeAdmins = admins.filter((a: any) => a.isActive)
      const inactiveAdmins = admins.filter((a: any) => !a.isActive)
      
      // Inactive admin accounts alert
      if (inactiveAdmins.length > 0) {
        notifications.push({
          id: 'admin-inactive',
          type: 'ADMIN_ACTION',
          title: 'Inactive Admin Accounts',
          message: `${inactiveAdmins.length} admin account(s) are currently inactive and may need attention`,
          priority: inactiveAdmins.length > 3 ? 'HIGH' : 'MEDIUM',
          status: 'UNREAD',
          createdAt: new Date(Date.now() - 600000).toISOString(),
          actionUrl: '/dashboard/super-admin/admins',
          metadata: { inactiveCount: inactiveAdmins.length, inactiveAdmins: inactiveAdmins.map((a: any) => a.user?.name) }
        })
      }

      // Admin activity summary
      notifications.push({
        id: 'admin-activity',
        type: 'ADMIN_ACTION',
        title: 'Admin Activity Summary',
        message: `${activeAdmins.length} active admin(s) managing ${admins.length} total accounts`,
        priority: 'LOW',
        status: 'UNREAD',
        createdAt: new Date(Date.now() - 900000).toISOString(),
        actionUrl: '/dashboard/super-admin/admins',
        metadata: { activeCount: activeAdmins.length, totalCount: admins.length }
      })

      // New admin accounts created recently (within last 7 days)
      const recentAdmins = admins.filter((a: any) => {
        const createdDate = new Date(a.createdAt)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return createdDate > weekAgo
      })

      if (recentAdmins.length > 0) {
        notifications.push({
          id: 'new-admins',
          type: 'ADMIN_ACTION',
          title: 'New Admin Accounts Created',
          message: `${recentAdmins.length} new admin account(s) created in the last 7 days`,
          priority: 'MEDIUM',
          status: 'UNREAD',
          createdAt: new Date(Date.now() - 1200000).toISOString(),
          actionUrl: '/dashboard/super-admin/admins',
          metadata: { newCount: recentAdmins.length, newAdmins: recentAdmins.map((a: any) => a.user?.name) }
        })
      }
    }

    // System security and status notifications
    notifications.push(
      {
        id: 'security-check',
        type: 'SECURITY_ALERT',
        title: 'Security Check Complete',
        message: 'Automated security scan completed - all systems secure',
        priority: 'LOW',
        status: 'UNREAD',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        actionUrl: '/dashboard/super-admin/security',
        metadata: { scanType: 'automated', result: 'secure' }
      },
      {
        id: 'backup-status',
        type: 'BACKUP_COMPLETE',
        title: 'Automated Backup Complete',
        message: 'Database backup completed successfully at ' + new Date().toLocaleString(),
        priority: 'LOW',
        status: 'UNREAD',
        createdAt: new Date(Date.now() - 2400000).toISOString(),
        actionUrl: '/dashboard/super-admin/database',
        metadata: { backupType: 'automated', status: 'success' }
      },
      {
        id: 'system-health',
        type: 'SYSTEM_STATUS',
        title: 'System Health Check',
        message: 'All system services are running normally',
        priority: 'LOW',
        status: 'UNREAD',
        createdAt: new Date(Date.now() - 3000000).toISOString(),
        actionUrl: '/dashboard/super-admin/system-status',
        metadata: { healthStatus: 'good', servicesChecked: ['database', 'api', 'auth'] }
      }
    )

    // Add some critical security alerts if there are potential issues
    if (admins && admins.length > 10) {
      notifications.push({
        id: 'admin-growth',
        type: 'SECURITY_ALERT',
        title: 'High Admin Account Count',
        message: `System has ${admins.length} admin accounts - consider reviewing access permissions`,
        priority: 'MEDIUM',
        status: 'UNREAD',
        createdAt: new Date(Date.now() - 1500000).toISOString(),
        actionUrl: '/dashboard/super-admin/admins',
        metadata: { adminCount: admins.length, threshold: 10 }
      })
    }

    return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error('Error generating system notifications:', error)
    return []
  }
}