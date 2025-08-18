import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { NotificationHelpers } from '@/lib/notification-helpers'

// Track failed login attempts
const failedLoginAttempts = new Map<string, { count: number; lastAttempt: Date; ipAddress: string }>()

export async function POST(request: NextRequest) {
  try {
    const { email, ipAddress, userAgent } = await request.json()

    if (!email || !ipAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get client IP from request headers as fallback
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     ipAddress || 
                     'unknown'

    // Update failed login attempts
    const now = new Date()
    const existing = failedLoginAttempts.get(email)
    
    if (existing) {
      // Reset if last attempt was more than 1 hour ago
      if (now.getTime() - existing.lastAttempt.getTime() > 60 * 60 * 1000) {
        failedLoginAttempts.set(email, { count: 1, lastAttempt: now, ipAddress: clientIP })
      } else {
        failedLoginAttempts.set(email, { 
          count: existing.count + 1, 
          lastAttempt: now, 
          ipAddress: clientIP 
        })
      }
    } else {
      failedLoginAttempts.set(email, { count: 1, lastAttempt: now, ipAddress: clientIP })
    }

    const attemptData = failedLoginAttempts.get(email)!
    
    // Trigger notification for multiple failed attempts
    if (attemptData.count >= 3) {
      await NotificationHelpers.onFailedLoginAttempt(
        email,
        clientIP,
        attemptData.count
      )
    }

    // Check for suspicious patterns (multiple attempts from different IPs)
    const userAttempts = Array.from(failedLoginAttempts.values()).filter(
      attempt => attempt.count > 2
    )

    if (userAttempts.length > 0) {
      // Trigger notification for suspicious activity if detected
      const recentAttempts = userAttempts.filter(
        attempt => now.getTime() - attempt.lastAttempt.getTime() < 30 * 60 * 1000 // 30 minutes
      )

      if (recentAttempts.length >= 5) {
        await NotificationHelpers.onSuspiciousLoginActivity(
          email,
          clientIP,
          'Unknown',
          'Multiple failed login attempts detected in short time period'
        )
      }
    }

    return NextResponse.json({ 
      success: true,
      attemptCount: attemptData.count,
      message: 'Failed login attempt recorded'
    })

  } catch (error) {
    console.error('Error recording failed login attempt:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Clear failed login attempts for this email (successful login)
    failedLoginAttempts.delete(email)

    return NextResponse.json({ 
      success: true,
      message: 'Failed login attempts cleared'
    })

  } catch (error) {
    console.error('Error clearing failed login attempts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}