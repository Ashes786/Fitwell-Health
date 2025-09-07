import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// Function to calculate health score based on vitals and other factors
function calculateHealthScore(vitals: any[], appointments: any[], prescriptions: any[], labTests: any[]): number {
  let score = 50 // Base score
  
  // Vital signs contribution (40 points)
  if (vitals.length > 0) {
    const latestVitals = vitals.slice(0, 5)
    
    latestVitals.forEach(vital => {
      switch (vital.type) {
        case 'BLOOD_PRESSURE_SYSTOLIC':
          if (vital.value >= 90 && vital.value <= 120) score += 8
          else if (vital.value >= 80 && vital.value <= 140) score += 4
          else score += 0
          break
        case 'BLOOD_PRESSURE_DIASTOLIC':
          if (vital.value >= 60 && vital.value <= 80) score += 8
          else if (vital.value >= 50 && vital.value <= 90) score += 4
          else score += 0
          break
        case 'HEART_RATE':
          if (vital.value >= 60 && vital.value <= 100) score += 8
          else if (vital.value >= 50 && vital.value <= 120) score += 4
          else score += 0
          break
        case 'TEMPERATURE':
          if (vital.value >= 36.1 && vital.value <= 37.2) score += 8
          else if (vital.value >= 35.5 && vital.value <= 37.8) score += 4
          else score += 0
          break
        case 'BLOOD_SUGAR':
          if (vital.value >= 70 && vital.value <= 140) score += 8
          else if (vital.value >= 60 && vital.value <= 180) score += 4
          else score += 0
          break
        case 'OXYGEN_SATURATION':
          if (vital.value >= 95) score += 8
          else if (vital.value >= 90) score += 4
          else score += 0
          break
      }
    })
  }
  
  // Appointment adherence (20 points)
  const completedAppointments = appointments.filter(apt => apt.status === 'COMPLETED').length
  const totalAppointments = appointments.length
  if (totalAppointments > 0) {
    const appointmentRate = completedAppointments / totalAppointments
    score += Math.round(appointmentRate * 20)
  }
  
  // Prescription management (20 points)
  if (prescriptions.length > 0) {
    const activePrescriptions = prescriptions.filter(p => p.isActive).length
    if (activePrescriptions <= 3) score += 20 // Good medication management
    else if (activePrescriptions <= 5) score += 10 // Moderate
    else score += 5 // Many medications, but still managing
  } else {
    score += 15 // No medications needed
  }
  
  // Lab test regularity (10 points)
  if (labTests.length > 0) {
    const recentLabTests = labTests.filter(test => {
      const testDate = new Date(test.createdAt)
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
      return testDate >= threeMonthsAgo
    })
    if (recentLabTests.length >= 1) score += 10
  }
  
  // Ensure score is within bounds
  return Math.max(0, Math.min(100, score))
}

// Function to get health status message based on score
function getHealthStatus(score: number): { message: string; trend: string; ranking: string; status: string } {
  if (score >= 90) {
    return {
      message: 'Excellent health! Keep up the great work.',
      trend: 'Excellent',
      ranking: 'Health Champion',
      status: 'Optimal Health'
    }
  } else if (score >= 80) {
    return {
      message: 'Very good health with room for improvement.',
      trend: 'Very Good',
      ranking: 'Health Achiever',
      status: 'Good Health'
    }
  } else if (score >= 70) {
    return {
      message: 'Good health, focus on maintaining current habits.',
      trend: 'Good',
      ranking: 'Health Maintainer',
      status: 'Stable Health'
    }
  } else if (score >= 60) {
    return {
      message: 'Fair health, consider lifestyle improvements.',
      trend: 'Fair',
      ranking: 'Health Improver',
      status: 'Needs Attention'
    }
  } else {
    return {
      message: 'Health needs attention. Please consult with your doctor.',
      trend: 'Needs Care',
      ranking: 'Health Seeker',
      status: 'Medical Attention Needed'
    }
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user?.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Only patients can access health stats' }, { status: 403 })
    }

    // Get patient profile
    const patient = await db.patient.findUnique({
      where: { userId: session.user.id }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
    }

    // Get latest vitals for health stats
    const latestVitals = await db.vital.findMany({
      where: { patientId: patient.id },
      orderBy: { recordedAt: 'desc' },
      take: 10
    })

    // Get recent appointments
    const recentAppointments = await db.appointment.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: {
          include: {
            user: true
          }
        }
      },
      orderBy: { scheduledAt: 'desc' },
      take: 5
    })

    // Get active prescriptions
    const activePrescriptions = await db.prescription.findMany({
      where: { 
        patientId: patient.id,
        isActive: true
      },
      include: {
        doctor: {
          include: {
            user: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get recent lab tests
    const recentLabTests = await db.labTest.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    // Calculate health score
    const healthScore = calculateHealthScore(latestVitals, recentAppointments, activePrescriptions, recentLabTests)
    const healthStatus = getHealthStatus(healthScore)

    // Calculate health stats
    const healthStats = {
      healthScore: healthScore,
      totalAppointments: recentAppointments.length,
      activePrescriptions: activePrescriptions.length,
      recentLabTests: recentLabTests.length,
      latestVitals: latestVitals.slice(0, 5),
      upcomingAppointments: recentAppointments.filter(apt => 
        apt.status === 'CONFIRMED' && new Date(apt.scheduledAt) > new Date()
      ).length,
      completedAppointments: recentAppointments.filter(apt => 
        apt.status === 'COMPLETED'
      ).length,
      message: healthStatus.message,
      trend: healthStatus.trend,
      ranking: healthStatus.ranking,
      status: healthStatus.status,
      patientId: patient.nhrNumber || 'N/A'
    }

    return NextResponse.json(healthStats)
  } catch (error) {
    console.error('Error fetching patient health stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}