'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import io, { Socket } from 'socket.io-client'

interface UseWebSocketUpdatesOptions {
  enabled?: boolean
  onDataUpdate?: (data: any) => void
  onNotification?: (notification: any) => void
  onAppointmentUpdate?: (appointment: any) => void
  onVitalUpdate?: (vital: any) => void
}

export function useWebSocketUpdates(options: UseWebSocketUpdatesOptions = {}) {
  const { 
    enabled = true, 
    onDataUpdate, 
    onNotification, 
    onAppointmentUpdate, 
    onVitalUpdate 
  } = options
  
  const { data: session } = useSession()
  const socketRef = useRef<Socket | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  useEffect(() => {
    if (!enabled || !session?.user) {
      return
    }

    const connectWebSocket = () => {
      try {
        socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
          transports: ['websocket', 'polling'],
          timeout: 10000,
          reconnection: true,
          reconnectionAttempts: maxReconnectAttempts,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
        })

        const socket = socketRef.current

        socket.on('connect', () => {
          console.log('WebSocket connected')
          reconnectAttempts.current = 0
          
          // Authenticate with the server
          socket.emit('authenticate', {
            userId: session.user.id,
            role: session.user.role
          })
        })

        socket.on('authenticated', (data) => {
          if (data.success) {
            console.log('WebSocket authenticated successfully')
          } else {
            console.error('WebSocket authentication failed:', data.message)
          }
        })

        socket.on('initial_data', (data) => {
          if (onDataUpdate) {
            onDataUpdate(data)
          }
        })

        socket.on('notification', (notification) => {
          if (onNotification) {
            onNotification(notification)
          }
          
          // Show toast notification for important updates
          if (notification.priority === 'high' || notification.type === 'urgent') {
            toast.error(notification.message, {
              description: notification.title,
              action: notification.actionUrl ? {
                label: 'View Details',
                onClick: () => window.location.href = notification.actionUrl
              } : undefined
            })
          } else if (notification.priority === 'medium') {
            toast.info(notification.message, {
              description: notification.title
            })
          }
        })

        socket.on('system_notification', (notification) => {
          if (onNotification) {
            onNotification(notification)
          }
          
          toast.info(notification.message, {
            description: `System: ${notification.type}`
          })
        })

        socket.on('appointment_updated', (appointment) => {
          if (onAppointmentUpdate) {
            onAppointmentUpdate(appointment)
          }
          
          // Show toast for appointment updates
          const statusMessages = {
            'CONFIRMED': 'Appointment confirmed',
            'IN_PROGRESS': 'Appointment in progress',
            'COMPLETED': 'Appointment completed',
            'CANCELLED': 'Appointment cancelled',
            'NO_SHOW': 'No show - appointment missed'
          }
          
          const message = statusMessages[appointment.status] || 'Appointment updated'
          toast.info(message, {
            description: `Appointment with ${appointment.doctor?.user?.name || 'Doctor'}`
          })
        })

        socket.on('vital_recorded', (vital) => {
          if (onVitalUpdate) {
            onVitalUpdate(vital)
          }
        })

        socket.on('patient_vital_updated', (data) => {
          if (onVitalUpdate) {
            onVitalUpdate(data)
          }
          
          toast.success('New vital signs recorded', {
            description: `Patient: ${data.patient?.user?.name}`
          })
        })

        socket.on('appointment_reminder', (reminder) => {
          if (onNotification) {
            onNotification(reminder)
          }
          
          toast.warning(reminder.message, {
            description: reminder.title,
            action: reminder.actionUrl ? {
              label: 'View Appointment',
              onClick: () => window.location.href = reminder.actionUrl
            } : undefined
          })
        })

        socket.on('prescription_update', (update) => {
          if (onNotification) {
            onNotification(update)
          }
          
          toast.info(update.message, {
            description: update.title,
            action: update.actionUrl ? {
              label: 'View Prescription',
              onClick: () => window.location.href = update.actionUrl
            } : undefined
          })
        })

        socket.on('lab_result_ready', (notification) => {
          if (onNotification) {
            onNotification(notification)
          }
          
          toast.success(notification.message, {
            description: notification.title,
            action: notification.actionUrl ? {
              label: 'View Results',
              onClick: () => window.location.href = notification.actionUrl
            } : undefined
          })
        })

        socket.on('doctor_availability_updated', (data) => {
          if (onDataUpdate) {
            onDataUpdate({
              type: 'doctor_availability',
              data
            })
          }
          
          const status = data.isAvailable ? 'available' : 'unavailable'
          toast.info(`Dr. ${data.doctor?.user?.name} is now ${status}`)
        })

        socket.on('super_admin_notification', (notification) => {
          if (onNotification) {
            onNotification(notification)
          }
          
          if (notification.priority === 'high') {
            toast.error(notification.message, {
              description: notification.title
            })
          } else {
            toast.info(notification.message, {
              description: notification.title
            })
          }
        })

        socket.on('disconnect', (reason) => {
          console.log('WebSocket disconnected:', reason)
          if (reason === 'io server disconnect') {
            // Server disconnected, don't try to reconnect
            return
          }
        })

        socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error)
          reconnectAttempts.current++
          
          if (reconnectAttempts.current >= maxReconnectAttempts) {
            toast.error('Real-time updates unavailable. Please refresh the page.')
          }
        })

        socket.on('error', (error) => {
          console.error('WebSocket error:', error)
          toast.error('Real-time update error occurred')
        })

      } catch (error) {
        console.error('Failed to initialize WebSocket:', error)
        toast.error('Failed to connect to real-time updates')
      }
    }

    connectWebSocket()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [enabled, session, onDataUpdate, onNotification, onAppointmentUpdate, onVitalUpdate])

  const sendUpdate = (type: string, data: any) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(type, data)
    }
  }

  return {
    isConnected: socketRef.current?.connected || false,
    sendUpdate
  }
}