"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Lock,
  Globe,
  Moon,
  Sun,
  Save,
  Upload
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Profile settings state
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    bio: '',
    dateOfBirth: '',
    gender: '',
    emergencyContact: '',
    emergencyPhone: ''
  })

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
    desktopNotifications: true
  })

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    dataSharing: false,
    twoFactorAuth: false,
    activityTracking: true
  })

  // Appearance settings state
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'en',
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false
  })

  const handleProfileSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Notification Settings Updated",
        description: "Your notification preferences have been saved.",
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

  const handlePrivacySave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Privacy Settings Updated",
        description: "Your privacy settings have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const userInitials = session?.user?.name 
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : session?.user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-health-dark">Settings</h1>
          <p className="text-health-muted mt-2">Manage your account settings and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session?.user?.image || ''} />
                  <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload Photo</span>
                  </Button>
                  <p className="text-xs text-health-muted">JPG, GIF or PNG. Max size of 5MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  placeholder="Enter your address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-4">Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContact"
                      value={profileData.emergencyContact}
                      onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                      placeholder="Enter emergency contact name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={profileData.emergencyPhone}
                      onChange={(e) => setProfileData({...profileData, emergencyPhone: e.target.value})}
                      placeholder="Enter emergency contact phone"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleProfileSave} disabled={isLoading} className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about different activities
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
                      <Mail className="h-4 w-4" />
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
                      <Lock className="h-4 w-4" />
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
                      <Globe className="h-4 w-4" />
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
                <h4 className="text-sm font-medium">Additional Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Marketing Emails</span>
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, marketingEmails: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sound Effects</span>
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

              <div className="flex justify-end">
                <Button onClick={handleNotificationSave} disabled={isLoading} className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacy & Security</span>
              </CardTitle>
              <CardDescription>
                Manage your privacy settings and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Profile Visibility</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Show Email Address</span>
                    <Switch
                      checked={privacySettings.showEmail}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, showEmail: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Show Phone Number</span>
                    <Switch
                      checked={privacySettings.showPhone}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, showPhone: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Allow Messages</span>
                    <Switch
                      checked={privacySettings.allowMessages}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, allowMessages: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Security</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Two-Factor Authentication</span>
                    <Switch
                      checked={privacySettings.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, twoFactorAuth: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Activity Tracking</span>
                    <Switch
                      checked={privacySettings.activityTracking}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, activityTracking: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Data & Storage</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Data Sharing</span>
                    <Switch
                      checked={privacySettings.dataSharing}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, dataSharing: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handlePrivacySave} disabled={isLoading} className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Appearance</span>
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Theme</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={appearanceSettings.theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'light'})}
                    className="flex items-center space-x-2"
                  >
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </Button>
                  <Button
                    variant={appearanceSettings.theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'dark'})}
                    className="flex items-center space-x-2"
                  >
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Language & Region</h4>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    value={appearanceSettings.language}
                    onChange={(e) => setAppearanceSettings({...appearanceSettings, language: e.target.value})}
                    className="w-full p-2 border border-health-primary/20 rounded-md"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Accessibility</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>High Contrast</span>
                    <Switch
                      checked={appearanceSettings.highContrast}
                      onCheckedChange={(checked) => 
                        setAppearanceSettings({...appearanceSettings, highContrast: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Reduced Motion</span>
                    <Switch
                      checked={appearanceSettings.reducedMotion}
                      onCheckedChange={(checked) => 
                        setAppearanceSettings({...appearanceSettings, reducedMotion: checked})
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}