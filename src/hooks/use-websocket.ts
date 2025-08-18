'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'

interface UseWebSocketOptions {
  autoConnect?: boolean
}

interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { autoConnect = true } = options
  const { data: session } = useSession()
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const [initialData, setInitialData] = useState<any>(null)

  useEffect(() => {
    if (autoConnect && session?.user) {
      connect()
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [session, autoConnect])

  const connect = () => {
    if (!session?.user || socketRef.current?.connected) return

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling']
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('WebSocket connected')
      setIsConnected(true)
      
      // Authenticate with the server
      socket.emit('authenticate', {
        userId: session.user.id,
        role: session.user.role
      })
    })

    socket.on('authenticated', (data: any) => {
      console.log('WebSocket authenticated:', data)
    })

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    })

    socket.on('initial_data', (data: any) => {
      console.log('Received initial data:', data)
      setInitialData(data)
    })

    socket.on('appointment_updated', (data: any) => {
      console.log('Appointment updated:', data)
      addMessage({
        type: 'appointment_updated',
        data,
        timestamp: new Date().toISOString()
      })
    })

    socket.on('vital_recorded', (data: any) => {
      console.log('Vital recorded:', data)
      addMessage({
        type: 'vital_recorded',
        data,
        timestamp: new Date().toISOString()
      })
    })

    socket.on('patient_vital_updated', (data: any) => {
      console.log('Patient vital updated:', data)
      addMessage({
        type: 'patient_vital_updated',
        data,
        timestamp: new Date().toISOString()
      })
    })

    socket.on('doctor_availability_updated', (data: any) => {
      console.log('Doctor availability updated:', data)
      addMessage({
        type: 'doctor_availability_updated',
        data,
        timestamp: new Date().toISOString()
      })
    })

    socket.on('new_message', (data: any) => {
      console.log('New message:', data)
      addMessage({
        type: 'new_message',
        data,
        timestamp: new Date().toISOString()
      })
    })

    socket.on('system_notification', (data: any) => {
      console.log('System notification:', data)
      addMessage({
        type: 'system_notification',
        data,
        timestamp: new Date().toISOString()
      })
    })

    // Notification events for the notification system
    socket.on('notification', (data: any) => {
      console.log('Notification received:', data)
      addMessage({
        type: 'notification',
        data,
        timestamp: new Date().toISOString()
      })
    })

    socket.on('appointment_reminder', (data: any) => {
      console.log('Appointment reminder:', data)
      addMessage({
        type: 'appointment_reminder',
        data,
        timestamp: new Date().toISOString()
      })
    })

    socket.on('prescription_update', (data: any) => {
      console.log('Prescription update:', data)
      addMessage({
        type: 'prescription_update',
        data,
        timestamp: new Date().toISOString()
      })
    })

    socket.on('lab_result_ready', (data: any) => {
      console.log('Lab result ready:', data)
      addMessage({
        type: 'lab_result_ready',
        data,
        timestamp: new Date().toISOString()
      })
    })

    // Super admin notifications
    socket.on('super_admin_notification', (data: any) => {
      console.log('Super admin notification:', data)
      addMessage({
        type: 'super_admin_notification',
        data,
        timestamp: new Date().toISOString()
      })
    })

    socket.on('error', (error: any) => {
      console.error('WebSocket error:', error)
      addMessage({
        type: 'error',
        data: error,
        timestamp: new Date().toISOString()
      })
    })
  }

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }

  const addMessage = (message: WebSocketMessage) => {
    setMessages(prev => [...prev, message])
  }

  const clearMessages = () => {
    setMessages([])
  }

  const sendAppointmentUpdate = (appointmentId: string, status: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('appointment_update', { appointmentId, status })
    }
  }

  const sendVitalRecorded = (patientId: string, vital: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('vital_recorded', { patientId, vital })
    }
  }

  const sendDoctorAvailabilityUpdate = (doctorId: string, isAvailable: boolean) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('doctor_availability_update', { doctorId, isAvailable })
    }
  }

  const sendMessage = (recipientId: string, message: string, type: string = 'text') => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', { recipientId, message, type })
    }
  }

  const sendSystemNotification = (type: string, message: string, targetRole?: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('system_notification', { type, message, targetRole })
    }
  }

  const sendNotification = (notification: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('notification', notification)
    }
  }

  const sendAppointmentReminder = (appointmentId: string, patientId: string, message: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('appointment_reminder', { appointmentId, patientId, message })
    }
  }

  const sendPrescriptionUpdate = (prescriptionId: string, patientId: string, status: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('prescription_update', { prescriptionId, patientId, status })
    }
  }

  const sendLabResultReady = (labResultId: string, patientId: string, message: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('lab_result_ready', { labResultId, patientId, message })
    }
  }

  const sendSuperAdminNotification = (notification: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('super_admin_notification', notification)
    }
  }

  return {
    isConnected,
    messages,
    initialData,
    connect,
    disconnect,
    clearMessages,
    sendAppointmentUpdate,
    sendVitalRecorded,
    sendDoctorAvailabilityUpdate,
    sendMessage,
    sendSystemNotification,
    sendNotification,
    sendAppointmentReminder,
    sendPrescriptionUpdate,
    sendLabResultReady,
    sendSuperAdminNotification
  }
}

