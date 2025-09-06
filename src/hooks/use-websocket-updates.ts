'use client'

import { useEffect, useRef } from 'react'
import { useSession } from "@/components/providers/session-provider"
import { toast } from '@/hooks/use-toast'
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
  
  const { data: user } = useSession()
  const socketRef = useRef<Socket | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  useEffect(() => {
    if (!enabled || !user) {
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
            userId: user.id,
            role: user.role
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
            toast({
              title: notification.title,
              description: notification.message,
              variant: "destructive",
              action: notification.actionUrl ? {
                label: 'View Details',
                onClick: () => window.location.href = notification.actionUrl
              } : undefined
            })
          } else if (notification.priority === 'medium') {
            toast({
              title: notification.title,
              description: notification.message
            })
          }
        })

        socket.on('system_notification', (notification) => {
          if (onNotification) {
            onNotification(notification)
          }
          
          toast({
            title: "System Notification",
            description: notification.message
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
          toast({
            title: "Appointment Update",
            description: message
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
          
          toast({
            title: "Vital Signs Updated",
            description: 'New vital signs recorded'
          })
        })

        socket.on('appointment_reminder', (reminder) => {
          if (onNotification) {
            onNotification(reminder)
          }
          
          toast({
            title: "Appointment Reminder",
            description: reminder.message,
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
          
          toast({
            title: "Prescription Update",
            description: update.message
          })
        })

        socket.on('lab_result_ready', (notification) => {
          if (onNotification) {
            onNotification(notification)
          }
          
          toast({
            title: "Lab Results Ready",
            description: notification.message
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
          toast({
            title: "Doctor Availability",
            description: `Dr. ${data.doctor?.user?.name} is now ${status}`
          })
        })

        socket.on('super_admin_notification', (notification) => {
          if (onNotification) {
            onNotification(notification)
          }
          
          if (notification.priority === 'high') {
            toast({
              title: "Critical Alert",
              description: notification.message
            })
          } else {
            toast({
              title: "Admin Notification",
              description: notification.message
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
            toast({
              title: "Connection Issue",
              description: 'Real-time updates unavailable. Please refresh the page.'
            })
          }
        })

        socket.on('error', (error) => {
          console.error('WebSocket error:', error)
          toast({
            title: "Error",
            description: 'Real-time update error occurred'
          })
        })

      } catch (error) {
        console.error('Failed to initialize WebSocket:', error)
        toast({
          title: "WebSocket Error",
          description: 'Failed to connect to real-time updates'
        })
      }
    }

    connectWebSocket()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [enabled, user, onDataUpdate, onNotification, onAppointmentUpdate, onVitalUpdate])

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
