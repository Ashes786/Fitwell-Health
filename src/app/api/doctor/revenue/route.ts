import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'DOCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const doctor = await db.doctor.findFirst({
      where: {
        userId: session.user.id
      }
    })

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '6m' // 6m, 1y, all

    // Calculate date range based on period
    const now = new Date()
    let dateFilter = new Date(0)
    
    if (period === '6m') {
      dateFilter = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
    } else if (period === '1y') {
      dateFilter = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    }

    // Get doctor's appointments and related data
    const [
      appointments,
      completedAppointments,
      pendingAppointments,
      uniquePatients
    ] = await Promise.all([
      // All appointments in the period
      db.appointment.findMany({
        where: {
          doctorId: doctor.id,
          createdAt: { gte: dateFilter },
          paymentStatus: { in: ['PAID', 'PENDING'] }
        },
        include: {
          patient: {
            include: {
              user: true
            }
          }
        },
        orderBy: {
          scheduledAt: 'desc'
        }
      }),
      // Completed appointments
      db.appointment.count({
        where: {
          doctorId: doctor.id,
          status: 'COMPLETED',
          createdAt: { gte: dateFilter }
        }
      }),
      // Pending payments
      db.appointment.count({
        where: {
          doctorId: doctor.id,
          paymentStatus: 'PENDING',
          createdAt: { gte: dateFilter }
        }
      }),
      // Unique patients
      db.appointment.groupBy({
        by: ['patientId'],
        where: {
          doctorId: doctor.id,
          createdAt: { gte: dateFilter }
        }
      })
    ])

    // Calculate revenue metrics
    const totalRevenue = appointments.reduce((sum, apt) => sum + (apt.consultationFee || 0), 0)
    const completedRevenue = appointments
      .filter(apt => apt.paymentStatus === 'PAID')
      .reduce((sum, apt) => sum + (apt.consultationFee || 0), 0)
    const pendingRevenue = appointments
      .filter(apt => apt.paymentStatus === 'PENDING')
      .reduce((sum, apt) => sum + (apt.consultationFee || 0), 0)

    const totalConsultations = appointments.length
    const averageRevenuePerConsultation = totalConsultations > 0 ? totalRevenue / totalConsultations : 0

    // Calculate monthly growth
    const currentMonthRevenue = appointments
      .filter(apt => {
        const aptDate = new Date(apt.createdAt)
        return aptDate.getMonth() === now.getMonth() && aptDate.getFullYear() === now.getFullYear()
      })
      .reduce((sum, apt) => sum + (apt.consultationFee || 0), 0)

    const lastMonthRevenue = appointments
      .filter(apt => {
        const aptDate = new Date(apt.createdAt)
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        return aptDate.getMonth() === lastMonth.getMonth() && aptDate.getFullYear() === lastMonth.getFullYear()
      })
      .reduce((sum, apt) => sum + (apt.consultationFee || 0), 0)

    const monthlyGrowth = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0

    // Generate revenue trend data
    const revenueTrend = await generateRevenueTrend(doctor.id, dateFilter)

    const summary = {
      totalRevenue,
      totalConsultations,
      totalPatients: uniquePatients.length,
      averageRevenuePerConsultation,
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
      pendingPayments: pendingRevenue,
      completedPayments: completedRevenue,
      failedPayments: 0 // No failed payments in current system
    }

    return NextResponse.json({
      summary,
      revenueTrend
    })
  } catch (error) {
    console.error('Error fetching doctor revenue:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateRevenueTrend(doctorId: string, startDate: Date) {
  const months = []
  const now = new Date()
  const start = new Date(startDate)
  
  // Generate month labels
  for (let d = new Date(start); d <= now; d.setMonth(d.getMonth() + 1)) {
    months.push(new Date(d))
  }

  const trend = await Promise.all(
    months.map(async (month) => {
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1)
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0)
      
      const appointments = await db.appointment.findMany({
        where: {
          doctorId,
          scheduledAt: {
            gte: monthStart,
            lte: monthEnd
          },
          paymentStatus: { in: ['PAID', 'PENDING'] }
        }
      })

      const revenue = appointments.reduce((sum, apt) => sum + (apt.consultationFee || 0), 0)
      const consultations = appointments.length
      const patients = new Set(appointments.map(apt => apt.patientId)).size

      return {
        period: month.toLocaleDateString('en-US', { month: 'short' }),
        revenue,
        consultations,
        patients
      }
    })
  )

  return trend
}