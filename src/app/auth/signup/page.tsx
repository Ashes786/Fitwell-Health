"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Calendar,
  Stethoscope,
  Users,
  Building,
  Shield,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Fingerprint,
  CreditCard,
  FileText,
  HeartPulse
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
    // Remove dashes and spaces from CNIC
    const cleanCnic = cnic.replace(/[-\s]/g, "")
    
    // Simple NHR generation: NHR + last 6 digits of CNIC + random 3 digits
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
        // Generate NHR number for patients
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
        // Prepare submission data
        const submitData = {
          ...formData,
          // Add NHR number for patients
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
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-emerald-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-16 w-16 text-emerald-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Account Created Successfully!
            </h2>
            {nhrNumber && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-sm text-emerald-700 font-medium">
                  Your NHR Number: <span className="font-bold">{nhrNumber}</span>
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  This number is tied to your CNIC and will be used for all health records.
                </p>
              </div>
            )}
            <p className="text-gray-600 text-center mb-6">
              Your account has been created. Please sign in to continue.
            </p>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 w-full"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #2ba664 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #2ba664 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Information */}
        <div className="space-y-8 text-center lg:text-left">
          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2ba664] to-[#238a52] rounded-xl flex items-center justify-center shadow-lg">
              <HeartPulse className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fitwell</h1>
              <p className="text-lg font-semibold text-[#2ba664]">H.E.A.L.T.H.</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Create Your Account
                <span className="block bg-gradient-to-r from-[#2ba664] to-[#238a52] bg-clip-text text-transparent mt-2">
                  Join Healthcare Excellence
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Experience comprehensive healthcare with NHR (National Health Record) integration. 
                Your CNIC will generate a unique NHR number for all your medical records.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
                <Fingerprint className="h-5 w-5 text-[#2ba664]" />
                <span className="text-sm font-medium text-gray-700">NHR Number Integration</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
                <CreditCard className="h-5 w-5 text-[#2ba664]" />
                <span className="text-sm font-medium text-gray-700">CNIC-based Identity</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
                <FileText className="h-5 w-5 text-[#2ba664]" />
                <span className="text-sm font-medium text-gray-700">Comprehensive Health Records</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="space-y-6">
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-4 text-center pb-6">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-gray-900">Sign Up</CardTitle>
                <CardDescription className="text-gray-600">
                  Create your Fitwell H.E.A.L.T.H. account
                </CardDescription>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#2ba664] to-[#238a52] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 2) * 100}%` }}
                ></div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.submit && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{errors.submit}</AlertDescription>
                  </Alert>
                )}

                {step === 1 && (
                  <>
                    {/* Role Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">I am a *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant={formData.role === UserRole.PATIENT ? "default" : "outline"}
                          className={`h-auto p-4 flex flex-col items-center space-y-2 ${formData.role === UserRole.PATIENT ? "bg-gradient-to-r from-[#2ba664] to-[#238a52] hover:from-[#238a52] hover:to-[#1f7a47]" : "border-[#2ba664]/30 hover:border-[#2ba664] hover:bg-[#2ba664]/5"}`}
                          onClick={() => updateFormData("role", UserRole.PATIENT)}
                        >
                          <User className="h-6 w-6" />
                          <span className="text-sm font-medium">Patient</span>
                        </Button>
                        <Button
                          type="button"
                          variant={formData.role === UserRole.DOCTOR ? "default" : "outline"}
                          className={`h-auto p-4 flex flex-col items-center space-y-2 ${formData.role === UserRole.DOCTOR ? "bg-gradient-to-r from-[#2ba664] to-[#238a52] hover:from-[#238a52] hover:to-[#1f7a47]" : "border-[#2ba664]/30 hover:border-[#2ba664] hover:bg-[#2ba664]/5"}`}
                          onClick={() => updateFormData("role", UserRole.DOCTOR)}
                        >
                          <Stethoscope className="h-6 w-6" />
                          <span className="text-sm font-medium">Doctor</span>
                        </Button>
                      </div>
                      {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            className={`pl-10 ${errors.firstName ? "border-red-500" : "border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]"}`}
                            value={formData.firstName}
                            onChange={(e) => updateFormData("firstName", e.target.value)}
                          />
                        </div>
                        {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            className={`pl-10 ${errors.lastName ? "border-red-500" : "border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]"}`}
                            value={formData.lastName}
                            onChange={(e) => updateFormData("lastName", e.target.value)}
                          />
                        </div>
                        {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john.doe@example.com"
                          className={`pl-10 ${errors.email ? "border-red-500" : "border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]"}`}
                          value={formData.email}
                          onChange={(e) => updateFormData("email", e.target.value)}
                        />
                      </div>
                      {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          className={`pl-10 ${errors.phone ? "border-red-500" : "border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]"}`}
                          value={formData.phone}
                          onChange={(e) => updateFormData("phone", e.target.value)}
                        />
                      </div>
                      {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                    </div>

                    {/* CNIC Number */}
                    {formData.role === UserRole.PATIENT && (
                      <div className="space-y-2">
                        <Label htmlFor="cnicNumber" className="text-sm font-medium text-gray-700 flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-[#2ba664]" />
                          CNIC Number *
                        </Label>
                        <div className="relative">
                          <Fingerprint className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="cnicNumber"
                            type="text"
                            placeholder="42101-1234567-1"
                            className={`pl-10 ${errors.cnicNumber ? "border-red-500" : "border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]"}`}
                            value={formData.cnicNumber || ""}
                            onChange={(e) => updateFormData("cnicNumber", e.target.value)}
                          />
                        </div>
                        {errors.cnicNumber && <p className="text-sm text-red-600">{errors.cnicNumber}</p>}
                        <p className="text-xs text-gray-500">
                          Format: XXXXX-XXXXXXX-X (e.g., 42101-1234567-1)
                        </p>
                      </div>
                    )}

                    {formData.role === UserRole.DOCTOR && (
                      <div className="space-y-2">
                        <Label htmlFor="cnicDoctorNumber" className="text-sm font-medium text-gray-700 flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-[#2ba664]" />
                          CNIC Number *
                        </Label>
                        <div className="relative">
                          <Fingerprint className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="cnicDoctorNumber"
                            type="text"
                            placeholder="42101-1234567-1"
                            className={`pl-10 ${errors.cnicDoctorNumber ? "border-red-500" : "border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]"}`}
                            value={formData.cnicDoctorNumber || ""}
                            onChange={(e) => updateFormData("cnicDoctorNumber", e.target.value)}
                          />
                        </div>
                        {errors.cnicDoctorNumber && <p className="text-sm text-red-600">{errors.cnicDoctorNumber}</p>}
                        <p className="text-xs text-gray-500">
                          Format: XXXXX-XXXXXXX-X (e.g., 42101-1234567-1)
                        </p>
                      </div>
                    )}

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`pl-10 pr-10 ${errors.password ? "border-red-500" : "border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]"}`}
                          value={formData.password}
                          onChange={(e) => updateFormData("password", e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : "border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]"}`}
                          value={formData.confirmPassword}
                          onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => updateFormData("agreeToTerms", checked)}
                      />
                      <label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-relaxed">
                        I agree to the{" "}
                        <a href="#" className="text-[#2ba664] hover:underline">Terms of Service</a>
                        {" "}and{" "}
                        <a href="#" className="text-[#2ba664] hover:underline">Privacy Policy</a>
                      </label>
                    </div>
                    {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}
                  </>
                )}

                {step === 2 && (
                  <>
                    {/* Patient Specific Fields */}
                    {formData.role === UserRole.PATIENT && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">Date of Birth *</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="dateOfBirth"
                                type="date"
                                className={`pl-10 ${errors.dateOfBirth ? "border-red-500" : "border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]"}`}
                                value={formData.dateOfBirth || ""}
                                onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                              />
                            </div>
                            {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender *</Label>
                            <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value as Gender)}>
                              <SelectTrigger className={`border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664] ${errors.gender ? "border-red-500" : ""}`}>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={Gender.MALE}>Male</SelectItem>
                                <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                                <SelectItem value={Gender.OTHER}>Other</SelectItem>
                                <SelectItem value={Gender.PREFER_NOT_TO_SAY}>Prefer not to say</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bloodGroup" className="text-sm font-medium text-gray-700">Blood Group</Label>
                          <Select value={formData.bloodGroup} onValueChange={(value) => updateFormData("bloodGroup", value)}>
                            <SelectTrigger className="border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]">
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

                        <div className="space-y-2">
                          <Label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700">Emergency Contact</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="emergencyContact"
                              type="tel"
                              placeholder="+1 (555) 987-6543"
                              className="pl-10 border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]"
                              value={formData.emergencyContact || ""}
                              onChange={(e) => updateFormData("emergencyContact", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Doctor Specific Fields */}
                    {formData.role === UserRole.DOCTOR && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="specialization" className="text-sm font-medium text-gray-700">Specialization *</Label>
                          <div className="relative">
                            <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="specialization"
                              type="text"
                              placeholder="Cardiology, General Practice, etc."
                              className={`pl-10 ${errors.specialization ? "border-red-500" : "border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]"}`}
                              value={formData.specialization || ""}
                              onChange={(e) => updateFormData("specialization", e.target.value)}
                            />
                          </div>
                          {errors.specialization && <p className="text-sm text-red-600">{errors.specialization}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="experience" className="text-sm font-medium text-gray-700">Experience (years) *</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="experience"
                                type="number"
                                min="0"
                                placeholder="5"
                                className={`pl-10 ${errors.experience ? "border-red-500" : "border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]"}`}
                                value={formData.experience || ""}
                                onChange={(e) => updateFormData("experience", parseInt(e.target.value))}
                              />
                            </div>
                            {errors.experience && <p className="text-sm text-red-600">{errors.experience}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="consultationFee" className="text-sm font-medium text-gray-700">Consultation Fee ($) *</Label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="consultationFee"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="50"
                                className={`pl-10 ${errors.consultationFee ? "border-red-500" : "border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]"}`}
                                value={formData.consultationFee || ""}
                                onChange={(e) => updateFormData("consultationFee", parseFloat(e.target.value))}
                              />
                            </div>
                            {errors.consultationFee && <p className="text-sm text-red-600">{errors.consultationFee}</p>}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="medicalLicense" className="text-sm font-medium text-gray-700">Medical License Number *</Label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="medicalLicense"
                              type="text"
                              placeholder="MD12345"
                              className={`pl-10 ${errors.medicalLicense ? "border-red-500" : "border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]"}`}
                              value={formData.medicalLicense || ""}
                              onChange={(e) => updateFormData("medicalLicense", e.target.value)}
                            />
                          </div>
                          {errors.medicalLicense && <p className="text-sm text-red-600">{errors.medicalLicense}</p>}
                        </div>
                      </div>
                    )}

                    {/* Address Fields */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address *</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="address"
                            type="text"
                            placeholder="123 Main Street"
                            className={`pl-10 ${errors.address ? "border-red-500" : "border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]"}`}
                            value={formData.address}
                            onChange={(e) => updateFormData("address", e.target.value)}
                          />
                        </div>
                        {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-sm font-medium text-gray-700">City *</Label>
                          <Input
                            id="city"
                            type="text"
                            placeholder="New York"
                            className={`border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664] ${errors.city ? "border-red-500" : ""}`}
                            value={formData.city}
                            onChange={(e) => updateFormData("city", e.target.value)}
                          />
                          {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
                          <Input
                            id="state"
                            type="text"
                            placeholder="NY"
                            className="border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]"
                            value={formData.state}
                            onChange={(e) => updateFormData("state", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country *</Label>
                          <Input
                            id="country"
                            type="text"
                            placeholder="United States"
                            className={`border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664] ${errors.country ? "border-red-500" : ""}`}
                            value={formData.country}
                            onChange={(e) => updateFormData("country", e.target.value)}
                          />
                          {errors.country && <p className="text-sm text-red-600">{errors.country}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">Postal Code</Label>
                          <Input
                            id="postalCode"
                            type="text"
                            placeholder="10001"
                            className="border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]"
                            value={formData.postalCode}
                            onChange={(e) => updateFormData("postalCode", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="flex space-x-4 pt-4">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      className="flex-1 border-[#2ba664] text-[#2ba664] hover:bg-[#2ba664] hover:text-white"
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className={`flex-1 bg-gradient-to-r from-[#2ba664] to-[#238a52] hover:from-[#238a52] hover:to-[#1f7a47] text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${step === 1 ? 'w-full' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {step === 1 ? 'Validating...' : 'Creating Account...'}
                      </>
                    ) : (
                      step === 1 ? 'Continue' : 'Create Account'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
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

          {/* NHR Information Card */}
          {step === 1 && formData.role === UserRole.PATIENT && (
            <Card className="border-[#2ba664]/20 bg-[#2ba664]/5">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-[#2ba664] mb-3 flex items-center">
                  <Fingerprint className="h-4 w-4 mr-2" />
                  NHR Information
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    Your CNIC will be used to generate a unique National Health Record (NHR) number that will be tied to your identity for all medical records.
                  </p>
                  <p className="text-xs text-gray-600">
                    The NHR number ensures your health records are securely linked to your national identity.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}