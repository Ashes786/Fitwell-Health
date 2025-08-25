import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user?.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Only patients can access recommendations' }, { status: 403 })
    }

    // Get patient profile
    const patient = await db.patient.findUnique({
      where: { userId: session.user.id }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
    }

    // Get latest AI health reports
    const aiReports = await db.aIHealthReport.findMany({
      where: { 
        patientId: patient.id,
        isLatest: true
      },
      orderBy: {
        generatedAt: 'desc'
      },
      take: 5
    })

    // Get recent vitals to analyze health trends
    const recentVitals = await db.vital.findMany({
      where: { patientId: patient.id },
      orderBy: { recordedAt: 'desc' },
      take: 20
    })

    // Get active prescriptions for medication reminders
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
      }
    })

    // Generate recommendations based on data
    const recommendations = {
      aiReports: aiReports,
      healthInsights: generateHealthInsights(recentVitals),
      medicationReminders: activePrescriptions.map(prescription => ({
        id: prescription.id,
        medication: prescription.medication,
        dosage: prescription.dosage,
        frequency: prescription.frequency,
        instructions: prescription.instructions,
        doctor: prescription.doctor.user.name
      })),
      lifestyleRecommendations: generateLifestyleRecommendations(recentVitals)
    }

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error('Error fetching patient recommendations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to generate health insights
function generateHealthInsights(vitals: any[]) {
  const insights = []
  
  // Group vitals by type
  const vitalsByType = vitals.reduce((acc, vital) => {
    if (!acc[vital.type]) acc[vital.type] = []
    acc[vital.type].push(vital)
    return acc
  }, {})

  // Analyze blood pressure
  if (vitalsByType['BLOOD_PRESSURE_SYSTOLIC'] && vitalsByType['BLOOD_PRESSURE_DIASTOLIC']) {
    const systolic = vitalsByType['BLOOD_PRESSURE_SYSTOLIC'][0]?.value
    const diastolic = vitalsByType['BLOOD_PRESSURE_DIASTOLIC'][0]?.value
    
    if (systolic > 140 || diastolic > 90) {
      insights.push({
        type: 'alert',
        message: 'Your blood pressure is elevated. Consider consulting with your doctor.',
        category: 'cardiovascular'
      })
    } else if (systolic < 120 && diastolic < 80) {
      insights.push({
        type: 'success',
        message: 'Your blood pressure is within normal range.',
        category: 'cardiovascular'
      })
    }
  }

  // Analyze heart rate
  if (vitalsByType['HEART_RATE']) {
    const heartRate = vitalsByType['HEART_RATE'][0]?.value
    
    if (heartRate > 100) {
      insights.push({
        type: 'warning',
        message: 'Your heart rate is elevated. Consider resting and monitoring.',
        category: 'cardiovascular'
      })
    } else if (heartRate < 60) {
      insights.push({
        type: 'info',
        message: 'Your heart rate is lower than normal. This may be normal if you\'re athletic.',
        category: 'cardiovascular'
      })
    }
  }

  // Analyze blood sugar
  if (vitalsByType['BLOOD_SUGAR']) {
    const bloodSugar = vitalsByType['BLOOD_SUGAR'][0]?.value
    
    if (bloodSugar > 140) {
      insights.push({
        type: 'alert',
        message: 'Your blood sugar is elevated. Monitor your diet and consult your doctor.',
        category: 'metabolic'
      })
    }
  }

  return insights
}

// Helper function to generate lifestyle recommendations
function generateLifestyleRecommendations(vitals: any[]) {
  const recommendations = []

  // Check for activity recommendations based on heart rate and weight
  recommendations.push({
    type: 'exercise',
    title: 'Regular Exercise',
    description: 'Aim for at least 30 minutes of moderate exercise daily.',
    priority: 'high'
  })

  // Nutrition recommendations
  recommendations.push({
    type: 'nutrition',
    title: 'Balanced Diet',
    description: 'Maintain a balanced diet rich in fruits, vegetables, and whole grains.',
    priority: 'high'
  })

  // Hydration reminder
  recommendations.push({
    type: 'hydration',
    title: 'Stay Hydrated',
    description: 'Drink at least 8 glasses of water daily.',
    priority: 'medium'
  })

  // Sleep recommendations
  recommendations.push({
    type: 'sleep',
    title: 'Quality Sleep',
    description: 'Aim for 7-9 hours of quality sleep each night.',
    priority: 'medium'
  })

  return recommendations
}