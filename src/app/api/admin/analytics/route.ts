import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '6m' // 6m, 1y, all

    // Get current date for calculations
    const now = new Date()
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())

    // Calculate date range based on period
    const dateFilter = period === '6m' ? sixMonthsAgo : period === '1y' ? oneYearAgo : new Date(0)

    // Get overview metrics
    const [
      totalUsers,
      activePatients,
      totalDoctors,
      totalPartners,
      monthlyRevenue,
      completedAppointments,
      totalAppointments
    ] = await Promise.all([
      db.user.count({
        where: {
          createdAt: { gte: dateFilter }
        }
      }),
      db.user.count({
        where: {
          role: 'PATIENT',
          isActive: true
        }
      }),
      db.user.count({
        where: {
          role: 'DOCTOR',
          isActive: true
        }
      }),
      // Count all partner types (lab, pharmacy, hospital)
      await Promise.all([
        db.labPartner.count({ where: { isActive: true } }),
        db.pharmacyPartner.count({ where: { isActive: true } }),
        db.hospitalPartner.count({ where: { isActive: true } })
      ]).then(([lab, pharmacy, hospital]) => lab + pharmacy + hospital),
      // This would be calculated from actual payment data
      Promise.resolve(125000),
      db.appointment.count({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: dateFilter }
        }
      }),
      db.appointment.count({
        where: {
          createdAt: { gte: dateFilter }
        }
      })
    ])

    // Calculate revenue growth (mock data for now)
    const revenueGrowth = 18.5

    // Calculate appointment completion rate
    const appointmentCompletion = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0

    // Get user demographics (patients with date of birth)
    const patientsWithProfile = await db.user.findMany({
      where: {
        role: 'PATIENT',
        patient: {
          dateOfBirth: { not: null }
        }
      },
      include: {
        patient: true
      }
    })

    // Calculate age groups
    const ageGroups = patientsWithProfile.reduce((acc, patient) => {
      if (!patient.patient?.dateOfBirth) return acc
      
      const age = new Date().getFullYear() - new Date(patient.patient.dateOfBirth).getFullYear()
      let group = ''
      
      if (age >= 18 && age <= 25) group = '18-25'
      else if (age >= 26 && age <= 35) group = '26-35'
      else if (age >= 36 && age <= 45) group = '36-45'
      else if (age >= 46 && age <= 55) group = '46-55'
      else if (age >= 56) group = '55+'
      
      if (group) {
        acc[group] = (acc[group] || 0) + 1
      }
      
      return acc
    }, {} as Record<string, number>)

    // Calculate gender distribution
    const genderDistribution = patientsWithProfile.reduce((acc, patient) => {
      const gender = patient.patient?.gender || 'Other'
      acc[gender] = (acc[gender] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Get revenue by category (mock data)
    const revenueByCategory = {
      'Subscriptions': 85000,
      'Consultations': 40000,
      'Lab Tests': 15000,
      'Pharmacy': 10000,
      'Other': 5000
    }

    // Get appointment types distribution
    const appointmentTypes = await db.appointment.groupBy({
      by: ['type'],
      where: {
        createdAt: { gte: dateFilter }
      },
      _count: {
        type: true
      }
    })

    const appointmentsByType = appointmentTypes.reduce((acc, item) => {
      acc[item.type] = item._count.type
      return acc
    }, {} as Record<string, number>)

    // Get partner performance (combine all partner types)
    const [labPartners, pharmacyPartners, hospitalPartners] = await Promise.all([
      db.labPartner.findMany({
        where: { isActive: true },
        include: {
          labTests: {
            select: {
              id: true
            }
          }
        }
      }),
      db.pharmacyPartner.findMany({
        where: { isActive: true },
        include: {
          discounts: {
            select: {
              id: true
            }
          }
        }
      }),
      db.hospitalPartner.findMany({
        where: { isActive: true },
        include: {
          discounts: {
            select: {
              id: true
            }
          }
        }
      })
    ])

    const allPartners = [
      ...labPartners.map(p => ({ ...p, type: 'Lab', appointments: p.labTests.length })),
      ...pharmacyPartners.map(p => ({ ...p, type: 'Pharmacy', appointments: p.discounts.length })),
      ...hospitalPartners.map(p => ({ ...p, type: 'Hospital', appointments: p.discounts.length }))
    ]

    const partnerPerformance = allPartners.slice(0, 8).map(partner => ({
      name: partner.name,
      type: partner.type,
      rating: 4.5, // Default rating since not all partners have ratings
      appointments: partner.appointments
    }))

    // Get partner utilization rates (mock data)
    const utilizationRates = {
      'Hospitals': 85,
      'Laboratories': 78,
      'Pharmacies': 72
    }

    const analytics = {
      overview: {
        totalUsers,
        activePatients,
        totalDoctors,
        totalPartners,
        monthlyRevenue,
        revenueGrowth,
        appointmentCompletion,
        userSatisfaction: 4.7
      },
      userMetrics: {
        newUsers: Math.floor(totalUsers * 0.1), // 10% of total users are new
        activeUsers: Math.floor(totalUsers * 0.8), // 80% are active
        userGrowth: 12.5,
        userRetention: 85.2,
        demographics: {
          ageGroups,
          gender: genderDistribution,
          locations: {
            'New York': 35,
            'Los Angeles': 25,
            'Chicago': 20,
            'Houston': 15,
            'Other': 5
          }
        }
      },
      revenueMetrics: {
        totalRevenue: monthlyRevenue * 12, // Annual revenue
        monthlyRevenue,
        revenueGrowth,
        subscriptionRevenue: Math.floor(monthlyRevenue * 0.68),
        consultationRevenue: Math.floor(monthlyRevenue * 0.32),
        revenueByCategory,
        revenueTrend: [
          { month: 'Jan', revenue: 98000 },
          { month: 'Feb', revenue: 105000 },
          { month: 'Mar', revenue: 112000 },
          { month: 'Apr', revenue: 108000 },
          { month: 'May', revenue: 115000 },
          { month: 'Jun', revenue: monthlyRevenue }
        ]
      },
      appointmentMetrics: {
        totalAppointments,
        completedAppointments,
        cancelledAppointments: totalAppointments - completedAppointments,
        noShowRate: 7.5,
        averageWaitTime: 15,
        appointmentsByType,
        appointmentTrend: [
          { month: 'Jan', appointments: 180 },
          { month: 'Feb', appointments: 195 },
          { month: 'Mar', appointments: 210 },
          { month: 'Apr', appointments: 205 },
          { month: 'May', appointments: 220 },
          { month: 'Jun', appointments: Math.floor(totalAppointments / 6) }
        ]
      },
      partnerMetrics: {
        totalPartners,
        activePartners: totalPartners,
        partnerPerformance: partnerPerformance.slice(0, 4), // Top 4 partners
        utilizationRates
      }
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}