'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCustomSession } from '@/hooks/use-custom-session'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Settings, 
  Bell, 
  Shield, 
  User, 
  Mail,
  Phone,
  Lock,
  Globe,
  Moon,
  Sun,
  ToggleLeft,
  ToggleRight,
  Save
} from 'lucide-react'
import { toast } from 'sonner'

interface UserSettings {
  name: string
  email: string
  phone: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacy: {
    profileVisible: boolean
    shareData: boolean
  }
  preferences: {
    theme: 'light' | 'dark'
    language: string
  }
}

export default function SettingsPage() {
  const { user, loading } = useCustomSession()
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    email: '',
    phone: '',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profileVisible: true,
      shareData: false
    },
    preferences: {
      theme: 'light',
      language: 'English'
    }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/auth/signin')
      return
    }

    // Load user settings
    setSettings(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
      phone: '+1 (555) 123-4567' // Mock phone
    }))
    setIsLoading(false)
  }, [user, loading, router])

  const handleSaveSettings = async () => {
    try {
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    }
  }

  const toggleNotification = (type: keyof UserSettings['notifications']) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }))
  }

  const togglePrivacy = (type: keyof UserSettings['privacy']) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [type]: !prev.privacy[type]
      }
    }))
  }

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Please sign in to access settings.</p>
        <Button onClick={() => router.push('/auth/signin')} className="mt-4">
          Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                    {user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <Badge variant="secondary">{user.role?.replace('_', ' ')}</Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="flex items-center mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{settings.email}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <div className="flex items-center mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{settings.phone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleNotification('email')}
                  className="p-2"
                >
                  {settings.notifications.email ? (
                    <ToggleRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-600">Receive browser notifications</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleNotification('push')}
                  className="p-2"
                >
                  {settings.notifications.push ? (
                    <ToggleRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Receive text messages</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleNotification('sms')}
                  className="p-2"
                >
                  {settings.notifications.sms ? (
                    <ToggleRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>Control your privacy and data sharing preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Profile Visibility</p>
                    <p className="text-sm text-gray-600">Make your profile visible to others</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePrivacy('profileVisible')}
                  className="p-2"
                >
                  {settings.privacy.profileVisible ? (
                    <ToggleRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Data Sharing</p>
                    <p className="text-sm text-gray-600">Share anonymized data for research</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePrivacy('shareData')}
                  className="p-2"
                >
                  {settings.privacy.shareData ? (
                    <ToggleRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Preferences
              </CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {settings.preferences.theme === 'dark' ? (
                    <Moon className="h-5 w-5 text-gray-600" />
                  ) : (
                    <Sun className="h-5 w-5 text-gray-600" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">Theme</p>
                    <p className="text-sm text-gray-600">
                      {settings.preferences.theme === 'dark' ? 'Dark mode' : 'Light mode'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSettings(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      theme: prev.preferences.theme === 'light' ? 'dark' : 'light'
                    }
                  }))}
                  className="p-2"
                >
                  {settings.preferences.theme === 'dark' ? (
                    <Moon className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Sun className="h-4 w-4 text-yellow-600" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}