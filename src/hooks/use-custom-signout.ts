"use client"

import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export function useCustomSignOut() {
  const router = useRouter()

  const signOutUser = async () => {
    try {
      // Use NextAuth's built-in signOut function with redirect to signin page
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

  return { signOut: signOutUser }
}