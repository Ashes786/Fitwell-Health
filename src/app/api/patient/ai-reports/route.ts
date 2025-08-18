import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user?.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Only patients can access AI reports' }, { status: 403 })
    }

    // Get patient profile
    const patient = await db.patient.findUnique({
      where: { userId: session.user.id }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
    }

    // Get patient's AI reports
    const reports = await db.aIHealthReport.findMany({
      where: { patientId: patient.id },
      orderBy: { generatedAt: 'desc' }
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error fetching AI reports:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user?.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Only patients can generate AI reports' }, { status: 403 })
    }

    const body = await request.json()
    const {
      reportType
    } = body

    // Validate required fields
    if (!reportType) {
      return NextResponse.json({ error: 'Missing report type' }, { status: 400 })
    }

    // Get patient profile
    const patient = await db.patient.findUnique({
      where: { userId: session.user.id }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
    }

    // Get patient's latest vitals for AI analysis
    const latestVitals = await db.vital.findMany({
      where: { patientId: patient.id },
      orderBy: { recordedAt: 'desc' },
      take: 10
    })

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Generate AI report based on type
    let prompt = ''
    let title = ''

    switch (reportType) {
      case 'GENERAL_HEALTH':
        title = 'General Health Assessment'
        prompt = `Based on the following patient vitals data, provide a comprehensive health assessment and recommendations:
        
        Patient Vitals: ${JSON.stringify(latestVitals, null, 2)}
        
        Please provide:
        1. Overall health status assessment
        2. Key observations from the vitals
        3. Specific recommendations for improvement
        4. Any areas that need medical attention
        5. Lifestyle suggestions
        
        Keep the response professional, informative, and actionable.`
        break
      case 'NUTRITION':
        title = 'Nutrition Analysis'
        prompt = `Based on the following patient vitals data, provide a nutrition analysis and dietary recommendations:
        
        Patient Vitals: ${JSON.stringify(latestVitals, null, 2)}
        
        Please provide:
        1. Current nutritional status assessment
        2. Dietary strengths and weaknesses
        3. Specific food recommendations
        4. Meal planning suggestions
        5. Supplements to consider
        
        Keep the response focused on nutrition and dietary advice.`
        break
      case 'SUPPLEMENTS':
        title = 'Supplement Recommendations'
        prompt = `Based on the following patient vitals data, provide personalized supplement recommendations:
        
        Patient Vitals: ${JSON.stringify(latestVitals, null, 2)}
        
        Please provide:
        1. Current nutritional gaps analysis
        2. Recommended supplements with reasons
        3. Dosage suggestions
        4. Timing recommendations
        5. Potential interactions to watch for
        
        Include a disclaimer about consulting with healthcare providers.`
        break
      case 'MEDICATION_REMINDERS':
        title = 'Medication Adherence Report'
        prompt = `Based on the following patient vitals data, provide a medication adherence analysis and reminder recommendations:
        
        Patient Vitals: ${JSON.stringify(latestVitals, null, 2)}
        
        Please provide:
        1. Current medication adherence assessment
        2. Reminder system recommendations
        3. Best practices for medication management
        4. Tracking suggestions
        5. Tips for maintaining consistency
        
        Focus on practical advice for medication management.`
        break
      case 'HYDRATION_REMINDERS':
        title = 'Hydration Analysis'
        prompt = `Based on the following patient vitals data, provide a hydration analysis and recommendations:
        
        Patient Vitals: ${JSON.stringify(latestVitals, null, 2)}
        
        Please provide:
        1. Current hydration status assessment
        2. Daily water intake recommendations
        3. Hydration tracking methods
        4. Signs of proper hydration
        5. Tips for maintaining optimal hydration
        
        Focus on practical hydration advice.`
        break
      case 'EXERCISE_RECOMMENDATIONS':
        title = 'Exercise Recommendations'
        prompt = `Based on the following patient vitals data, provide personalized exercise recommendations:
        
        Patient Vitals: ${JSON.stringify(latestVitals, null, 2)}
        
        Please provide:
        1. Current fitness level assessment
        2. Recommended exercise types and frequencies
        3. Intensity progression plan
        4. Safety considerations
        5. Exercise tracking suggestions
        
        Provide safe, gradual exercise recommendations.`
        break
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    // Generate AI report
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a professional healthcare AI assistant providing personalized health insights and recommendations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const reportContent = completion.choices[0]?.message?.content || 'Report generation failed.'

    // Create AI report record
    const report = await db.aIHealthReport.create({
      data: {
        reportType,
        title,
        content: reportContent,
        patientId: patient.id,
        generatedAt: new Date(),
        isLatest: true
      }
    })

    // Mark previous reports as not latest
    await db.aIHealthReport.updateMany({
      where: {
        patientId: patient.id,
        reportType,
        id: { not: report.id }
      },
      data: { isLatest: false }
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error('Error generating AI report:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}