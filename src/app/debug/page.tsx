'use client'

import { useSession } from "next-auth/react"

export default function DebugPage() {
  const { data: session, status } = useSession()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Session Information</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Session Status:</strong> {status}
        </div>
        
        <div>
          <strong>Session Data:</strong>
          <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        
        <div>
          <strong>User Role:</strong> {session?.user?.role || 'Not available'}
        </div>
        
        <div>
          <strong>User Email:</strong> {session?.user?.email || 'Not available'}
        </div>
        
        <div>
          <strong>User Name:</strong> {session?.user?.name || 'Not available'}
        </div>
      </div>
    </div>
  )
}