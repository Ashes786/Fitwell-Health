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
      return NextResponse.json({ error: 'Only control room staff can access bed occupancy' }, { status: 403 })
    }

    // Mock bed occupancy data since we don't have a bed model in the schema
    const bedOccupancy = [
      { id: '1', bedNumber: 'A-101', ward: 'Emergency', status: 'occupied', patientName: 'John Doe', admissionDate: new Date('2024-01-15') },
      { id: '2', bedNumber: 'A-102', ward: 'Emergency', status: 'available', patientName: null, admissionDate: null },
      { id: '3', bedNumber: 'A-103', ward: 'Emergency', status: 'maintenance', patientName: null, admissionDate: null },
      { id: '4', bedNumber: 'B-201', ward: 'ICU', status: 'occupied', patientName: 'Jane Smith', admissionDate: new Date('2024-01-14') },
      { id: '5', bedNumber: 'B-202', ward: 'ICU', status: 'occupied', patientName: 'Robert Johnson', admissionDate: new Date('2024-01-16') },
      { id: '6', bedNumber: 'B-203', ward: 'ICU', status: 'available', patientName: null, admissionDate: null },
      { id: '7', bedNumber: 'C-301', ward: 'General', status: 'occupied', patientName: 'Mary Williams', admissionDate: new Date('2024-01-13') },
      { id: '8', bedNumber: 'C-302', ward: 'General', status: 'available', patientName: null, admissionDate: null },
      { id: '9', bedNumber: 'C-303', ward: 'General', status: 'reserved', patientName: 'Pending', admissionDate: null },
      { id: '10', bedNumber: 'C-304', ward: 'General', status: 'available', patientName: null, admissionDate: null },
    ]

    return NextResponse.json(bedOccupancy)
  } catch (error) {
    console.error('Error fetching bed occupancy:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}