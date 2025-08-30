'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function SignOutPage() {
  const router = useRouter()

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        // Use NextAuth's built-in signOut function
        await signOut({ 
          redirect: false,
          callbackUrl: '/auth/signin'
        })
        
        // Also call our API route for any additional cleanup
        await fetch('/api/auth/signout', { method: 'POST' })
        
        // Redirect to signin page
        router.push('/auth/signin')
      } catch (error) {
        console.error('Sign out error:', error)
        // Even if there's an error, try to redirect to signin
        router.push('/auth/signin')
      }
    }

    handleSignOut()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Signing out...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we sign you out safely.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </div>
  )
}