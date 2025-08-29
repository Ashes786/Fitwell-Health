"use client"

import { useRouter } from 'next/navigation'

export function useCustomSignOut() {
  const router = useRouter()

  const signOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return { signOut }
}