"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HeartPulse, ArrowLeft, Mail, CheckCircle, Shield, LockKeyhole, Clock } from "lucide-react"
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
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        setError(data.error || "Failed to send reset email. Please try again.")
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="w-full max-w-lg space-y-6">
          {/* Success Illustration */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Check Your Email</h1>
              <p className="text-lg text-gray-600">Password reset link sent successfully</p>
            </div>
          </div>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Sent!</h3>
                    <p className="text-gray-600 mb-4">
                      We've sent a password reset link to <span className="font-semibold text-green-600">{email}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-blue-900">Link expires in 15 minutes</p>
                      <p className="text-xs text-blue-700">For your security, the reset link will expire shortly</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-blue-900">Secure reset process</p>
                      <p className="text-xs text-blue-700">Your password will be safely updated</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => router.push("/auth/signin")}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 shadow-lg"
                  >
                    Return to Sign In
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSubmitted(false)}
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3"
                  >
                    Send to another email
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Didn't receive the email? Check your spam folder or 
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="text-green-600 hover:text-green-700 font-medium ml-1"
                    >
                      try again
                    </button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-lg space-y-6">
        {/* Logo and Branding */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <HeartPulse className="h-10 w-10 text-white" />
            </div>
          </div>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
            <p className="text-lg text-gray-600">No worries, we'll help you recover it</p>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center pb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <LockKeyhole className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Reset Your Password</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Enter your email address and we'll send you a secure link to reset your password
              </CardDescription>
            </div>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 px-8">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-12 pr-4 py-3 border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm rounded-lg"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  We'll send a password reset link to this email address
                </p>
              </div>
            </CardContent>
            
            <div className="px-8 pb-8 space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Reset Link...
                  </>
                ) : (
                  "Send Password Reset Link"
                )}
              </Button>
              
              <div className="text-center">
                <Link 
                  href="/auth/signin" 
                  className="inline-flex items-center text-green-600 hover:text-green-700 hover:underline text-sm font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          </form>
        </Card>

        {/* Security Note */}
        <Card className="border-0 shadow-sm bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-blue-900">Security Note</p>
                <p className="text-xs text-blue-700 mt-1">
                  For your protection, password reset links expire after 15 minutes and can only be used once. 
                  Never share your reset link with anyone.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}