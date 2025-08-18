import { db } from './src/lib/db'

async function checkData() {
  try {
    // Check if there's a super admin
    const superAdmin = await db.superAdmin.findFirst({
      include: {
        user: true
      }
    })
    console.log('Super Admin:', superAdmin)

    // Check if there's an admin
    const admin = await db.admin.findFirst({
      include: {
        user: true
      }
    })
    console.log('Admin:', admin)

    // Check subscription requests
    const subscriptionRequests = await db.adminSubscriptionRequest.findMany({
      include: {
        admin: {
          include: {
            user: true
          }
        }
      }
    })
    console.log('Subscription Requests:', subscriptionRequests)

    // Check features
    const features = await db.feature.findMany()
    console.log('Features:', features)

  } catch (error) {
    console.error('Error checking data:', error)
  }
}

checkData()