"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Loader2, 
  HeartPulse, 
  Eye, 
  EyeOff, 
  User, 
  Lock,
  Shield,
  Activity,
  Users,
  Stethoscope,
  Building,
  Database
} from "lucide-react"
import Link from "next/link"
import { useCustomSession } from "@/hooks/use-custom-session"

export default function SignIn() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useCustomSession()

  // Handle redirection when session is available
  useEffect(() => {
    console.log('User:', user, 'Loading:', loading)
    if (user && user.role && !loading) {
      console.log('Redirecting user with role:', user.role)
      // Always redirect to the unified dashboard - it will handle role-specific content
      const redirectUrl = '/dashboard'
      
      // Add a small delay to ensure cookie is set
      setTimeout(() => {
        router.push(redirectUrl)
      }, 100)
    }
  }, [user, loading, router])

  // Check for callback URL from search params
  useEffect(() => {
    const callbackUrl = searchParams.get('callbackUrl')
    if (callbackUrl && user && !loading) {
      router.push(callbackUrl)
    }
  }, [user, loading, searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    console.log('Submitting sign-in form for:', identifier)

    try {
      // Use NextAuth's built-in signIn function
      const result = await signIn('credentials', {
        identifier: identifier,
        password: password,
        redirect: false, // We'll handle redirect manually
      })

      console.log('NextAuth sign-in result:', result)

      if (result?.error) {
        // Handle error
        console.log('Sign-in failed:', result.error)
        setError(result.error || 'Invalid credentials')
        setIsLoading(false)
      } else if (result?.ok) {
        // Success - NextAuth will handle the session creation
        console.log('Sign-in successful, waiting for session...')
        // The session hook will automatically detect the new session and redirect
        // We'll add a timeout in case something goes wrong
        setTimeout(() => {
          setIsLoading(false)
        }, 5000)
      } else {
        // Unexpected result
        console.log('Unexpected sign-in result:', result)
        setError('An unexpected error occurred')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  // Reset loading state if session check fails after timeout
  useEffect(() => {
    let timeout: NodeJS.Timeout
    
    if (isLoading) {
      timeout = setTimeout(() => {
        setIsLoading(false)
      }, 10000) // 10 second timeout
    }
    
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [isLoading])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex gap-8">
        {/* Left Side - Platform Info */}
        <div className="flex-1 hidden lg:flex flex-col justify-center space-y-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2ba664] to-[#238a52] rounded-lg flex items-center justify-center shadow-lg">
              <HeartPulse className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fitwell</h1>
              <p className="text-lg font-semibold text-[#2ba664]">H.E.A.L.T.H.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-[#2ba664]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-[#2ba664]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Secure Healthcare Platform</h3>
                <p className="text-gray-600">Advanced security measures to protect your medical data and ensure privacy compliance.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-[#2ba664]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-[#2ba664]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Multi-Role Access</h3>
                <p className="text-gray-600">Comprehensive access control for patients, doctors, administrators, and healthcare staff.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-[#2ba664]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Activity className="h-5 w-5 text-[#2ba664]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Real-time Monitoring</h3>
                <p className="text-gray-600">Live health data tracking and AI-powered insights for better patient care.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-[#2ba664]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="h-5 w-5 text-[#2ba664]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Integrated Records</h3>
                <p className="text-gray-600">Centralized medical records, appointments, and billing management system.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Card */}
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center space-x-3 mb-6 lg:hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2ba664] to-[#238a52] rounded-lg flex items-center justify-center shadow-lg">
              <HeartPulse className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Fitwell</h1>
              <p className="text-sm font-semibold text-[#2ba664]">H.E.A.L.T.H.</p>
            </div>
          </div>

          {/* Main Sign In Card */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="space-y-3 text-center pb-4">
              <CardTitle className="text-xl font-bold text-gray-900">Sign In</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Access your Fitwell H.E.A.L.T.H. account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50 py-2">
                    <AlertDescription className="text-sm text-red-700">{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-1">
                  <Label htmlFor="identifier" className="text-xs font-medium text-gray-700">
                    Email, Phone, NHR, or CNIC
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="Enter your email, phone, NHR, or CNIC"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      className="pl-8 text-sm border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664] h-9"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-medium text-gray-700">Password</Label>
                    <Link 
                      href="/auth/forgot-password" 
                      className="text-xs text-[#2ba664] hover:text-[#238a52] hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-8 pr-8 text-sm border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664] h-9"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="h-3 w-3"
                  />
                  <Label htmlFor="rememberMe" className="text-xs text-gray-600">Remember me</Label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#2ba664] to-[#238a52] hover:from-[#238a52] hover:to-[#1f7a47] text-white h-8 text-sm font-medium transition-all duration-200 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-3 border-t border-gray-200">
              <div className="text-center text-xs text-gray-600">
                Don't have an account?{" "}
                <Link 
                  href="/auth/signup" 
                  className="text-[#2ba664] hover:text-[#238a52] font-medium hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}