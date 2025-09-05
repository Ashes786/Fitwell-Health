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

    if (session.user?.role !== 'CONTROL_ROOM') {
      return NextResponse.json({ error: 'Only control room staff can access staff status' }, { status: 403 })
    }

    // Get doctors with their status
    const doctors = await db.doctor.findMany({
      include: {
        user: true
      }
    })

    // Get attendants with their status
    const attendants = await db.attendant.findMany({
      include: {
        user: true
      }
    })

    // Get control room staff
    const controlRoomStaff = await db.controlRoom.findMany({
      include: {
        user: true
      }
    })

    // Transform data for staff status
    const staffStatus = [
      ...doctors.map(doctor => ({
        id: doctor.id,
        name: `Dr. ${doctor.user.name || ''}`,
        role: 'Doctor',
        department: doctor.specialization,
        status: doctor.isAvailable ? 'on-duty' : 'off-duty',
        shiftStart: '09:00', // Mock data
        shiftEnd: '17:00', // Mock data
        avatar: doctor.user.image || ''
      })),
      ...attendants.map(attendant => ({
        id: attendant.id,
        name: attendant.user.name || '',
        role: 'Attendant',
        department: attendant.department || 'Front Desk',
        status: 'on-duty', // Mock data
        shiftStart: '08:00', // Mock data
        shiftEnd: '16:00', // Mock data
        avatar: attendant.user.image || ''
      })),
      ...controlRoomStaff.map(staff => ({
        id: staff.id,
        name: staff.user.name || '',
        role: 'Control Room',
        department: 'Control Room',
        status: 'on-duty', // Mock data
        shiftStart: '00:00', // Mock data (24/7 operation)
        shiftEnd: '23:59', // Mock data
        avatar: staff.user.image || ''
      }))
    ]

    return NextResponse.json(staffStatus)
  } catch (error) {
    console.error('Error fetching staff status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}