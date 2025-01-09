'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { hasPermission, DEFAULT_REDIRECT, ROLE_PERMISSIONS, UserRole, Permission } from '../lib/auth-config';
import { Icons } from './ui/icons';

interface RoleBasedLayoutProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
}

export function RoleBasedLayout({ children, requiredPermission }: RoleBasedLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (requiredPermission && !hasPermission(session.user, requiredPermission)) {
      router.push(DEFAULT_REDIRECT[session.user.role as UserRole]);
    }
  }, [session, status, router, requiredPermission]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Icons.loading className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!session || (requiredPermission && !hasPermission(session.user, requiredPermission))) {
    return null;
  }

  return <>{children}</>;
} 