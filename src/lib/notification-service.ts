import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export interface NotificationData {
  type: 'PASSWORD_CHANGE' | 'SECURITY_ALERT' | 'SUBSCRIPTION_REQUEST' | 'ADMIN_ACTION' | 'SYSTEM_STATUS' | 'LOGIN_ATTEMPT' | 'BACKUP_COMPLETE' | 'DATABASE_ALERT'
  title: string
  message: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  targetUser?: string
  targetRole?: string
  ipAddress?: string
  location?: string
  actionUrl?: string
  metadata?: Record<string, any>
}

export class NotificationService {
  /**
   * Create and send a notification to super admins
   */
  static async createNotification(data: NotificationData): Promise<void> {
    try {
      const session = await getServerSession(authOptions)
      
      if (!session || session.user?.role !== UserRole.SUPER_ADMIN) {
        console.warn('Unauthorized attempt to create notification')
        return
      }

      // Create the notification via API
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/super-admin/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        console.error('Failed to create notification:', await response.text())
        return
      }

      const notification = await response.json()
      
      // Emit real-time notification via WebSocket if available
      await this.emitRealTimeNotification(notification)
      
      console.log('Notification created successfully:', notification.id)
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }

  /**
   * Emit real-time notification via WebSocket
   */
  private static async emitRealTimeNotification(notification: any): Promise<void> {
    try {
      // Since we can't directly access the socket.io instance from a service,
      // we'll make an internal API call to trigger the socket emission
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/internal/emit-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.INTERNAL_API_KEY || 'internal-key'}`
        },
        body: JSON.stringify({
          notification,
          targetRole: 'SUPER_ADMIN'
        })
      })
      
      console.log('Real-time notification emitted:', notification.id)
    } catch (error) {
      console.error('Error emitting real-time notification:', error)
    }
  }

  /**
   * Create security alert notification
   */
  static async createSecurityAlert(
    title: string,
    message: string,
    priority: 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM',
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.createNotification({
      type: 'SECURITY_ALERT',
      title,
      message,
      priority,
      actionUrl: '/dashboard/super-admin/security',
      metadata
    })
  }

  /**
   * Create admin action notification
   */
  static async createAdminAction(
    title: string,
    message: string,
    targetUser?: string,
    targetRole?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.createNotification({
      type: 'ADMIN_ACTION',
      title,
      message,
      priority: 'MEDIUM',
      targetUser,
      targetRole,
      actionUrl: '/dashboard/super-admin/admins',
      metadata
    })
  }

  /**
   * Create subscription request notification
   */
  static async createSubscriptionRequest(
    title: string,
    message: string,
    targetUser: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.createNotification({
      type: 'SUBSCRIPTION_REQUEST',
      title,
      message,
      priority: 'HIGH',
      targetUser,
      targetRole: 'ADMIN',
      actionUrl: '/dashboard/super-admin/subscription-requests',
      metadata
    })
  }

  /**
   * Create system status notification
   */
  static async createSystemStatus(
    title: string,
    message: string,
    priority: 'LOW' | 'MEDIUM' = 'LOW',
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.createNotification({
      type: 'SYSTEM_STATUS',
      title,
      message,
      priority,
      actionUrl: '/dashboard/super-admin/system-status',
      metadata
    })
  }

  /**
   * Create password change notification
   */
  static async createPasswordChange(
    targetUser: string,
    ipAddress?: string,
    location?: string
  ): Promise<void> {
    await this.createNotification({
      type: 'PASSWORD_CHANGE',
      title: 'Password Changed',
      message: `${targetUser} has changed their password`,
      priority: 'MEDIUM',
      targetUser,
      targetRole: 'ADMIN',
      ipAddress,
      location,
      actionUrl: '/dashboard/super-admin/admins',
      metadata: { ipAddress, location }
    })
  }

  /**
   * Create login attempt notification
   */
  static async createLoginAttempt(
    title: string,
    message: string,
    targetUser?: string,
    ipAddress?: string,
    location?: string,
    priority: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'
  ): Promise<void> {
    await this.createNotification({
      type: 'LOGIN_ATTEMPT',
      title,
      message,
      priority,
      targetUser,
      ipAddress,
      location,
      actionUrl: '/dashboard/super-admin/security',
      metadata: { ipAddress, location }
    })
  }

  /**
   * Create backup complete notification
   */
  static async createBackupComplete(
    backupType: string,
    status: 'success' | 'failed' | 'partial',
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.createNotification({
      type: 'BACKUP_COMPLETE',
      title: `Backup ${status === 'success' ? 'Complete' : status === 'failed' ? 'Failed' : 'Partial'}`,
      message: `${backupType} backup ${status} at ${new Date().toLocaleString()}`,
      priority: status === 'success' ? 'LOW' : 'HIGH',
      actionUrl: '/dashboard/super-admin/database',
      metadata: { backupType, status, ...metadata }
    })
  }

  /**
   * Create database alert notification
   */
  static async createDatabaseAlert(
    title: string,
    message: string,
    priority: 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM',
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.createNotification({
      type: 'DATABASE_ALERT',
      title,
      message,
      priority,
      actionUrl: '/dashboard/super-admin/database',
      metadata
    })
  }

  /**
   * Create critical alert notification
   */
  static async createCriticalAlert(
    title: string,
    message: string,
    actionUrl?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.createNotification({
      type: 'SECURITY_ALERT',
      title,
      message,
      priority: 'CRITICAL',
      actionUrl: actionUrl || '/dashboard/super-admin/security',
      metadata
    })
  }
}