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

    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get('doctorId')
    const date = searchParams.get('date')

    if (!doctorId || !date) {
      return NextResponse.json({ error: 'Missing doctorId or date parameter' }, { status: 400 })
    }

    // Get doctor's availability schedule
    const doctor = await db.doctor.findUnique({
      where: { userId: doctorId }
    })

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 })
    }

    // Parse the availability schedule (stored as JSON string)
    const availabilitySchedule = JSON.parse(doctor.availabilitySchedule || '[]')
    
    // Get existing appointments for the doctor on the selected date
    const existingAppointments = await db.appointment.findMany({
      where: {
        doctorId,
        scheduledAt: {
          gte: new Date(date + 'T00:00:00.000Z'),
          lt: new Date(date + 'T23:59:59.999Z')
        },
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      },
      select: {
        scheduledAt: true
      }
    })

    // Generate time slots based on doctor's availability
    const targetDate = new Date(date)
    const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'long' })
    
    // Get doctor's availability for the day of week
    const dayAvailability = availabilitySchedule.find((schedule: any) => schedule.day === dayOfWeek)
    
    if (!dayAvailability || !dayAvailability.isAvailable) {
      return NextResponse.json([])
    }

    // Generate time slots
    const timeSlots = []
    const startHour = parseInt(dayAvailability.startTime.split(':')[0])
    const startMinute = parseInt(dayAvailability.startTime.split(':')[1])
    const endHour = parseInt(dayAvailability.endTime.split(':')[0])
    const endMinute = parseInt(dayAvailability.endTime.split(':')[1])
    
    const slotDuration = 30 // 30 minutes per slot
    
    let currentHour = startHour
    let currentMinute = startMinute
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
      const slotDateTime = new Date(date + 'T' + timeString + ':00.000Z')
      
      // Check if this slot is already booked
      const isBooked = existingAppointments.some(appointment => {
        const appointmentTime = new Date(appointment.scheduledAt)
        return appointmentTime.getHours() === currentHour && appointmentTime.getMinutes() === currentMinute
      })
      
      timeSlots.push({
        date: date,
        time: timeString,
        available: !isBooked
      })
      
      // Move to next slot
      currentMinute += slotDuration
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60)
        currentMinute = currentMinute % 60
      }
    }

    return NextResponse.json(timeSlots)
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}