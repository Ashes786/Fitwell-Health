"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HeartPulse, ArrowLeft, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call for password reset
      // In a real application, this would send an email with a reset link
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSubmitted(true)
    } catch (error) {
      setError("Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and Branding */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[#2ba664] rounded-xl flex items-center justify-center">
                <HeartPulse className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Fitwell</h1>
              <p className="text-lg text-[#2ba664] font-semibold">H.E.A.L.T.H.</p>
            </div>
          </div>

          <Card className="border-gray-200 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#2ba664]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-[#2ba664]" />
                </div>
                <CardTitle className="text-xl text-gray-900 mb-2">Email Sent!</CardTitle>
                <CardDescription className="text-gray-600 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>. 
                  Please check your inbox and follow the instructions to reset your password.
                </CardDescription>
                <div className="space-y-3">
                  <Button 
                    onClick={() => router.push("/auth/signin")}
                    className="w-full bg-[#2ba664] hover:bg-[#238a52] text-white"
                  >
                    Return to Sign In
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSubmitted(false)}
                    className="w-full border-[#2ba664] text-[#2ba664] hover:bg-[#2ba664] hover:text-white"
                  >
                    Send to another email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Branding */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#2ba664] rounded-xl flex items-center justify-center">
              <HeartPulse className="h-10 w-10 text-white" />
            </div>
          </div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Fitwell</h1>
            <p className="text-lg text-[#2ba664] font-semibold">H.E.A.L.T.H.</p>
          </div>
        </div>

        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-gray-900">Forgot Password?</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 border-gray-300 focus:border-[#2ba664] focus:ring-[#2ba664]"
                  />
                </div>
              </div>
            </CardContent>
            <div className="px-6 pb-6 space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-[#2ba664] hover:bg-[#238a52] text-white" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
              
              <div className="text-center">
                <Link 
                  href="/auth/signin" 
                  className="inline-flex items-center text-[#2ba664] hover:text-[#238a52] hover:underline text-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          </form>
        </Card>

        {/* Demo Accounts Info */}
        <Card className="border-[#2ba664]/20 bg-[#2ba664]/5">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-[#2ba664] mb-3">Demo Accounts</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div>
                <span className="font-medium">Super Admin:</span> superadmin@fitwell.health / superadmin123
              </div>
              <div>
                <span className="font-medium">Admin:</span> admin@fitwell.health / admin123
              </div>
              <div>
                <span className="font-medium">Doctor:</span> sarah.johnson@fitwell.health / doctor123
              </div>
              <div>
                <span className="font-medium">Patient:</span> john.doe@fitwell.health / patient123
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}