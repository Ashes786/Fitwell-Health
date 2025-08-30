'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from "@/components/providers/session-provider"
import { io, Socket } from 'socket.io-client'

interface UseWebSocketOptions {
  enabled?: boolean
  onConnect?: () => void
  onDisconnect?: () => void
  onMessage?: (data: any) => void
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { enabled = true, onConnect, onDisconnect, onMessage } = options
  const { user } = useSession()
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!enabled || !user) {
      return
    }

    // Initialize socket connection
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling']
    })

    socketRef.current = socket

    // Connection event handlers
    socket.on('connect', () => {
      console.log('WebSocket connected')
      setIsConnected(true)
      
      // Authenticate with user role
      socket.emit('authenticate', {
        userId: user.id,
        role: user.role
      })
      
      onConnect?.()
    })

    socket.on('authenticated', (data) => {
      if (data.success) {
        console.log('WebSocket authenticated:', data.message)
      } else {
        console.error('WebSocket authentication failed:', data.message)
      }
    })

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
      onDisconnect?.()
    })

    // Message handlers for different types of updates
    socket.on('appointment_updated', (data) => {
      console.log('Appointment updated:', data)
      onMessage?.({ type: 'appointment_updated', data })
    })

    socket.on('vital_recorded', (data) => {
      console.log('Vital recorded:', data)
      onMessage?.({ type: 'vital_recorded', data })
    })

    socket.on('patient_vital_updated', (data) => {
      console.log('Patient vital updated:', data)
      onMessage?.({ type: 'patient_vital_updated', data })
    })

    socket.on('doctor_availability_updated', (data) => {
      console.log('Doctor availability updated:', data)
      onMessage?.({ type: 'doctor_availability_updated', data })
    })

    socket.on('new_message', (data) => {
      console.log('New message:', data)
      onMessage?.({ type: 'new_message', data })
    })

    socket.on('system_notification', (data) => {
      console.log('System notification:', data)
      onMessage?.({ type: 'system_notification', data })
    })

    socket.on('notification', (data) => {
      console.log('Notification:', data)
      onMessage?.({ type: 'notification', data })
    })

    socket.on('appointment_reminder', (data) => {
      console.log('Appointment reminder:', data)
      onMessage?.({ type: 'appointment_reminder', data })
    })

    socket.on('prescription_update', (data) => {
      console.log('Prescription update:', data)
      onMessage?.({ type: 'prescription_update', data })
    })

    socket.on('lab_result_ready', (data) => {
      console.log('Lab result ready:', data)
      onMessage?.({ type: 'lab_result_ready', data })
    })

    socket.on('initial_data', (data) => {
      console.log('Initial data received:', data)
      onMessage?.({ type: 'initial_data', data })
    })

    // Error handler
    socket.on('error', (error) => {
      console.error('WebSocket error:', error)
    })

    // Cleanup on unmount
    return () => {
      socket.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [enabled, user, onConnect, onDisconnect, onMessage])

  // Function to send messages through WebSocket
  const sendMessage = (event: string, data: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data)
    } else {
      console.warn('WebSocket not connected, cannot send message')
    }
  }

  return {
    isConnected,
    sendMessage
  }
}

// Specific hooks for different real-time data types
export function useRealTimeAppointments() {
  const [appointments, setAppointments] = useState<any[]>([])
  const { isConnected, sendMessage } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'appointment_updated') {
        setAppointments(prev => {
          const index = prev.findIndex(apt => apt.id === message.data.id)
          if (index >= 0) {
            const updated = [...prev]
            updated[index] = message.data
            return updated
          }
          return [...prev, message.data]
        })
      } else if (message.type === 'initial_data' && message.data.type === 'upcoming_appointments') {
        setAppointments(message.data.data)
      }
    }
  })

  const updateAppointment = (appointmentId: string, status: string) => {
    sendMessage('appointment_update', { appointmentId, status })
  }

  return {
    appointments,
    isConnected,
    updateAppointment
  }
}

export function useRealTimeVitals() {
  const [vitals, setVitals] = useState<any[]>([])
  const { isConnected, sendMessage } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'vital_recorded') {
        setVitals(prev => [message.data, ...prev])
      } else if (message.type === 'patient_vital_updated') {
        setVitals(prev => [message.data.vital, ...prev])
      }
    }
  })

  const recordVital = (patientId: string, vital: any) => {
    sendMessage('vital_recorded', { patientId, vital })
  }

  return {
    vitals,
    isConnected,
    recordVital
  }
}

export function useRealTimeNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  const { isConnected, sendMessage } = useWebSocket({
    onMessage: (message) => {
      if ([
        'system_notification',
        'notification',
        'appointment_reminder',
        'prescription_update',
        'lab_result_ready'
      ].includes(message.type)) {
        setNotifications(prev => [message.data, ...prev])
      }
    }
  })

  const sendNotification = (data: any) => {
    sendMessage('notification', data)
  }

  const markAsRead = (notificationId: string) => {
    // This would typically update the notification in the database
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ))
  }

  return {
    notifications,
    isConnected,
    sendNotification,
    markAsRead
  }
}