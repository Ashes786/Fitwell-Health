'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Info, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function AdminSubscriptionRequests() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/subscription-requests')
      if (response.ok) {
        const data = await response.json()
        setSubscriptionInfo(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: 'Failed to load subscription information'
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground">Manage your subscription plans</p>
        </div>
      </div>

      {/* Information Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-600" />
            <span>Subscription Process Updated</span>
          </CardTitle>
          <CardDescription>
            The subscription request process has been streamlined for better efficiency.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium">New Process</h4>
                <p className="text-sm text-muted-foreground">
                  Super-admins now create subscription plans directly and assign them to admins. 
                  This eliminates the need for subscription requests and speeds up the process.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Benefits</h4>
                <p className="text-sm text-muted-foreground">
                  • Faster subscription activation<br/>
                  • Direct communication with super-admin<br/>
                  • Simplified plan management
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Next Steps</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {subscriptionInfo?.message || 'Please contact your super-admin to manage your subscription plans.'}
              </p>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    // In a real app, this would open a contact modal or navigate to a contact page
                    toast({
        title: "Info",
        description: 'Please contact your super-admin directly for subscription management.'
      })
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Contact Super-Admin
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Navigate to subscription plans page if it exists
                    router.push('/dashboard/admin/subscription-plans')
                  }}
                >
                  View Available Plans
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Badge variant="outline">Updated</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">New Process</div>
            <p className="text-xs text-muted-foreground">
              Direct subscription management
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Required</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Contact Admin</div>
            <p className="text-xs text-muted-foreground">
              Reach out to your super-admin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Available</div>
            <p className="text-xs text-muted-foreground">
              Super-admin assistance ready
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Common questions about the new subscription process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">What happened to subscription requests?</h4>
              <p className="text-sm text-muted-foreground">
                Subscription requests have been replaced by direct subscription plan creation. 
                Super-admins can now create and assign plans directly without requiring approval.
              </p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">How do I get a subscription plan?</h4>
              <p className="text-sm text-muted-foreground">
                Contact your super-admin directly. They can create a subscription plan and assign it to your admin account immediately.
              </p>
            </div>
            
            <div className="border-l-4 border-amber-500 pl-4">
              <h4 className="font-medium">What about my existing subscription?</h4>
              <p className="text-sm text-muted-foreground">
                Your existing subscription remains active. Super-admins can manage and extend your subscription as needed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}