// Hook for real-time appointment updates
export function useRealTimeAppointments() {
  const { messages, sendAppointmentUpdate } = useWebSocket({ autoConnect: true })
  
  const appointmentUpdates = messages.filter(msg => msg.type === 'appointment_updated')
  
  return {
    appointmentUpdates,
    updateAppointmentStatus: sendAppointmentUpdate
  }
}

// Hook for real-time vital updates
export function useRealTimeVitals() {
  const { messages, sendVitalRecorded } = useWebSocket({ autoConnect: true })
  
  const vitalUpdates = messages.filter(msg => msg.type === 'vital_recorded')
  const patientVitalUpdates = messages.filter(msg => msg.type === 'patient_vital_updated')
  
  return {
    vitalUpdates,
    patientVitalUpdates,
    recordVital: sendVitalRecorded
  }
}

// Hook for real-time doctor availability
export function useRealTimeDoctorAvailability() {
  const { messages, sendDoctorAvailabilityUpdate } = useWebSocket({ autoConnect: true })
  
  const availabilityUpdates = messages.filter(msg => msg.type === 'doctor_availability_updated')
  
  return {
    availabilityUpdates,
    updateDoctorAvailability: sendDoctorAvailabilityUpdate
  }
}

// Hook for real-time messaging
export function useRealTimeMessaging() {
  const { messages, sendMessage } = useWebSocket({ autoConnect: true })
  
  const newMessages = messages.filter(msg => msg.type === 'new_message')
  
  return {
    newMessages,
    sendMessage
  }
}

// Hook for system notifications
export function useSystemNotifications() {
  const { messages, sendSystemNotification } = useWebSocket({ autoConnect: true })
  
  const notifications = messages.filter(msg => msg.type === 'system_notification')
  
  return {
    notifications,
    sendSystemNotification
  }
}

// Hook for real-time notifications
export function useRealTimeNotifications() {
  const { messages, sendNotification, sendAppointmentReminder, sendPrescriptionUpdate, sendLabResultReady, sendSuperAdminNotification } = useWebSocket({ autoConnect: true })
  
  const allNotifications = messages.filter(msg => 
    ['notification', 'appointment_reminder', 'prescription_update', 'lab_result_ready', 'super_admin_notification'].includes(msg.type)
  )
  
  const generalNotifications = messages.filter(msg => msg.type === 'notification')
  const appointmentReminders = messages.filter(msg => msg.type === 'appointment_reminder')
  const prescriptionUpdates = messages.filter(msg => msg.type === 'prescription_update')
  const labResultNotifications = messages.filter(msg => msg.type === 'lab_result_ready')
  const superAdminNotifications = messages.filter(msg => msg.type === 'super_admin_notification')
  
  return {
    allNotifications,
    generalNotifications,
    appointmentReminders,
    prescriptionUpdates,
    labResultNotifications,
    superAdminNotifications,
    sendNotification,
    sendAppointmentReminder,
    sendPrescriptionUpdate,
    sendLabResultReady,
    sendSuperAdminNotification
  }
}

// Hook specifically for super admin notifications
export function useSuperAdminNotifications() {
  const { messages, sendSuperAdminNotification } = useWebSocket({ autoConnect: true })
  
  const superAdminNotifications = messages.filter(msg => msg.type === 'super_admin_notification')
  
  return {
    superAdminNotifications,
    sendSuperAdminNotification
  }
}