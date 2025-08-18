import { NotificationService } from './notification-service'

/**
 * Helper functions to trigger notifications from various system events
 */

export class NotificationHelpers {
  /**
   * Trigger notification when admin password is changed
   */
  static async onAdminPasswordChanged(
    adminName: string,
    adminEmail: string,
    ipAddress?: string,
    location?: string
  ): Promise<void> {
    await NotificationService.createPasswordChange(
      adminName,
      ipAddress,
      location
    )
  }

  /**
   * Trigger notification when new admin is created
   */
  static async onAdminCreated(
    adminName: string,
    createdBy: string,
    adminRole: string = 'ADMIN'
  ): Promise<void> {
    await NotificationService.createAdminAction(
      'New Admin Account Created',
      `${createdBy} created a new admin account for ${adminName}`,
      adminName,
      adminRole,
      { createdBy, adminRole, createdAt: new Date().toISOString() }
    )
  }

  /**
   * Trigger notification when admin is deactivated
   */
  static async onAdminDeactivated(
    adminName: string,
    deactivatedBy: string
  ): Promise<void> {
    await NotificationService.createAdminAction(
      'Admin Account Deactivated',
      `${adminName}'s admin account has been deactivated by ${deactivatedBy}`,
      adminName,
      'ADMIN',
      { deactivatedBy, deactivatedAt: new Date().toISOString() }
    )
  }

  /**
   * Trigger notification when admin is activated
   */
  static async onAdminActivated(
    adminName: string,
    activatedBy: string
  ): Promise<void> {
    await NotificationService.createAdminAction(
      'Admin Account Activated',
      `${adminName}'s admin account has been activated by ${activatedBy}`,
      adminName,
      'ADMIN',
      { activatedBy, activatedAt: new Date().toISOString() }
    )
  }

  /**
   * Trigger notification when subscription request is submitted
   */
  static async onSubscriptionRequestSubmitted(
    adminName: string,
    planName: string,
    price: number,
    requestId: string
  ): Promise<void> {
    await NotificationService.createSubscriptionRequest(
      'New Subscription Request',
      `${adminName} requested ${planName} subscription - $${price}`,
      adminName,
      { requestId, planName, price, submittedAt: new Date().toISOString() }
    )
  }

  /**
   * Trigger notification when subscription request is approved
   */
  static async onSubscriptionRequestApproved(
    adminName: string,
    planName: string,
    price: number,
    approvedBy: string
  ): Promise<void> {
    await NotificationService.createAdminAction(
      'Subscription Request Approved',
      `${approvedBy} approved ${adminName}'s ${planName} subscription request ($${price})`,
      adminName,
      'ADMIN',
      { approvedBy, planName, price, approvedAt: new Date().toISOString() }
    )
  }

