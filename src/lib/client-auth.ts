// Client-side authentication utilities
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Get the session from client-side storage
  const session = await getClientSession()
  
  if (!session?.user) {
    throw new Error('No session found')
  }
  
  // Add Authorization header
  const authOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for including cookies
  }
  
  const response = await fetch(url, authOptions)
  
  if (response.status === 401) {
    // Redirect to login if unauthorized
    window.location.href = '/auth/signin'
    throw new Error('Unauthorized')
  }
  
  return response
}

// Helper to get client-side session
async function getClientSession() {
  try {
    const response = await fetch('/api/auth/session', {
      credentials: 'include' // Important for including cookies
    })
    const session = await response.json()
    return session
  } catch (error) {
    console.error('Error getting client session:', error)
    return null
  }
}

// Simple auth check for client components
export async function isAuthenticated() {
  const session = await getClientSession()
  return !!session?.user
}

// Get current user from client side
export async function getCurrentUser() {
  const session = await getClientSession()
  return session?.user || null
}