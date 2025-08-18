"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Loader2, 
  HeartPulse, 
  Eye, 
  EyeOff, 
  User, 
  Lock, 
  Mail,
  Shield,
  Smartphone,
  Fingerprint
} from "lucide-react"
import Link from "next/link"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [activeTab, setActiveTab] = useState("email")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        setIsLoading(false)
      } else {
        // Use window.location for faster redirect
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 500)
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const handleQuickLogin = async (role: string, credentials: { email: string; password: string }) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Quick login failed. Please try manual login.")
        setIsLoading(false)
      } else {
        // Use window.location for faster redirect
        setTimeout(() => {
          window.location.href = `/dashboard/${role.toLowerCase()}`
        }, 500)
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
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
        {/* Left Side - Branding and Information */}
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
                Welcome Back to
                <span className="block bg-gradient-to-r from-[#2ba664] to-[#238a52] bg-clip-text text-transparent mt-2">
                  Healthcare Excellence
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Access your personalized healthcare dashboard and manage your wellness journey with our comprehensive platform.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
                <Shield className="h-5 w-5 text-[#2ba664]" />
                <span className="text-sm font-medium text-gray-700">HIPAA Compliant Security</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
                <HeartPulse className="h-5 w-5 text-[#2ba664]" />
                <span className="text-sm font-medium text-gray-700">24/7 Health Monitoring</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
                <Smartphone className="h-5 w-5 text-[#2ba664]" />
                <span className="text-sm font-medium text-gray-700">Mobile Optimized</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="space-y-6">
          {/* Main Sign In Card */}
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-4 text-center pb-6">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-gray-900">Sign In</CardTitle>
                <CardDescription className="text-gray-600">
                  Access your Fitwell H.E.A.L.T.H. account
                </CardDescription>
              </div>
              
              {/* Quick Access Roles */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Quick Access</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-auto p-3 flex flex-col items-center space-y-1 border-[#2ba664]/30 hover:border-[#2ba664] hover:bg-[#2ba664]/5"
                    onClick={() => handleQuickLogin("PATIENT", { 
                      email: "john.doe@fitwell.health", 
                      password: "patient123" 
                    })}
                    disabled={isLoading}
                  >
                    <User className="h-4 w-4 text-[#2ba664]" />
                    <span className="text-xs font-medium text-gray-700">Patient</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-auto p-3 flex flex-col items-center space-y-1 border-[#2ba664]/30 hover:border-[#2ba664] hover:bg-[#2ba664]/5"
                    onClick={() => handleQuickLogin("DOCTOR", { 
                      email: "sarah.johnson@fitwell.health", 
                      password: "doctor123" 
                    })}
                    disabled={isLoading}
                  >
                    <HeartPulse className="h-4 w-4 text-[#2ba664]" />
                    <span className="text-xs font-medium text-gray-700">Doctor</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-auto p-3 flex flex-col items-center space-y-1 border-[#2ba664]/30 hover:border-[#2ba664] hover:bg-[#2ba664]/5"
                    onClick={() => handleQuickLogin("ADMIN", { 
                      email: "admin@fitwell.health", 
                      password: "admin123" 
                    })}
                    disabled={isLoading}
                  >
                    <Shield className="h-4 w-4 text-[#2ba664]" />
                    <span className="text-xs font-medium text-gray-700">Admin</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-auto p-3 flex flex-col items-center space-y-1 border-[#2ba664]/30 hover:border-[#2ba664] hover:bg-[#2ba664]/5"
                    onClick={() => handleQuickLogin("SUPER_ADMIN", { 
                      email: "superadmin@fitwell.health", 
                      password: "superadmin123" 
                    })}
                    disabled={isLoading}
                  >
                    <Fingerprint className="h-4 w-4 text-[#2ba664]" />
                    <span className="text-xs font-medium text-gray-700">Super Admin</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Sign In Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email" className="text-sm">Email</TabsTrigger>
                  <TabsTrigger value="phone" className="text-sm">Phone</TabsTrigger>
                </TabsList>
                
                <TabsContent value="email" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <Alert variant="destructive" className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10 border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664] h-11"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                        <Link 
                          href="/auth/forgot-password" 
                          className="text-sm text-[#2ba664] hover:text-[#238a52] hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="pl-10 pr-10 border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664] h-11"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <Label htmlFor="rememberMe" className="text-sm text-gray-600">Remember me for 30 days</Label>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-[#2ba664] to-[#238a52] hover:from-[#238a52] hover:to-[#1f7a47] text-white h-11 font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="phone" className="space-y-4">
                  <div className="text-center py-8">
                    <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Phone Sign In</h3>
                    <p className="text-gray-600 mb-4">Enter your phone number to receive a sign-in code</p>
                    <Button 
                      variant="outline" 
                      className="border-[#2ba664] text-[#2ba664] hover:bg-[#2ba664] hover:text-white"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link 
                  href="/auth/signup" 
                  className="text-[#2ba664] hover:text-[#238a52] font-medium hover:underline"
                >
                  Sign up now
                </Link>
              </div>
              
              <div className="text-center text-xs text-gray-500">
                By signing in, you agree to our{" "}
                <a href="#" className="text-[#2ba664] hover:underline">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="text-[#2ba664] hover:underline">Privacy Policy</a>
              </div>
            </CardFooter>
          </Card>

          {/* Demo Accounts Card */}
          <Card className="border-[#2ba664]/20 bg-[#2ba664]/5">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-[#2ba664] mb-3 flex items-center">
                <Fingerprint className="h-4 w-4 mr-2" />
                Demo Credentials
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Super Admin:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">superadmin123</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Admin:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">admin123</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Doctor:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">doctor123</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Patient:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">patient123</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}