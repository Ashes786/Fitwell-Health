"use client"

import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Eye, 
  ExternalLink, 
  Clock, 
  User, 
  Shield, 
  MapPin,
  Database,
  X,
  Check,
  Archive
} from 'lucide-react'
import { format } from 'date-fns'

interface NotificationDetailModalProps {
  isOpen: boolean
  onClose: () => void
  notification: {
    id: string
    type: string
    title: string
    message: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    status: 'UNREAD' | 'READ' | 'ARCHIVED'
    targetUser?: string
    targetRole?: string
    ipAddress?: string
    location?: string
    createdAt: string
    readAt?: string
    actionUrl?: string
    metadata?: Record<string, any>
  }
  onMarkAsRead?: (id: string) => void
  onArchive?: (id: string) => void
  onDelete?: (id: string) => void
}

export function NotificationDetailModal({
  isOpen,
  onClose,
  notification,
  onMarkAsRead,
  onArchive,
  onDelete
}: NotificationDetailModalProps) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 200)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'PASSWORD_CHANGE': return <Shield className="h-5 w-5 text-blue-600" />
      case 'SECURITY_ALERT': return <Shield className="h-5 w-5 text-red-600" />
      case 'SUBSCRIPTION_REQUEST': return <Database className="h-5 w-5 text-green-600" />
      case 'ADMIN_ACTION': return <User className="h-5 w-5 text-purple-600" />
      case 'SYSTEM_STATUS': return <Database className="h-5 w-5 text-gray-600" />
      case 'LOGIN_ATTEMPT': return <Shield className="h-5 w-5 text-yellow-600" />
      case 'BACKUP_COMPLETE': return <Database className="h-5 w-5 text-indigo-600" />
      case 'DATABASE_ALERT': return <Database className="h-5 w-5 text-orange-600" />
      default: return <Eye className="h-5 w-5 text-gray-600" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return <Badge variant="destructive">Critical</Badge>
      case 'HIGH': return <Badge className="bg-red-100 text-red-800">High</Badge>
      case 'MEDIUM': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case 'LOW': return <Badge variant="outline">Low</Badge>
      default: return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UNREAD': return <Badge className="bg-blue-100 text-blue-800">Unread</Badge>
      case 'READ': return <Badge variant="outline">Read</Badge>
      case 'ARCHIVED': return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy \'at\' HH:mm:ss')
  }

  const handleAction = () => {
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank')
    }
  }

  return (
    <Dialog open={isOpen && !isClosing} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {getNotificationIcon(notification.type)}
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {notification.title}
                </DialogTitle>
                <div className="flex items-center space-x-2 mt-2">
                  {getPriorityBadge(notification.priority)}
                  {getStatusBadge(notification.status)}
                  <Badge variant="outline" className="text-xs">
                    {notification.type.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Message Content */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Message</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {notification.message}
                </p>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Details</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="text-sm text-gray-900">
                      {formatDateTime(notification.createdAt)}
                    </p>
                  </div>
                </div>

                {notification.readAt && (
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Read</p>
                      <p className="text-sm text-gray-900">
                        {formatDateTime(notification.readAt)}
                      </p>
                    </div>
                  </div>
                )}

                {notification.targetUser && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Target User</p>
                      <p className="text-sm text-gray-900">
                        {notification.targetUser}
                      </p>
                    </div>
                  </div>
                )}

                {notification.targetRole && (
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Target Role</p>
                      <p className="text-sm text-gray-900">
                        {notification.targetRole}
                      </p>
                    </div>
                  </div>
                )}

                {notification.ipAddress && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">IP Address</p>
                      <p className="text-sm text-gray-900">
                        {notification.ipAddress}
                      </p>
                    </div>
                  </div>
                )}

                {notification.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm text-gray-900">
                        {notification.location}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Section */}
            {notification.metadata && Object.keys(notification.metadata).length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    {Object.entries(notification.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="text-sm text-gray-900">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action URL */}
            {notification.actionUrl && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Related Action</h4>
                <Button
                  onClick={handleAction}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Related Page
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator className="my-4" />

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {notification.status === 'UNREAD' && onMarkAsRead && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
              >
                <Check className="mr-2 h-4 w-4" />
                Mark as Read
              </Button>
            )}
            
            {notification.status !== 'ARCHIVED' && onArchive && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onArchive(notification.id)}
              >
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(notification.id)}
              >
                <X className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}