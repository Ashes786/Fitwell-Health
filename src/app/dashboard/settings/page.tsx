"use client"

import { useCustomSession } from "@/hooks/use-custom-session"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database,
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Key,
  Download,
  Upload,
  Save,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"

interface UserProfile {
  name: string
  email: string
  phone?: string
  role: string
  specialization?: string
  address?: string
  city?: string
  country?: string
  dateOfBirth?: string
  avatar?: string
  createdAt: string
  lastLogin?: string
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  appointmentReminders: boolean
  marketingEmails: boolean
  securityAlerts: boolean
  systemUpdates: boolean
}

interface SystemSettings {
  theme: 'light' | 'dark' | 'auto'
  language: string
  timezone: string
  dateFormat: string
  timeFormat: '12h' | '24h'
}

export default function UnifiedSettings() {
  const { user, loading } = useCustomSession()
  const router = useRouter()
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    role: '',
    specialization: '',
    address: '',
    city: '',
    country: '',
    dateOfBirth: '',
    avatar: '',
    createdAt: '',
    lastLogin: ''
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    appointmentReminders: true,
    marketingEmails: false,
    securityAlerts: true,
    systemUpdates: false
  })

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  })

  useEffect(() => {
    if (user && !loading) {
      loadUserProfile()
    }
  }, [user, loading])

  const loadUserProfile = async () => {
    if (!user) return

    try {
      // Simulate loading user profile
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || '',
        specialization: user.specialization || '',
        address: '',
        city: '',
        country: '',
        dateOfBirth: '',
        avatar: user.avatar || '',
        createdAt: user.createdAt || new Date().toISOString(),
        lastLogin: user.lastLogin || new Date().toISOString()
      })
    } catch (error) {
      console.error('Error loading user profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setIsDataLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Notification settings updated')
    } catch (error) {
      console.error('Error saving notification settings:', error)
      toast.error('Failed to update notification settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveSystemSettings = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('System settings updated')
    } catch (error) {
      console.error('Error saving system settings:', error)
      toast.error('Failed to update system settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = () => {
    toast.info('Data export started')
  }

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion requires additional verification')
    }
  }

  if (loading || isDataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to access settings.</p>
          <Button onClick={() => router.push('/auth/signin')} variant="outline">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account preferences and system settings
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={profile.role.replace('_', ' ')}
                    disabled
                    className="mt-1 bg-gray-50"
                  />
                </div>
                {profile.specialization && (
                  <div>
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={profile.specialization}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) => setProfile({...profile, city: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Member Since</Label>
                  <p className="font-medium">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Last Login</Label>
                  <p className="font-medium">
                    {profile.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-orange-600" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, emailNotifications: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, pushNotifications: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Appointment Reminders</Label>
                    <p className="text-sm text-gray-600">Get reminded about upcoming appointments</p>
                  </div>
                  <Switch
                    checked={notificationSettings.appointmentReminders}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, appointmentReminders: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Marketing Emails</Label>
                    <p className="text-sm text-gray-600">Receive promotional emails and updates</p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, marketingEmails: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Security Alerts</Label>
                    <p className="text-sm text-gray-600">Get notified about security events</p>
                  </div>
                  <Switch
                    checked={notificationSettings.securityAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, securityAlerts: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">System Updates</Label>
                    <p className="text-sm text-gray-600">Receive system maintenance notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, systemUpdates: checked})
                    }
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveNotifications} disabled={isSaving}>
                  {isSaving ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-purple-600" />
                <span>Appearance & Display</span>
              </CardTitle>
              <CardDescription>
                Customize how the application looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={systemSettings.theme} onValueChange={(value: 'light' | 'dark' | 'auto') => 
                    setSystemSettings({...systemSettings, theme: value})
                  }>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={systemSettings.language} onValueChange={(value) => 
                    setSystemSettings({...systemSettings, language: value})
                  }>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={systemSettings.timezone} onValueChange={(value) => 
                    setSystemSettings({...systemSettings, timezone: value})
                  }>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={systemSettings.dateFormat} onValueChange={(value) => 
                    setSystemSettings({...systemSettings, dateFormat: value})
                  }>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select value={systemSettings.timeFormat} onValueChange={(value: '12h' | '24h') => 
                    setSystemSettings({...systemSettings, timeFormat: value})
                  }>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveSystemSettings} disabled={isSaving}>
                  {isSaving ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-red-600" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Manage your account security and privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <Label className="font-medium">Change Password</Label>
                    <p className="text-sm text-gray-600">Update your account password</p>
                  </div>
                  <Button variant="outline">
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <Label className="font-medium">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Not Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <Label className="font-medium">Active Sessions</Label>
                    <p className="text-sm text-gray-600">Manage your logged-in devices</p>
                  </div>
                  <Button variant="outline">View Sessions</Button>
                </div>
              </div>
              
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Delete Account</Label>
                        <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                      </div>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}