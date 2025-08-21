"use client"

import { useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  HeartPulse, 
  Stethoscope, 
  Users, 
  Calendar, 
  Video, 
  Phone,
  FileText,
  Shield,
  ArrowRight,
  CheckCircle,
  FlaskConical,
  Pill
} from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  // Optimize session loading - reduce loading states
  const handleGetStarted = async () => {
    if (isNavigating) return
    
    setIsNavigating(true)
    
    try {
      if (session) {
        // Redirect based on user role
        const userRole = session.user.role
        let redirectUrl = '/dashboard'
        
        switch (userRole) {
          case 'SUPER_ADMIN':
            redirectUrl = '/dashboard/super-admin'
            break
          case 'ADMIN':
            redirectUrl = '/dashboard/admin'
            break
          case 'DOCTOR':
            redirectUrl = '/dashboard/doctor'
            break
          case 'PATIENT':
            redirectUrl = '/dashboard/patient'
            break
          case 'ATTENDANT':
            redirectUrl = '/dashboard/attendant'
            break
          case 'CONTROL_ROOM':
            redirectUrl = '/dashboard/control-room'
            break
          default:
            redirectUrl = '/dashboard'
        }
        
        router.push(redirectUrl)
      } else {
        router.push("/auth/signup")
      }
    } catch (error) {
      console.error('Navigation error:', error)
      setIsNavigating(false)
    }
  }

  const getDashboardRoute = (role: string) => {
    switch (role.toLowerCase()) {
      case 'patient':
        return '/dashboard/patient'
      case 'doctor':
        return '/dashboard/doctor'
      case 'partner':
        return '/dashboard/partner'
      case 'admin':
        return '/dashboard/admin'
      default:
        return '/dashboard'
    }
  }

  const handleSignOut = async () => {
    if (isNavigating) return
    
    setIsNavigating(true)
    
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Sign out error:', error)
      setIsNavigating(false)
    }
  }

  // Optimize header rendering - reduce loading states
  const renderAuthButtons = () => {
    if (status === "loading") {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      )
    }

    if (session) {
      return (
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => {
              // Redirect based on user role
              const userRole = session.user.role
              let redirectUrl = '/dashboard'
              
              switch (userRole) {
                case 'SUPER_ADMIN':
                  redirectUrl = '/dashboard/super-admin'
                  break
                case 'ADMIN':
                  redirectUrl = '/dashboard/admin'
                  break
                case 'DOCTOR':
                  redirectUrl = '/dashboard/doctor'
                  break
                case 'PATIENT':
                  redirectUrl = '/dashboard/patient'
                  break
                case 'ATTENDANT':
                  redirectUrl = '/dashboard/attendant'
                  break
                case 'CONTROL_ROOM':
                  redirectUrl = '/dashboard/control-room'
                  break
                default:
                  redirectUrl = '/dashboard'
              }
              
              router.push(redirectUrl)
            }} 
            className="bg-[#2ba664] hover:bg-[#238a52] text-white transition-colors duration-200 text-sm px-4 py-2"
            disabled={isNavigating}
          >
            {isNavigating ? "Loading..." : "Go to Dashboard"}
          </Button>
          <Button 
            onClick={handleSignOut} 
            variant="outline" 
            className="border-[#2ba664] text-[#2ba664] hover:bg-[#2ba664] hover:text-white transition-colors duration-200 text-sm px-4 py-2"
            disabled={isNavigating}
          >
            {isNavigating ? "Loading..." : "Log Out"}
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center space-x-2">
        <Button 
          onClick={() => router.push("/auth/signup")} 
          className="bg-[#2ba664] hover:bg-[#238a52] text-white transition-colors duration-200 text-sm px-4 py-2"
          disabled={isNavigating}
        >
          {isNavigating ? "Loading..." : "Sign Up"}
        </Button>
        <Button 
          onClick={() => router.push("/auth/signin")} 
          variant="outline" 
          className="border-[#2ba664] text-[#2ba664] hover:bg-[#2ba664] hover:text-white transition-colors duration-200 text-sm px-4 py-2"
          disabled={isNavigating}
        >
          {isNavigating ? "Loading..." : "Sign In"}
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#2ba664] rounded-lg flex items-center justify-center">
                <HeartPulse className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold text-gray-900">Fitwell</span>
                <span className="text-base sm:text-lg font-semibold text-[#2ba664] ml-1">H.E.A.L.T.H.</span>
              </div>
            </div>
            {renderAuthButtons()}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] bg-gradient-to-br from-[#f8fffc] via-white to-[#f0fdf4] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #2ba664 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, #2ba664 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center py-12 sm:py-16 md:py-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#2ba664]/20 rounded-full">
                <div className="w-2 h-2 bg-[#2ba664] rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-[#2ba664]">Comprehensive Healthcare Platform</span>
              </div>
            </div>
            
            {/* Main Heading */}
            <div className="mb-8 sm:mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight tracking-tight">
                <span className="block">Welcome to</span>
                <span className="block bg-gradient-to-r from-[#2ba664] to-[#238a52] bg-clip-text text-transparent mt-2">
                  Fitwell H.E.A.L.T.H.
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-normal max-w-3xl mx-auto leading-relaxed px-4">
                Healthcare Excellence & Advanced Longevity Through Health
              </p>
            </div>
            
            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4 font-medium">
              Experience the future of healthcare with our integrated platform featuring 
              <span className="text-[#2ba664] font-semibold"> telemedicine</span>, 
              <span className="text-[#2ba664] font-semibold"> electronic health records</span>, and 
              <span className="text-[#2ba664] font-semibold"> AI-powered wellness solutions</span>.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-[#2ba664] hover:bg-[#238a52] text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md"
                disabled={isNavigating}
              >
                {isNavigating ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Get Started</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-[#2ba664] text-[#2ba664] hover:bg-[#2ba664] hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-white/80 backdrop-blur-sm"
              >
                <span>Watch Demo</span>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#2ba664]" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#2ba664]" />
                <span>10,000+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-[#2ba664]" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 sm:h-20 md:h-24">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose Fitwell H.E.A.L.T.H.?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Everything you need for modern healthcare delivery in one integrated platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4">
            <Card className="text-center border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#2ba664]">
              <CardHeader>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#2ba664]/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Video className="h-6 w-6 sm:h-8 sm:w-8 text-[#2ba664]" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Video Consultations</CardTitle>
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  High-quality video calls with healthcare professionals from anywhere.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#2ba664]">
              <CardHeader>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#2ba664]/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-[#2ba664]" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Easy Booking</CardTitle>
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  Simple appointment scheduling with real-time availability updates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#2ba664]">
              <CardHeader>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#2ba664]/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-[#2ba664]" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Electronic Records</CardTitle>
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  Secure EHR system with comprehensive health data management.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#2ba664]">
              <CardHeader>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#2ba664]/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <HeartPulse className="h-6 w-6 sm:h-8 sm:w-8 text-[#2ba664]" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Health Monitoring</CardTitle>
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  Track vitals and health metrics with AI-powered insights.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#2ba664]">
              <CardHeader>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#2ba664]/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-[#2ba664]" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Health Card</CardTitle>
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  Digital health card with exclusive discounts and benefits.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#2ba664]">
              <CardHeader>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#2ba664]/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-[#2ba664]" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Multi-Role Support</CardTitle>
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  Dedicated interfaces for patients, doctors, and partners.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#f8fffc] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Platform for Everyone
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Tailored experiences for every role in the healthcare ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4">
            <Card className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#2ba664]">
              <CardHeader>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2ba664]/10 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-[#2ba664]" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">For Patients</CardTitle>
                </div>
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  Comprehensive healthcare management with appointment booking, 
                  video consultations, health records, and AI-powered health insights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <li className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#2ba664]" />
                    Easy appointment scheduling
                  </li>
                  <li className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#2ba664]" />
                    Video and phone consultations
                  </li>
                  <li className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#2ba664]" />
                    Electronic health records
                  </li>
                  <li className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#2ba664]" />
                    Digital health card with discounts
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#2ba664]">
              <CardHeader>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2ba664]/10 rounded-lg flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-[#2ba664]" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">For Doctors</CardTitle>
                </div>
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  Streamlined practice management with appointment scheduling, 
                  patient records, prescriptions, and telemedicine capabilities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <li className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#2ba664]" />
                    Appointment management
                  </li>
                  <li className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#2ba664]" />
                    Patient record access
                  </li>
                  <li className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#2ba664]" />
                    Prescription management
                  </li>
                  <li className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#2ba664]" />
                    Earnings tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#2ba664]">
              <CardHeader>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2ba664]/10 rounded-lg flex items-center justify-center">
                    <FlaskConical className="h-5 w-5 sm:h-6 sm:w-6 text-[#2ba664]" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">For Labs</CardTitle>
                </div>
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  Laboratory management system with test ordering, 
                  result reporting, and integration with healthcare providers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <li className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#2ba664]" />
                    Test order management
                  </li>
                  <li className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#2ba664]" />
                    Digital result reporting
                  </li>
                  <li className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#2ba664]" />
                    Partner integration
                  </li>
                  <li className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#2ba664]" />
                    Health card discounts
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#2ba664]">
              <CardHeader>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2ba664]/10 rounded-lg flex items-center justify-center">
                    <Pill className="h-5 w-5 sm:h-6 sm:w-6 text-[#2ba664]" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">For Pharmacies</CardTitle>
                </div>
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  Pharmacy management with prescription processing, 
                  inventory management, and patient medication tracking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <li className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#2ba664]" />
                    Prescription processing
                  </li>
                  <li className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#2ba664]" />
                    Inventory management
                  </li>
                  <li className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#2ba664]" />
                    Patient medication tracking
                  </li>
                  <li className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#2ba664]" />
                    Health card integration
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#2ba664]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Ready to Transform Healthcare?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 px-4">
            Join thousands of healthcare professionals and patients already using Fitwell H.E.A.L.T.H.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={handleGetStarted}
            className="bg-white text-[#2ba664] hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isNavigating}
          >
            {isNavigating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#2ba664] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm sm:text-base">Loading...</span>
              </div>
            ) : (
              <>
                <span className="text-sm sm:text-base">Get Started Today</span>
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </>
            )}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 md:mb-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#2ba664] rounded-lg flex items-center justify-center">
                <HeartPulse className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-semibold">Fitwell</span>
                <span className="text-sm sm:text-base font-medium text-[#2ba664] ml-1">H.E.A.L.T.H.</span>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm sm:text-base">
                © 2024 Fitwell H.E.A.L.T.H. Platform. All rights reserved.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Healthcare Excellence & Advanced Longevity Through Health
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}