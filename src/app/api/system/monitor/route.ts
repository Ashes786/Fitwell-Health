import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { NotificationHelpers } from '@/lib/notification-helpers'
import { NotificationService } from '@/lib/notification-service'

export async function POST(request: NextRequest) {
  try {
    const { 
      eventType, 
      severity, 
      message, 
      component, 
      metadata 
    } = await request.json()

    if (!eventType || !severity || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get client IP for tracking
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    // Handle different types of system events
    switch (eventType) {
      case 'database_performance':
        await NotificationHelpers.onDatabasePerformanceIssue(
          metadata?.issueType || 'Unknown',
          severity,
          message
        )
        break

      case 'resource_usage':
        await NotificationHelpers.onUnusualResourceUsage(
          metadata?.resourceType || 'CPU',
          metadata?.usagePercentage || 0,
          metadata?.threshold || 80,
          metadata?.serverName || 'Unknown'
        )
        break

      case 'backup_status':
        if (metadata?.status === 'failed') {
          await NotificationHelpers.onBackupFailed(
            metadata?.backupType || 'Unknown',
            message
          )
        } else if (metadata?.status === 'success') {
          await NotificationHelpers.onBackupCompleted(
            metadata?.backupType || 'Unknown',
            metadata?.backupSize || 0,
            metadata?.duration || 0
          )
        }
        break

      case 'security_incident':
        switch (metadata?.incidentType) {
          case 'privilege_escalation':
            await NotificationHelpers.onPrivilegeEscalationAttempt(
              metadata?.email || 'Unknown',
              clientIP,
              metadata?.targetRole || 'Unknown',
              metadata?.method || 'Unknown'
            )
            break
          case 'data_breach':
            await NotificationHelpers.onDataBreachAttempt(
              metadata?.attackType || 'Unknown',
              metadata?.targetSystem || 'Unknown',
              clientIP,
              severity
            )
            break
          case 'malware':
            await NotificationHelpers.onMalwareDetected(
              metadata?.malwareType || 'Unknown',
              metadata?.affectedSystem || 'Unknown',
              severity,
              metadata?.actionTaken || 'Unknown'
            )
            break
          case 'firewall_breach':
            await NotificationHelpers.onFirewallBreachAttempt(
              metadata?.breachType || 'Unknown',
              clientIP,
              metadata?.targetPort || 'Unknown',
              metadata?.protocol || 'Unknown'
            )
            break
          default:
            await NotificationService.createSecurityAlert(
              'Security Incident Detected',
              message,
              severity.toUpperCase() as 'MEDIUM' | 'HIGH' | 'CRITICAL',
              { ...metadata, clientIP, detectedAt: new Date().toISOString() }
            )
        }
        break

      case 'system_health':
        await NotificationHelpers.onSystemHealthCheck(
          severity,
          metadata?.servicesChecked || [],
          metadata?.issues
        )
        break

      case 'ssl_certificate':
        await NotificationHelpers.onSSLCertificateExpiring(
          metadata?.domain || 'Unknown',
          metadata?.daysUntilExpiry || 30,
          metadata?.certificateType || 'Unknown'
        )
        break

      case 'critical_error':
        await NotificationHelpers.onCriticalSystemError(
          metadata?.errorType || 'Unknown',
          message,
          component || 'Unknown'
        )
        break

      default:
        // Generic system notification
        await NotificationService.createSystemStatus(
          `System Event - ${eventType}`,
          message,
          severity === 'critical' ? 'MEDIUM' : 'LOW',
          { ...metadata, eventType, severity, clientIP, detectedAt: new Date().toISOString() }
        )
    }

    // Log the system event to database for auditing
    try {
      await db.systemEvent.create({
        data: {
          eventType,
          severity,
          message,
          component: component || 'Unknown',
          ipAddress: clientIP,
          metadata: metadata ? JSON.stringify(metadata) : null,
          timestamp: new Date()
        }
      })
    } catch (dbError) {
      console.error('Error logging system event to database:', dbError)
      // Don't fail the request if database logging fails
    }

    return NextResponse.json({ 
      success: true,
      message: 'System event processed and notification sent'
    })

  } catch (error) {
    console.error('Error processing system event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Get recent system events for monitoring dashboard
    const recentEvents = await db.systemEvent.findMany({
      orderBy: {
        timestamp: 'desc'
      },
      take: 50,
      select: {
        id: true,
        eventType: true,
        severity: true,
        message: true,
        component: true,
        timestamp: true
      }
    })

    return NextResponse.json(recentEvents)
  } catch (error) {
    console.error('Error fetching system events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}