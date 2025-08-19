"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Calendar,
  Stethoscope,
  Shield,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Fingerprint,
  CreditCard,
  FileText,
  HeartPulse,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { UserRole, Gender } from "@prisma/client"

interface FormData {
  // Common fields
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone: string
  role: UserRole
  agreeToTerms: boolean
  
  // Patient specific
  dateOfBirth?: string
  gender?: Gender
  bloodGroup?: string
  emergencyContact?: string
  cnicNumber?: string
  
  // Doctor specific
  specialization?: string
  experience?: number
  consultationFee?: number
  medicalLicense?: string
  cnicDoctorNumber?: string
  
  // Address
  address: string
  city: string
  state: string
  country: string
  postalCode: string
}

export default function SignUp() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [nhrNumber, setNhrNumber] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: UserRole.PATIENT,
    agreeToTerms: false,
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: ""
  })

  // Generate NHR number from CNIC
  const generateNHRNumber = (cnic: string): string => {
    const cleanCnic = cnic.replace(/[-\s]/g, "")
    const last6Digits = cleanCnic.slice(-6)
    const random3Digits = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `NHR-${last6Digits}${random3Digits}`
  }

  // Validate CNIC format (Pakistan CNIC: XXXXX-XXXXXXX-X)
  const validateCNIC = (cnic: string): boolean => {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/
    return cnicRegex.test(cnic)
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.role) newErrors.role = "Please select a role"
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions"
    
    // CNIC validation based on role
    if (formData.role === UserRole.PATIENT && !formData.cnicNumber) {
      newErrors.cnicNumber = "CNIC number is required for patients"
    } else if (formData.role === UserRole.PATIENT && formData.cnicNumber && !validateCNIC(formData.cnicNumber)) {
      newErrors.cnicNumber = "Invalid CNIC format. Use XXXXX-XXXXXXX-X format"
    }
    
    if (formData.role === UserRole.DOCTOR && !formData.cnicDoctorNumber) {
      newErrors.cnicDoctorNumber = "CNIC number is required for doctors"
    } else if (formData.role === UserRole.DOCTOR && formData.cnicDoctorNumber && !validateCNIC(formData.cnicDoctorNumber)) {
      newErrors.cnicDoctorNumber = "Invalid CNIC format. Use XXXXX-XXXXXXX-X format"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.country.trim()) newErrors.country = "Country is required"
    
    if (formData.role === UserRole.PATIENT) {
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
      if (!formData.gender) newErrors.gender = "Gender is required"
    }
    
    if (formData.role === UserRole.DOCTOR) {
      if (!formData.specialization) newErrors.specialization = "Specialization is required"
      if (!formData.experience) newErrors.experience = "Experience is required"
      if (!formData.consultationFee) newErrors.consultationFee = "Consultation fee is required"
      if (!formData.medicalLicense) newErrors.medicalLicense = "Medical license is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      if (validateStep1()) {
        if (formData.role === UserRole.PATIENT && formData.cnicNumber) {
          const generatedNhr = generateNHRNumber(formData.cnicNumber)
          setNhrNumber(generatedNhr)
        }
        setStep(2)
      }
      return
    }
    
    if (step === 2) {
      if (!validateStep2()) return
      
      setIsLoading(true)
      
      try {
        const submitData = {
          ...formData,
          ...(formData.role === UserRole.PATIENT && nhrNumber && { nhrNumber })
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData)
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setSuccess(true)
          } else {
            setErrors({ submit: data.error || 'Failed to create account' })
          }
        } else {
          const errorData = await response.json()
          setErrors({ submit: errorData.error || 'Failed to create account' })
        }
      } catch (error) {
        setErrors({ submit: 'Failed to create account. Please try again.' })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-emerald-200">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-12 w-12 text-emerald-600 mb-3" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Account Created Successfully!
            </h2>
            {nhrNumber && (
              <div className="mb-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                <p className="text-xs text-emerald-700 font-medium">
                  Your NHR Number: <span className="font-bold">{nhrNumber}</span>
                </p>
              </div>
            )}
            <p className="text-sm text-gray-600 text-center mb-4">
              Your account has been created. Please sign in to continue.
            </p>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 w-full h-8 text-sm"
              onClick={() => router.push("/auth/signin")}
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2ba664] to-[#238a52] rounded-lg flex items-center justify-center shadow-lg">
            <HeartPulse className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Fitwell</h1>
            <p className="text-sm font-semibold text-[#2ba664]">H.E.A.L.T.H.</p>
          </div>
        </div>

        {/* Sign Up Card */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="space-y-2 text-center pb-3">
            <CardTitle className="text-xl font-bold text-gray-900">Sign Up</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Create your Fitwell H.E.A.L.T.H. account
            </CardDescription>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-[#2ba664] to-[#238a52] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              ></div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              {errors.submit && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 py-2">
                  <AlertDescription className="text-sm text-red-700">{errors.submit}</AlertDescription>
                </Alert>
              )}

              {step === 1 && (
                <>
                  {/* Role Selection */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">I am a *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={formData.role === UserRole.PATIENT ? "default" : "outline"}
                        className={`h-auto p-3 flex flex-col items-center space-y-1 ${formData.role === UserRole.PATIENT ? "bg-gradient-to-r from-[#2ba664] to-[#238a52]" : "border-[#2ba664]/30"}`}
                        onClick={() => updateFormData("role", UserRole.PATIENT)}
                      >
                        <User className="h-4 w-4" />
                        <span className="text-xs font-medium">Patient</span>
                      </Button>
                      <Button
                        type="button"
                        variant={formData.role === UserRole.DOCTOR ? "default" : "outline"}
                        className={`h-auto p-3 flex flex-col items-center space-y-1 ${formData.role === UserRole.DOCTOR ? "bg-gradient-to-r from-[#2ba664] to-[#238a52]" : "border-[#2ba664]/30"}`}
                        onClick={() => updateFormData("role", UserRole.DOCTOR)}
                      >
                        <Stethoscope className="h-4 w-4" />
                        <span className="text-xs font-medium">Doctor</span>
                      </Button>
                    </div>
                    {errors.role && <p className="text-xs text-red-600">{errors.role}</p>}
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="firstName" className="text-xs font-medium text-gray-700">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className={`text-xs ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="lastName" className="text-xs font-medium text-gray-700">Last Name *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        className={`text-xs ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs font-medium text-gray-700">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className={`pl-7 text-xs ${errors.email ? "border-red-500" : "border-gray-300"}`}
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="password" className="text-xs font-medium text-gray-700">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`pl-7 pr-7 text-xs ${errors.password ? "border-red-500" : "border-gray-300"}`}
                          value={formData.password}
                          onChange={(e) => updateFormData("password", e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="confirmPassword" className="text-xs font-medium text-gray-700">Confirm *</Label>
                      <div className="relative">
                        <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`pl-7 pr-7 text-xs ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                          value={formData.confirmPassword}
                          onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-xs font-medium text-gray-700">Phone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        className={`pl-7 text-xs ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* CNIC */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">
                      CNIC {formData.role === UserRole.PATIENT ? "(Patient)*" : "(Doctor)*"}
                    </Label>
                    <div className="relative">
                      <Fingerprint className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="XXXXX-XXXXXXX-X"
                        className={`pl-7 text-xs ${formData.role === UserRole.PATIENT && errors.cnicNumber ? "border-red-500" : ""} ${formData.role === UserRole.DOCTOR && errors.cnicDoctorNumber ? "border-red-500" : ""} border-gray-300`}
                        value={formData.role === UserRole.PATIENT ? formData.cnicNumber || "" : formData.cnicDoctorNumber || ""}
                        onChange={(e) => {
                          if (formData.role === UserRole.PATIENT) {
                            updateFormData("cnicNumber", e.target.value)
                          } else {
                            updateFormData("cnicDoctorNumber", e.target.value)
                          }
                        }}
                      />
                    </div>
                    {(errors.cnicNumber || errors.cnicDoctorNumber) && (
                      <p className="text-xs text-red-600">{errors.cnicNumber || errors.cnicDoctorNumber}</p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => updateFormData("agreeToTerms", checked as boolean)}
                      className="h-3 w-3 mt-0.5"
                    />
                    <Label htmlFor="agreeToTerms" className="text-xs text-gray-600 leading-tight">
                      I agree to the Terms of Service and Privacy Policy *
                    </Label>
                  </div>
                  {errors.agreeToTerms && <p className="text-xs text-red-600">{errors.agreeToTerms}</p>}
                </>
              )}

              {step === 2 && (
                <>
                  {/* Address Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-gray-700">Address Information</Label>
                    </div>
                    
                    <div className="space-y-1">
                      <Input
                        placeholder="Street Address *"
                        className={`text-xs ${errors.address ? "border-red-500" : "border-gray-300"}`}
                        value={formData.address}
                        onChange={(e) => updateFormData("address", e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="City *"
                        className={`text-xs ${errors.city ? "border-red-500" : "border-gray-300"}`}
                        value={formData.city}
                        onChange={(e) => updateFormData("city", e.target.value)}
                      />
                      <Input
                        placeholder="State"
                        className="text-xs border-gray-300"
                        value={formData.state}
                        onChange={(e) => updateFormData("state", e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Country *"
                        className={`text-xs ${errors.country ? "border-red-500" : "border-gray-300"}`}
                        value={formData.country}
                        onChange={(e) => updateFormData("country", e.target.value)}
                      />
                      <Input
                        placeholder="Postal Code"
                        className="text-xs border-gray-300"
                        value={formData.postalCode}
                        onChange={(e) => updateFormData("postalCode", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Role Specific Fields */}
                  <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                    <CollapsibleTrigger asChild>
                      <Button type="button" variant="ghost" className="w-full justify-between p-2 h-auto">
                        <span className="text-xs font-medium text-gray-700">
                          {formData.role === UserRole.PATIENT ? "Patient Information" : "Doctor Information"}
                        </span>
                        <ChevronDown className={`h-3 w-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 mt-2">
                      {formData.role === UserRole.PATIENT && (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-700">Date of Birth *</Label>
                              <Input
                                type="date"
                                className={`text-xs ${errors.dateOfBirth ? "border-red-500" : "border-gray-300"}`}
                                value={formData.dateOfBirth || ""}
                                onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-700">Gender *</Label>
                              <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value as Gender)}>
                                <SelectTrigger className={`text-xs ${errors.gender ? "border-red-500" : "border-gray-300"}`}>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={Gender.MALE}>Male</SelectItem>
                                  <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                                  <SelectItem value={Gender.OTHER}>Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-700">Blood Group</Label>
                              <Select value={formData.bloodGroup} onValueChange={(value) => updateFormData("bloodGroup", value)}>
                                <SelectTrigger className="text-xs border-gray-300">
                                  <SelectValue placeholder="Select blood group" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="A+">A+</SelectItem>
                                  <SelectItem value="A-">A-</SelectItem>
                                  <SelectItem value="B+">B+</SelectItem>
                                  <SelectItem value="B-">B-</SelectItem>
                                  <SelectItem value="AB+">AB+</SelectItem>
                                  <SelectItem value="AB-">AB-</SelectItem>
                                  <SelectItem value="O+">O+</SelectItem>
                                  <SelectItem value="O-">O-</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-700">Emergency Contact</Label>
                              <Input
                                placeholder="Emergency contact"
                                className="text-xs border-gray-300"
                                value={formData.emergencyContact || ""}
                                onChange={(e) => updateFormData("emergencyContact", e.target.value)}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      
                      {formData.role === UserRole.DOCTOR && (
                        <>
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-gray-700">Specialization *</Label>
                            <Input
                              placeholder="e.g., Cardiology"
                              className={`text-xs ${errors.specialization ? "border-red-500" : "border-gray-300"}`}
                              value={formData.specialization || ""}
                              onChange={(e) => updateFormData("specialization", e.target.value)}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-700">Experience (years) *</Label>
                              <Input
                                type="number"
                                placeholder="5"
                                className={`text-xs ${errors.experience ? "border-red-500" : "border-gray-300"}`}
                                value={formData.experience || ""}
                                onChange={(e) => updateFormData("experience", parseInt(e.target.value) || 0)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-700">Consultation Fee *</Label>
                              <Input
                                type="number"
                                placeholder="100"
                                className={`text-xs ${errors.consultationFee ? "border-red-500" : "border-gray-300"}`}
                                value={formData.consultationFee || ""}
                                onChange={(e) => updateFormData("consultationFee", parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-gray-700">Medical License *</Label>
                            <Input
                              placeholder="License number"
                              className={`text-xs ${errors.medicalLicense ? "border-red-500" : "border-gray-300"}`}
                              value={formData.medicalLicense || ""}
                              onChange={(e) => updateFormData("medicalLicense", e.target.value)}
                            />
                          </div>
                        </>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-2 pt-2">
                {step === 2 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 h-8 text-xs"
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                )}
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-[#2ba664] to-[#238a52] hover:from-[#238a52] hover:to-[#1f7a47] text-white h-8 text-xs font-medium disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : step === 1 ? "Next" : "Create Account"}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="pt-3 border-t border-gray-200">
            <div className="text-center text-xs text-gray-600 w-full">
              Already have an account?{" "}
              <Link 
                href="/auth/signin" 
                className="text-[#2ba664] hover:text-[#238a52] font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}