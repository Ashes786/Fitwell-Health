import { UserRole } from "@prisma/client"

export type RolePermissions = {
  [key in UserRole]: string[]
}

export const rolePermissions: RolePermissions = {
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
    "view_ai_reports",
    "upload_health_records",
    "book_services",
    "book_lab_tests",
    "order_medicines",
    "book_emergency_services",
    "view_card_benefits",
    "view_card_transactions",
    "view_partners",
    "search_partners",
    "view_nearby_partners",
    "view_partner_reviews"
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
    "view_appointments",
    "manage_schedule",
    "manage_billing",
    "manage_payments"
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

export function hasPermission(userRole: UserRole, permission: string): boolean {
  return rolePermissions[userRole]?.includes(permission) || false
}

export function canAccessDashboard(userRole: UserRole): boolean {
  return Object.keys(rolePermissions).includes(userRole)
}

export function getDashboardRoute(userRole: UserRole): string {
  switch (userRole) {
    case "PATIENT":
      return "/dashboard/patient"
    case "DOCTOR":
      return "/dashboard/doctor"
    case "ATTENDANT":
      return "/dashboard/attendant"
    case "CONTROL_ROOM":
      return "/dashboard/control-room"
    case "ADMIN":
      return "/dashboard/admin"
    case "SUPER_ADMIN":
      return "/dashboard/super-admin"
    default:
      return "/dashboard"
  }
}