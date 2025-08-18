import { db } from './src/lib/db'

async function checkSubscriptionPlans() {
  try {
    const subscriptionPlans = await db.subscriptionPlan.findMany({
      include: {
        admin: {
          include: {
            user: true
          }
        },
        features: {
          include: {
            feature: true
          }
        }
      }
    })
    
    console.log('Subscription Plans:', JSON.stringify(subscriptionPlans, null, 2))
  } catch (error) {
    console.error('Error checking subscription plans:', error)
  }
}

checkSubscriptionPlans()