"use client"

import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export function useCustomSignOut() {
  const router = useRouter()

  const signOutUser = async () => {
    try {
      // Use NextAuth's built-in signOut function with proper redirect
      // This will handle server-side session invalidation
      await signOut({ 
        redirect: true, // Let NextAuth handle the redirect
        callbackUrl: '/auth/signin'
      })
      
      // The code below will only run if redirect: false, but since we're using redirect: true,
      // the signOut function will handle the redirect automatically
      
    } catch (error) {
      console.error('Sign out error:', error)
      // Fallback: if there's an error, try to redirect manually
      window.location.href = '/auth/signin'
    }
  }

  return { signOut: signOutUser }
}