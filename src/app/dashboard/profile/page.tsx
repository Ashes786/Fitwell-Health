'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  Camera,
  Key,
  Upload
} from 'lucide-react'
import { toast } from 'sonner'

interface UserProfile {
  name: string
  email: string
  phone?: string
  role: string
  image?: string
  bio?: string
  location?: string
  joinedAt: string
  lastLogin?: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    role: '',
    image: '',
    bio: '',
    location: '',
    joinedAt: '',
    lastLogin: ''
  })
  const [editedProfile, setEditedProfile] = useState<UserProfile>({ ...profile })

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Load profile data
    const loadProfile = async () => {
      try {
        // Simulate API call - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setProfile({
          name: session.user?.name || '',
          email: session.user?.email || '',
          phone: '',
          role: session.user?.role || '',
          image: session.user?.image || '',
          bio: 'System administrator with full access to all platform features and settings.',
          location: 'San Francisco, CA',
          joinedAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        })
        
        setEditedProfile({
          name: session.user?.name || '',
          email: session.user?.email || '',
          phone: '',
          role: session.user?.role || '',
          image: session.user?.image || '',
          bio: 'System administrator with full access to all platform features and settings.',
          location: 'San Francisco, CA',
          joinedAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        })
      } catch (error) {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [session, status])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProfile({ ...editedProfile })
      setEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        // Simulate photo upload - replace with actual upload logic
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Create a preview URL for the uploaded image
        const imageUrl = URL.createObjectURL(file)
        setEditedProfile(prev => ({ ...prev, image: imageUrl }))
        toast.success('Photo uploaded successfully')
      } catch (error) {
        toast.error('Failed to upload photo')
      }
    }
  }

  const handleChangePassword = () => {
    toast.success('Password change functionality would be implemented here')
  }

  const handleTwoFactorSetup = () => {
    toast.success('Two-factor authentication setup would be implemented here')
  }

  const handleCancel = () => {
    setEditedProfile({ ...profile })
    setEditing(false)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge className="bg-purple-100 text-purple-800">Super Admin</Badge>
      case 'ADMIN':
        return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>
      case 'DOCTOR':
        return <Badge className="bg-green-100 text-green-800">Doctor</Badge>
      case 'ATTENDANT':
        return <Badge className="bg-yellow-100 text-yellow-800">Attendant</Badge>
      case 'PATIENT':
        return <Badge className="bg-gray-100 text-gray-800">Patient</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const userInitials = profile.name 
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : profile.email?.[0]?.toUpperCase() || 'U'

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          </div>
          <div className="grid gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
            </div>
          </div>
          {!editing && (
            <Button onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid gap-6">
          {/* Profile Overview Card */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your basic account information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-3">
                    <AvatarImage src={profile.image} alt={profile.name} />
                    <AvatarFallback className="text-lg">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  {editing && (
                    <div className="flex flex-col items-center space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Change Photo
                      </label>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                      {editing ? (
                        <Input
                          id="name"
                          value={editedProfile.name}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-lg font-semibold text-gray-900">{profile.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                      {editing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <div className="flex items-center mt-1">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="text-gray-900">{profile.email}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                      {editing ? (
                        <Input
                          id="phone"
                          value={editedProfile.phone || ''}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <div className="flex items-center mt-1">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Role</Label>
                      <div className="flex items-center mt-1">
                        <Shield className="h-4 w-4 text-gray-400 mr-2" />
                        {getRoleBadge(profile.role)}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
                    {editing ? (
                      <Input
                        id="location"
                        value={editedProfile.location || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                        className="mt-1"
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-gray-900">{profile.location || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</Label>
                    {editing ? (
                      <Textarea
                        id="bio"
                        value={editedProfile.bio || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                        className="mt-1"
                        rows={3}
                      />
                    ) : (
                      <p className="mt-1 text-gray-700">{profile.bio || 'No bio provided'}</p>
                    )}
                  </div>
                  
                  {editing && (
                    <div className="flex items-center space-x-3 pt-4">
                      <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Details Card */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Account Details
              </CardTitle>
              <CardDescription>
                Your account activity and security information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Account Activity</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Member Since</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(profile.joinedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Last Login</span>
                      <span className="text-sm font-medium text-gray-900">
                        {profile.lastLogin ? formatDate(profile.lastLogin) : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Security</h4>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleChangePassword}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleTwoFactorSetup}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Two-Factor Authentication
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}