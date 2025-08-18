"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { 
  Bell, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  Pill, 
  FlaskConical,
  Settings,
  Volume2,
  VolumeX,
  Save,
  Trash2,
  CheckCheck
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function NotificationsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    messageNotifications: true,
    prescriptionAlerts: true,
    labResultNotifications: true,
    marketingEmails: false,
    soundEnabled: true,
    desktopNotifications: true,
    quietHours: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
  })

  // Notification history (mock data)
  const [notificationHistory] = useState([
    {
      id: '1',
      title: 'Appointment Reminder',
      message: 'Your appointment with Dr. Smith is tomorrow at 2:00 PM',
      type: 'appointment',
      priority: 'medium',
      isRead: true,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'New Message',
      message: 'You have a new message from your doctor',
      type: 'message',
      priority: 'low',
      isRead: false,
      createdAt: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      title: 'Prescription Ready',
      message: 'Your prescription is ready for pickup',
      type: 'prescription',
      priority: 'high',
      isRead: false,
      createdAt: '2024-01-14T16:45:00Z'
    }
  ])

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Settings Updated",
        description: "Your notification preferences have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearHistory = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "History Cleared",
        description: "Your notification history has been cleared.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear notification history. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-4 w-4" />
      case 'message':
        return <MessageSquare className="h-4 w-4" />
      case 'prescription':
        return <Pill className="h-4 w-4" />
      case 'lab_result':
        return <FlaskConical className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-health-dark">Notification Settings</h1>
          <p className="text-health-muted mt-2">Manage your notification preferences and history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notification Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Email Notifications</span>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, emailNotifications: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <span>Push Notifications</span>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, pushNotifications: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>SMS Notifications</span>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, smsNotifications: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Appointment Reminders</span>
                    </div>
                    <Switch
                      checked={notificationSettings.appointmentReminders}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, appointmentReminders: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Message Notifications</span>
                    </div>
                    <Switch
                      checked={notificationSettings.messageNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, messageNotifications: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Pill className="h-4 w-4" />
                      <span>Prescription Alerts</span>
                    </div>
                    <Switch
                      checked={notificationSettings.prescriptionAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, prescriptionAlerts: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FlaskConical className="h-4 w-4" />
                      <span>Lab Result Notifications</span>
                    </div>
                    <Switch
                      checked={notificationSettings.labResultNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, labResultNotifications: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Sound & Alerts</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {notificationSettings.soundEnabled ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                      <span>Sound Effects</span>
                    </div>
                    <Switch
                      checked={notificationSettings.soundEnabled}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, soundEnabled: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Desktop Notifications</span>
                    <Switch
                      checked={notificationSettings.desktopNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, desktopNotifications: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Quiet Hours</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Enable Quiet Hours</span>
                    <Switch
                      checked={notificationSettings.quietHours}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, quietHours: checked})
                      }
                    />
                  </div>
                  {notificationSettings.quietHours && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Start Time</label>
                        <input
                          type="time"
                          value={notificationSettings.quietHoursStart}
                          onChange={(e) => 
                            setNotificationSettings({...notificationSettings, quietHoursStart: e.target.value})
                          }
                          className="w-full p-2 border border-health-primary/20 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Time</label>
                        <input
                          type="time"
                          value={notificationSettings.quietHoursEnd}
                          onChange={(e) => 
                            setNotificationSettings({...notificationSettings, quietHoursEnd: e.target.value})
                          }
                          className="w-full p-2 border border-health-primary/20 rounded-md"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={isLoading} className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification History */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Recent Notifications</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearHistory}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Clear</span>
                </Button>
              </CardTitle>
              <CardDescription>
                Your recent notification history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {notificationHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-health-muted opacity-50" />
                  <p className="text-sm text-health-muted">No notifications yet</p>
                </div>
              ) : (
                notificationHistory.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      notification.isRead ? 'bg-white border-health-primary/10' : 'bg-health-light/20 border-health-primary/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2">
                        <div className="text-health-primary">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-health-dark">
                            {notification.title}
                          </h5>
                          <p className="text-xs text-health-muted mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getPriorityColor(notification.priority)}`}
                            >
                              {notification.priority}
                            </Badge>
                            <span className="text-xs text-health-muted">
                              {formatTime(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-health-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCheck className="h-5 w-5" />
                <span>Quick Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-health-muted">Total Notifications</span>
                <Badge variant="secondary">{notificationHistory.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-health-muted">Unread</span>
                <Badge variant="destructive">
                  {notificationHistory.filter(n => !n.isRead).length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-health-muted">High Priority</span>
                <Badge variant="destructive" className="bg-red-100 text-red-800">
                  {notificationHistory.filter(n => n.priority === 'high').length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}