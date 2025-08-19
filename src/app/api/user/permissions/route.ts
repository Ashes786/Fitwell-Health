import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { UserRole } from "@prisma/client"

interface UserPermissions {
  role: UserRole
  permissions: string[]
  features: string[]
  subscriptions: string[]
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        admin: true,
        superAdmin: true,
        doctor: true,
        patient: true,
        attendant: true,
        controlRoom: true,
        userSubscriptions: {
          include: {
            subscriptionPlan: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Base role permissions
    const rolePermissions: Record<UserRole, string[]> = {
      PATIENT: [
        "view_own_profile",
        "view_own_appointments",
        "book_appointment",
        "view_own_health_records",
        "view_own_prescriptions",
        "view_own_lab_tests",
        "record_vitals",
        "view_health_card",
        "chat_with_doctor",
        "view_ai_reports"
      ],
      DOCTOR: [
        "view_own_profile",
        "view_appointments",
        "manage_appointments",
        "view_patient_records",
        "create_prescriptions",
        "order_lab_tests",
        "set_availability",
        "chat_with_patient",
        "view_earnings"
      ],
      ATTENDANT: [
        "view_own_profile",
        "register_patients",
        "manage_patients",
        "book_appointments",
        "view_patient_records",
        "view_appointments"
      ],
      CONTROL_ROOM: [
        "view_own_profile",
        "manage_gp_appointments",
        "assign_doctors",
        "monitor_appointments",
        "handle_escalations"
      ],
      ADMIN: [
        "view_own_profile",
        "manage_users",
        "manage_patients",
        "manage_doctors",
        "manage_attendants",
        "manage_control_room",
        "manage_subscriptions",
        "manage_organizations",
        "manage_partners",
        "view_analytics",
        "system_settings"
      ],
      SUPER_ADMIN: [
        "view_own_profile",
        "manage_admins",
        "manage_super_admin",
        "manage_all_users",
        "manage_all_subscriptions",
        "manage_features",
        "manage_system_status",
        "view_global_analytics",
        "system_configuration",
        "approve_subscription_requests",
        "manage_networks"
      ]
    }

    // Start with base role permissions
    let userPermissions = rolePermissions[user.role] || []

    // Add user-specific permissions from admin/super admin records
    if (user.admin?.permissions) {
      try {
        const adminPermissions = JSON.parse(user.admin.permissions)
        userPermissions = [...new Set([...userPermissions, ...adminPermissions])]
      } catch (error) {
        console.error("Error parsing admin permissions:", error)
      }
    }

    // Get user features from subscriptions
    const userFeatures = user.userSubscriptions
      .filter(sub => sub.isActive)
      .flatMap(sub => {
        try {
          const plan = sub.subscriptionPlan
          return plan.features ? JSON.parse(plan.features) : []
        } catch (error) {
          console.error("Error parsing subscription features:", error)
          return []
        }
      })

    // Get subscription names
    const userSubscriptions = user.userSubscriptions
      .filter(sub => sub.isActive)
      .map(sub => sub.subscriptionPlan.name)

    const response: UserPermissions = {
      role: user.role,
      permissions: userPermissions,
      features: userFeatures,
      subscriptions: userSubscriptions
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching user permissions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}