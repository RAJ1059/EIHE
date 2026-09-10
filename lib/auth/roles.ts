import type { LmsRole } from "@/types/lms";

export const ADMIN_ROLES: LmsRole[] = ["SUPER_ADMIN", "ADMIN", "INSTRUCTOR"];
export const MANAGEMENT_ROLES: LmsRole[] = ["SUPER_ADMIN", "ADMIN"];

export function isAdminRole(role: LmsRole): boolean {
  return ADMIN_ROLES.includes(role);
}

/** Where a user lands right after logging in, based on their role. */
export function homePathForRole(role: LmsRole): string {
  return isAdminRole(role) ? "/admin/dashboard" : "/student/dashboard";
}
