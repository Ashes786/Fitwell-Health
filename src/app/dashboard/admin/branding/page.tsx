'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Palette, 
  Upload, 
  Eye, 
  Save, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Building,
  Mail,
  Phone,
  Globe,
  Code
} from 'lucide-react'
import { useCustomSession } from '@/hooks/use-custom-session'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { toast } from 'sonner'

interface BrandingData {
  logo?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  companyName?: string
  tagline?: string
  website?: string
  supportEmail?: string
  supportPhone?: string
  customCSS?: string
}

export default function AdminBrandingPage() {
  const { user, loading } = useCustomSession()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [branding, setBranding] = useState<BrandingData>({})
  const [previewMode, setPreviewMode] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (user) {
      loadBranding()
    }
  }, [user])

  const loadBranding = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/branding')
      if (response.ok) {
        const data = await response.json()
        setBranding(data.branding || {})
      }
    } catch (error) {
      console.error('Error loading branding:', error)
      toast.error('Failed to load branding settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/branding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(branding),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(data.message || 'Branding updated successfully')
        setHasChanges(false)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update branding')
      }
    } catch (error) {
      console.error('Error saving branding:', error)
      toast.error('Failed to save branding settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof BrandingData, value: string) => {
    setBranding(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const resetToDefaults = () => {
    setBranding({
      logo: '/logo.svg',
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      accentColor: '#34d399',
      companyName: user?.name || 'Fitwell H.E.A.L.T.H.',
      tagline: 'Healthcare Excellence & Advanced Longevity Through Health',
      website: '',
      supportEmail: '',
      supportPhone: '',
      customCSS: ''
    })
    setHasChanges(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout 
      userRole={user.role} 
      userName={user.name || user.email} 
      userImage={user.image}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Palette className="h-8 w-8 text-emerald-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Network Branding</h1>
              <p className="text-gray-600 mt-2">
                Customize your healthcare network's branding and appearance
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <Eye className="mr-2 h-4 w-4" />
              {previewMode ? 'Edit Mode' : 'Preview'}
            </Button>
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="border-gray-600 text-gray-600 hover:bg-gray-50"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {hasChanges && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="flex items-center space-x-2 p-4">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-800">You have unsaved changes. Don't forget to save your branding settings.</p>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Branding Settings */}
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Palette className="mr-2 h-5 w-5 text-emerald-600" />
                  Brand Settings
                </CardTitle>
                <CardDescription>
                  Configure your network's visual identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="logo"
                      value={branding.logo || ''}
                      onChange={(e) => handleInputChange('logo', e.target.value)}
                      placeholder="/logo.svg"
                      className="border-emerald-200"
                      disabled={previewMode}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-emerald-600 text-emerald-600"
                      disabled={previewMode}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {branding.logo && (
                    <div className="flex items-center space-x-2 mt-2">
                      <img 
                        src={branding.logo} 
                        alt="Logo preview" 
                        className="w-12 h-12 object-contain border rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/logo.svg'
                        }}
                      />
                      <span className="text-sm text-gray-600">Logo preview</span>
                    </div>
                  )}
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={branding.companyName || ''}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Your Healthcare Network"
                    className="border-emerald-200"
                    disabled={previewMode}
                  />
                </div>

                {/* Tagline */}
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Textarea
                    id="tagline"
                    value={branding.tagline || ''}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    placeholder="Healthcare Excellence & Advanced Longevity Through Health"
                    className="border-emerald-200"
                    disabled={previewMode}
                    rows={2}
                  />
                </div>

                {/* Color Scheme */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        id="primaryColor"
                        value={branding.primaryColor || '#10b981'}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="w-10 h-10 rounded border border-emerald-200"
                        disabled={previewMode}
                      />
                      <Input
                        value={branding.primaryColor || '#10b981'}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="flex-1 border-emerald-200 text-xs"
                        disabled={previewMode}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        id="secondaryColor"
                        value={branding.secondaryColor || '#059669'}
                        onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                        className="w-10 h-10 rounded border border-emerald-200"
                        disabled={previewMode}
                      />
                      <Input
                        value={branding.secondaryColor || '#059669'}
                        onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                        className="flex-1 border-emerald-200 text-xs"
                        disabled={previewMode}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        id="accentColor"
                        value={branding.accentColor || '#34d399'}
                        onChange={(e) => handleInputChange('accentColor', e.target.value)}
                        className="w-10 h-10 rounded border border-emerald-200"
                        disabled={previewMode}
                      />
                      <Input
                        value={branding.accentColor || '#34d399'}
                        onChange={(e) => handleInputChange('accentColor', e.target.value)}
                        className="flex-1 border-emerald-200 text-xs"
                        disabled={previewMode}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Building className="mr-2 h-5 w-5 text-blue-600" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Set up contact details for your network
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <Input
                      id="website"
                      value={branding.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://your-network.com"
                      className="border-blue-200"
                      disabled={previewMode}
                    />
                  </div>
                </div>

                {/* Support Email */}
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <Input
                      id="supportEmail"
                      type="email"
                      value={branding.supportEmail || ''}
                      onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                      placeholder="support@your-network.com"
                      className="border-blue-200"
                      disabled={previewMode}
                    />
                  </div>
                </div>

                {/* Support Phone */}
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <Input
                      id="supportPhone"
                      value={branding.supportPhone || ''}
                      onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                      placeholder="+1-800-HEALTH"
                      className="border-blue-200"
                      disabled={previewMode}
                    />
                  </div>
                </div>

                {/* Custom CSS */}
                <div className="space-y-2">
                  <Label htmlFor="customCSS">Custom CSS</Label>
                  <div className="flex items-start space-x-2">
                    <Code className="h-4 w-4 text-gray-400 mt-1" />
                    <Textarea
                      id="customCSS"
                      value={branding.customCSS || ''}
                      onChange={(e) => handleInputChange('customCSS', e.target.value)}
                      placeholder="/* Add custom CSS here */"
                      className="border-blue-200 font-mono text-sm"
                      disabled={previewMode}
                      rows={4}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Add custom CSS to further customize the appearance
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Live Preview */}
        {branding && (
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Eye className="mr-2 h-5 w-5 text-purple-600" />
                Live Preview
              </CardTitle>
              <CardDescription>
                See how your branding will look to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="p-6 rounded-lg border-2 border-dashed"
                style={{
                  backgroundColor: `${branding.primaryColor}10`,
                  borderColor: branding.primaryColor || '#10b981'
                }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  {branding.logo ? (
                    <img 
                      src={branding.logo} 
                      alt="Logo" 
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/logo.svg'
                      }}
                    />
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: branding.primaryColor || '#10b981' }}
                    >
                      <ImageIcon className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 
                      className="text-xl font-bold"
                      style={{ color: branding.primaryColor || '#10b981' }}
                    >
                      {branding.companyName || 'Your Healthcare Network'}
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: branding.secondaryColor || '#059669' }}
                    >
                      {branding.tagline || 'Healthcare Excellence & Advanced Longevity Through Health'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {branding.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" style={{ color: branding.accentColor }} />
                      <a href={branding.website} className="hover:underline" style={{ color: branding.primaryColor }}>
                        {branding.website}
                      </a>
                    </div>
                  )}
                  {branding.supportEmail && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" style={{ color: branding.accentColor }} />
                      <span style={{ color: branding.secondaryColor }}>
                        {branding.supportEmail}
                      </span>
                    </div>
                  )}
                  {branding.supportPhone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" style={{ color: branding.accentColor }} />
                      <span style={{ color: branding.secondaryColor }}>
                        {branding.supportPhone}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex space-x-2">
                  <Badge 
                    className="text-white"
                    style={{ backgroundColor: branding.primaryColor || '#10b981' }}
                  >
                    Primary Brand
                  </Badge>
                  <Badge 
                    variant="outline"
                    style={{ 
                      borderColor: branding.secondaryColor || '#059669',
                      color: branding.secondaryColor || '#059669'
                    }}
                  >
                    Secondary
                  </Badge>
                  <Badge 
                    variant="secondary"
                    style={{ 
                      backgroundColor: `${branding.accentColor}20`,
                      color: branding.accentColor || '#34d399'
                    }}
                  >
                    Accent
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}