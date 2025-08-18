"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Bell, X, Check, CheckCheck, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { useSuperAdminNotifications, useWebSocket } from '@/hooks/use-websocket'
import { NotificationDetailModal } from '@/components/ui/notification-detail-modal'

interface Notification {
  id: string
  title: string
  message: string
  type: 'appointment' | 'message' | 'system' | 'prescription' | 'lab_result' | 'PASSWORD_CHANGE' | 'SECURITY_ALERT' | 'SUBSCRIPTION_REQUEST' | 'ADMIN_ACTION' | 'SYSTEM_STATUS' | 'LOGIN_ATTEMPT' | 'BACKUP_COMPLETE' | 'DATABASE_ALERT'
  priority: 'low' | 'medium' | 'high' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  isRead: boolean
  createdAt: string
  actionUrl?: string
  targetUser?: string
  targetRole?: string
  ipAddress?: string
  location?: string
  metadata?: Record<string, any>
}

export function NotificationSystem() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { superAdminNotifications } = useSuperAdminNotifications()
  const { socket, isConnected } = useWebSocket()

  // Sound effects
  const playNotificationSound = useCallback((type: 'default' | 'urgent' = 'default') => {
    try {
      const audio = new Audio()
      audio.src = type === 'urgent' 
        ? '/sounds/notification-urgent.mp3' 
        : '/sounds/notification-default.mp3'
      audio.volume = 0.7
      audio.play().catch(console.error)
    } catch (error) {
      console.error('Error playing notification sound:', error)
    }
  }, [])

  // Show toast notification
  const showToastNotification = useCallback((notification: Notification) => {
    const priority = notification.priority.toLowerCase()
    const variant = priority === 'high' || priority === 'critical' ? 'destructive' : 'default'
    const title = notification.title
    
    toast({
      title,
      description: notification.message,
      variant,
      action: notification.actionUrl ? (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            window.location.href = notification.actionUrl!
          }}
        >
          View
        </Button>
      ) : undefined,
    })
  }, [toast])

  // Handle incoming notifications
  const handleNotification = useCallback((data: any) => {
    const newNotification: Notification = {
      id: data.id || Date.now().toString(),
      title: data.title,
      message: data.message,
      type: data.type || 'system',
      priority: data.priority || 'medium',
      isRead: false,
      createdAt: new Date().toISOString(),
      actionUrl: data.actionUrl,
      targetUser: data.targetUser,
      targetRole: data.targetRole,
      ipAddress: data.ipAddress,
      location: data.location,
      metadata: data.metadata
    }

    setNotifications(prev => [newNotification, ...prev])
    
    // Play sound based on priority
    const priority = newNotification.priority.toLowerCase()
    playNotificationSound(priority === 'high' || priority === 'critical' ? 'urgent' : 'default')
    
    // Show toast notification
    showToastNotification(newNotification)
  }, [playNotificationSound, showToastNotification])

  // Handle real-time super admin notifications
  useEffect(() => {
    if (superAdminNotifications.length > 0) {
      const latestNotification = superAdminNotifications[superAdminNotifications.length - 1]
      if (latestNotification && latestNotification.data) {
        handleNotification(latestNotification.data)
      }
    }
  }, [superAdminNotifications, handleNotification])

  // WebSocket event listeners
  useEffect(() => {
    if (socket && isConnected) {
      socket.on('notification', handleNotification)
      socket.on('appointment_reminder', handleNotification)
      socket.on('new_message', handleNotification)
      socket.on('prescription_update', handleNotification)
      socket.on('lab_result_ready', handleNotification)

      return () => {
        socket.off('notification', handleNotification)
        socket.off('appointment_reminder', handleNotification)
        socket.off('new_message', handleNotification)
        socket.off('prescription_update', handleNotification)
        socket.off('lab_result_ready', handleNotification)
      }
    }
  }, [socket, isConnected, handleNotification])

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
    setIsOpen(false)
  }

  // Handle view notification details
  const handleViewDetails = (notification: Notification, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedNotification(notification)
    setIsModalOpen(true)
  }

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedNotification(null)
  }

  // Handle mark as read from modal
  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  // Handle delete from modal
  const handleDelete = (id: string) => {
    deleteNotification(id)
    setIsModalOpen(false)
    setSelectedNotification(null)
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return '📅'
      case 'message':
        return '💬'
      case 'prescription':
        return '💊'
      case 'lab_result':
        return '🔬'
      default:
        return '🔔'
    }
  }

  const getNotificationColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'border-red-200 bg-red-50'
      case 'medium':
        return 'border-yellow-200 bg-yellow-50'
      case 'low':
        return 'border-green-200 bg-green-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-health-primary hover:bg-health-light/20 relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs min-w-5"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 backdrop-blur-sm bg-white/95 border border-health-primary/20 shadow-health-lg p-0"
      >
        <div className="flex items-center justify-between p-4 border-b border-health-primary/10">
          <h3 className="text-lg font-semibold text-health-dark">Notifications</h3>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs text-health-primary hover:bg-health-light/20"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllNotifications}
                className="text-xs text-red-600 hover:bg-red-50"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-health-muted">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-health-primary/5 cursor-pointer transition-all duration-200 hover:bg-health-light/10 ${
                  !notification.isRead ? 'bg-health-light/5' : ''
                } ${getNotificationColor(notification.priority)}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-health-dark' : 'text-health-muted'}`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-health-muted">
                            {formatTime(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-health-primary rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-health-muted mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            notification.priority.toLowerCase() === 'high' || notification.priority.toLowerCase() === 'critical' ? 'bg-red-100 text-red-800' :
                            notification.priority.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}
                        >
                          {notification.priority}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewDetails(notification, e)
                            }}
                            className="h-6 w-6 p-0 text-health-muted hover:text-health-primary"
                            title="View details"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification.id)
                            }}
                            className="h-6 w-6 p-0 text-health-muted hover:text-health-primary"
                            title="Mark as read"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                            className="h-6 w-6 p-0 text-health-muted hover:text-red-600"
                            title="Delete notification"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-3 border-t border-health-primary/10 bg-health-light/5">
            <p className="text-xs text-center text-health-muted">
              {unreadCount} unread of {notifications.length} notifications
            </p>
          </div>
        )}
      </DropdownMenuContent>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <NotificationDetailModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          notification={{
            id: selectedNotification.id,
            type: selectedNotification.type,
            title: selectedNotification.title,
            message: selectedNotification.message,
            priority: selectedNotification.priority.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
            status: selectedNotification.isRead ? 'READ' : 'UNREAD',
            targetUser: selectedNotification.targetUser,
            targetRole: selectedNotification.targetRole,
            ipAddress: selectedNotification.ipAddress,
            location: selectedNotification.location,
            createdAt: selectedNotification.createdAt,
            actionUrl: selectedNotification.actionUrl,
            metadata: selectedNotification.metadata
          }}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
        />
      )}
    </DropdownMenu>
  )
}