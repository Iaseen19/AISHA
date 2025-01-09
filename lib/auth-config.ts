type UserRole = 'PATIENT' | 'THERAPIST' | 'ADMIN';

export const DEFAULT_REDIRECT = '/dashboard';

export const hasPermission = (userRole: UserRole | null, requiredRole: UserRole): boolean => {
  if (!userRole) return false;
  if (userRole === 'ADMIN') return true;
  return userRole === requiredRole;
}; 