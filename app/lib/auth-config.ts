export type UserRole = 'PATIENT' | 'THERAPIST' | 'ADMIN';
export const UserRoles = {
  PATIENT: 'PATIENT',
  THERAPIST: 'THERAPIST',
  ADMIN: 'ADMIN',
} as const;

export type Permission = 'view_appointments' | 'book_appointment' | 'view_profile' | 'view_patients' | 'manage_appointments' | 'view_analytics' | 'manage_users' | 'view_system' | 'manage_settings';

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: UserRole;
};

export const ROLE_PERMISSIONS = {
  PATIENT: ['view_appointments', 'book_appointment', 'view_profile'] as Permission[],
  THERAPIST: ['view_patients', 'manage_appointments', 'view_analytics'] as Permission[],
  ADMIN: ['manage_users', 'view_system', 'manage_settings'] as Permission[],
} satisfies Record<UserRole, Permission[]>;

export const DEFAULT_REDIRECT = {
  PATIENT: '/dashboard',
  THERAPIST: '/therapist/dashboard',
  ADMIN: '/admin/dashboard',
} as const;

export const hasPermission = (user: { role: UserRole }, requiredPermission: Permission): boolean => {
  if (!user?.role) return false;
  if (user.role === 'ADMIN') return true;
  return ROLE_PERMISSIONS[user.role].includes(requiredPermission);
}; 