  /**
   * Trigger notification when subscription request is rejected
   */
  static async onSubscriptionRequestRejected(
    adminName: string,
    planName: string,
    price: number,
    rejectedBy: string,
    rejectionReason?: string
  ): Promise<void> {
    await NotificationService.createAdminAction(
      'Subscription Request Rejected',
      `${rejectedBy} rejected ${adminName}'s ${planName} subscription request`,
      adminName,
      'ADMIN',
      { 
        rejectedBy, 
        planName, 
        price, 
        rejectionReason,
        rejectedAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification when failed login attempt occurs
   */
  static async onFailedLoginAttempt(
    email: string,
    ipAddress: string,
    attemptCount: number
  ): Promise<void> {
    const priority = attemptCount > 5 ? 'HIGH' : attemptCount > 3 ? 'MEDIUM' : 'LOW'
    
    await NotificationService.createLoginAttempt(
      'Failed Login Attempt',
      `${attemptCount} failed login attempt(s) for ${email}`,
      email,
      ipAddress,
      undefined,
      priority
    )
  }

  /**
   * Trigger notification when suspicious login activity is detected
   */
  static async onSuspiciousLoginActivity(
    email: string,
    ipAddress: string,
    location: string,
    reason: string
  ): Promise<void> {
    await NotificationService.createSecurityAlert(
      'Suspicious Login Activity',
      `Suspicious login activity detected for ${email}: ${reason}`,
      'HIGH',
      { email, ipAddress, location, reason, detectedAt: new Date().toISOString() }
    )
  }

  /**
   * Trigger notification when backup is completed
   */
  static async onBackupCompleted(
    backupType: string,
    backupSize: number,
    duration: number
  ): Promise<void> {
    await NotificationService.createBackupComplete(
      backupType,
      'success',
      { 
        backupSize: `${(backupSize / 1024 / 1024).toFixed(2)} MB`,
        duration: `${duration}ms`,
        completedAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification when backup fails
   */
  static async onBackupFailed(
    backupType: string,
    error: string
  ): Promise<void> {
    await NotificationService.createBackupComplete(
      backupType,
      'failed',
      { error, failedAt: new Date().toISOString() }
    )
  }

  /**
   * Trigger notification when system health check completes
   */
  static async onSystemHealthCheck(
    status: 'healthy' | 'warning' | 'critical',
    servicesChecked: string[],
    issues?: string[]
  ): Promise<void> {
    const priority = status === 'critical' ? 'CRITICAL' : status === 'warning' ? 'HIGH' : 'LOW'
    
    await NotificationService.createSystemStatus(
      `System Health Check - ${status.toUpperCase()}`,
      `Health check completed. ${servicesChecked.length} services checked. ${issues ? `Issues found: ${issues.join(', ')}` : 'All systems operational.'}`,
      priority,
      { 
        status, 
        servicesChecked, 
        issues,
        checkedAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification when database performance issue is detected
   */
  static async onDatabasePerformanceIssue(
    issueType: string,
    severity: 'low' | 'medium' | 'high',
    details: string
  ): Promise<void> {
    const priority = severity === 'high' ? 'CRITICAL' : severity === 'medium' ? 'HIGH' : 'MEDIUM'
    
    await NotificationService.createDatabaseAlert(
      `Database Performance Issue - ${issueType}`,
      `${severity} severity database performance issue detected: ${details}`,
      priority,
      { issueType, severity, details, detectedAt: new Date().toISOString() }
    )
  }

  /**
   * Trigger notification when security scan completes
   */
  static async onSecurityScanCompleted(
    scanType: string,
    threatsFound: number,
    issuesResolved: number
  ): Promise<void> {
    const priority = threatsFound > 0 ? 'HIGH' : 'LOW'
    
    await NotificationService.createSecurityAlert(
      'Security Scan Complete',
      `${scanType} security scan completed. ${threatsFound} threat(s) found, ${issuesResolved} issue(s) resolved.`,
      priority,
      { 
        scanType, 
        threatsFound, 
        issuesResolved,
        completedAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification when revenue milestone is reached
   */
  static async onRevenueMilestone(
    totalRevenue: number,
    milestone: number
  ): Promise<void> {
    await NotificationService.createAdminAction(
      'Revenue Milestone Reached',
      `Total revenue has reached $${totalRevenue.toLocaleString()}, exceeding the $${milestone.toLocaleString()} milestone!`,
      undefined,
      undefined,
      { totalRevenue, milestone, achievedAt: new Date().toISOString() }
    )
  }

  /**
   * Trigger notification when multiple inactive admins are detected
   */
  static async onInactiveAdminsDetected(
    inactiveCount: number,
    inactiveAdmins: string[]
  ): Promise<void> {
    const priority = inactiveCount > 3 ? 'HIGH' : 'MEDIUM'
    
    await NotificationService.createAdminAction(
      'Inactive Admin Accounts Detected',
      `${inactiveCount} admin account(s) have been inactive for an extended period`,
      undefined,
      undefined,
      { 
        inactiveCount, 
        inactiveAdmins,
        detectedAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification for critical system errors
   */
  static async onCriticalSystemError(
    errorType: string,
    errorMessage: string,
    component: string
  ): Promise<void> {
    await NotificationService.createCriticalAlert(
      `Critical System Error - ${errorType}`,
      `${component}: ${errorMessage}`,
      '/dashboard/super-admin/system-status',
      { 
        errorType, 
        errorMessage, 
        component,
        occurredAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification for failed login attempts
   */
  static async onMultipleFailedLogins(
    email: string,
    ipAddress: string,
    attemptCount: number,
    timeFrame: string = '1 hour'
  ): Promise<void> {
    await NotificationService.createSecurityAlert(
      'Multiple Failed Login Attempts Detected',
      `${attemptCount} failed login attempts for ${email} from ${ipAddress} within ${timeFrame}`,
      attemptCount > 5 ? 'HIGH' : 'MEDIUM',
      { 
        email, 
        ipAddress, 
        attemptCount, 
        timeFrame,
        detectedAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification for unusual login activity
   */
  static async onUnusualLoginActivity(
    email: string,
    ipAddress: string,
    location: string,
    deviceInfo: string,
    reason: string
  ): Promise<void> {
    await NotificationService.createSecurityAlert(
      'Unusual Login Activity Detected',
      `Unusual login activity for ${email}: ${reason}. Device: ${deviceInfo}`,
      'HIGH',
      { 
        email, 
        ipAddress, 
        location,
        deviceInfo,
        reason,
        detectedAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification for password reset request
   */
  static async onPasswordResetRequest(
    email: string,
    ipAddress: string,
    resetToken: string
  ): Promise<void> {
    await NotificationService.createSecurityAlert(
      'Password Reset Request',
      `Password reset requested for ${email} from ${ipAddress}`,
      'MEDIUM',
      { 
        email, 
        ipAddress, 
        resetToken,
        requestedAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification for successful password reset
   */
  static async onPasswordResetSuccess(
    email: string,
    ipAddress: string
  ): Promise<void> {
    await NotificationService.createSecurityAlert(
      'Password Reset Successful',
      `Password for ${email} was successfully reset from ${ipAddress}`,
      'LOW',
      { 
        email, 
        ipAddress, 
        resetAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification for account lockout
   */
  static async onAccountLockout(
    email: string,
    ipAddress: string,
    lockoutDuration: string
  ): Promise<void> {
    await NotificationService.createSecurityAlert(
      'Account Locked Out',
      `Account for ${email} has been locked out due to multiple failed attempts from ${ipAddress}`,
      'HIGH',
      { 
        email, 
        ipAddress, 
        lockoutDuration,
        lockedAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification for privilege escalation attempt
   */
  static async onPrivilegeEscalationAttempt(
    email: string,
    ipAddress: string,
    targetRole: string,
    method: string
  ): Promise<void> {
    await NotificationService.createCriticalAlert(
      'Privilege Escalation Attempt Detected',
      `User ${email} attempted to escalate privileges to ${targetRole} using ${method}`,
      '/dashboard/super-admin/security',
      { 
        email, 
        ipAddress, 
        targetRole,
        method,
        detectedAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification for data breach attempt
   */
  static async onDataBreachAttempt(
    attackType: string,
    targetSystem: string,
    ipAddress: string,
    severity: 'low' | 'medium' | 'high' | 'critical'
  ): Promise<void> {
    const priority = severity === 'critical' ? 'CRITICAL' : severity === 'high' ? 'HIGH' : severity === 'medium' ? 'MEDIUM' : 'LOW'
    
    await NotificationService.createCriticalAlert(
      `Data Breach Attempt - ${attackType}`,
      `${severity} severity ${attackType} attack detected against ${targetSystem} from ${ipAddress}`,
      '/dashboard/super-admin/security',
      { 
        attackType, 
        targetSystem, 
        ipAddress,
        severity,
        detectedAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification for malware detection
   */
  static async onMalwareDetected(
    malwareType: string,
    affectedSystem: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    actionTaken: string
  ): Promise<void> {
    const priority = severity === 'critical' ? 'CRITICAL' : severity === 'high' ? 'HIGH' : severity === 'medium' ? 'MEDIUM' : 'LOW'
    
    await NotificationService.createCriticalAlert(
      `Malware Detected - ${malwareType}`,
      `${severity} severity ${malwareType} detected on ${affectedSystem}. Action: ${actionTaken}`,
      '/dashboard/super-admin/security',
      { 
        malwareType, 
        affectedSystem, 
        severity,
        actionTaken,
        detectedAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification for firewall breach attempt
   */
  static async onFirewallBreachAttempt(
    breachType: string,
    sourceIp: string,
    targetPort: string,
    protocol: string
  ): Promise<void> {
    await NotificationService.createSecurityAlert(
      'Firewall Breach Attempt Detected',
      `${breachType} breach attempt detected from ${sourceIp} to port ${targetPort} (${protocol})`,
      'HIGH',
      { 
        breachType, 
        sourceIp, 
        targetPort,
        protocol,
        detectedAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification for SSL certificate expiration
   */
  static async onSSLCertificateExpiring(
    domain: string,
    daysUntilExpiry: number,
    certificateType: string
  ): Promise<void> {
    const priority = daysUntilExpiry <= 7 ? 'CRITICAL' : daysUntilExpiry <= 30 ? 'HIGH' : 'MEDIUM'
    
    await NotificationService.createSecurityAlert(
      'SSL Certificate Expiring Soon',
      `${certificateType} certificate for ${domain} expires in ${daysUntilExpiry} days`,
      priority,
      { 
        domain, 
        daysUntilExpiry, 
        certificateType,
        notifiedAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification for unusual system resource usage
   */
  static async onUnusualResourceUsage(
    resourceType: 'CPU' | 'Memory' | 'Disk' | 'Network',
    usagePercentage: number,
    threshold: number,
    serverName: string
  ): Promise<void> {
    const priority = usagePercentage > 90 ? 'CRITICAL' : usagePercentage > 75 ? 'HIGH' : 'MEDIUM'
    
    await NotificationService.createSystemStatus(
      `High ${resourceType} Usage Alert`,
      `${resourceType} usage on ${serverName} is ${usagePercentage}% (threshold: ${threshold}%)`,
      priority,
      { 
        resourceType, 
        usagePercentage, 
        threshold,
        serverName,
        detectedAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification for database connection pool exhaustion
   */
  static async onDatabaseConnectionPoolExhaustion(
    activeConnections: number,
    maxConnections: number,
    databaseName: string
  ): Promise<void> {
    await NotificationService.createDatabaseAlert(
      'Database Connection Pool Exhausted',
      `Database ${databaseName} connection pool exhausted: ${activeConnections}/${maxConnections} connections active`,
      'HIGH',
      { 
        activeConnections, 
        maxConnections, 
        databaseName,
        detectedAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification for API rate limit exceeded
   */
  static async onAPIRateLimitExceeded(
    clientIp: string,
    endpoint: string,
    requestsPerMinute: number,
    limit: number
  ): Promise<void> {
    await NotificationService.createSecurityAlert(
      'API Rate Limit Exceeded',
      `Client ${clientIp} exceeded rate limit on ${endpoint}: ${requestsPerMinute}/${limit} requests per minute`,
      'MEDIUM',
      { 
        clientIp, 
        endpoint, 
        requestsPerMinute,
        limit,
        detectedAt: new Date().toISOString() 
      }
    )
  }

  /**
   * Trigger notification when admin is deleted
   */
  static async onAdminDeleted(
    adminName: string,
    deletedBy: string
  ): Promise<void> {
    await NotificationService.createAdminAction(
      'Admin Account Deleted',
      `${deletedBy} deleted admin account for ${adminName}`,
      adminName,
      'ADMIN',
      { deletedBy, deletedAt: new Date().toISOString() }
    )
  }

  /**
   * Trigger notification when subscription plan is created
   */
  static async onSubscriptionPlanCreated(
    planName: string,
    adminName: string,
    price: number,
    planId: string
  ): Promise<void> {
    await NotificationService.createAdminAction(
      'Subscription Plan Created',
      `${adminName} created subscription plan "${planName}" - $${price}`,
      adminName,
      'ADMIN',
      { planId, planName, price, createdAt: new Date().toISOString() }
    )
  }

  /**
   * Trigger notification when subscription plan is updated
   */
  static async onSubscriptionPlanUpdated(
    planName: string,
    adminName: string,
    planId: string
  ): Promise<void> {
    await NotificationService.createAdminAction(
      'Subscription Plan Updated',
      `${adminName} updated subscription plan "${planName}"`,
      adminName,
      'ADMIN',
      { planId, planName, updatedAt: new Date().toISOString() }
    )
  }

  /**
   * Trigger notification when subscription plan is deleted
   */
  static async onSubscriptionPlanDeleted(
    planName: string,
    adminName: string,
    planId: string
  ): Promise<void> {
    await NotificationService.createAdminAction(
      'Subscription Plan Deleted',
      `${adminName} deleted subscription plan "${planName}"`,
      adminName,
      'ADMIN',
      { planId, planName, deletedAt: new Date().toISOString() }
    )
  }
}