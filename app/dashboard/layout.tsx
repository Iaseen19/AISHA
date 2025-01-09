'use client';

import { UserSwitcher } from "../../app/components/UserSwitcher";
import { RoleBasedLayout } from "../../app/components/RoleBasedLayout";
import { useSession } from "next-auth/react";
import { Icons } from "../../app/components/ui/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROLE_PERMISSIONS, type SessionUser } from "../../app/lib/auth-config";
import { Button } from "../../app/components/ui/button";

const roleBasedNavItems = {
  PATIENT: [
    { name: 'Overview', href: '/dashboard', icon: Icons.chart },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Icons.calendar },
    { name: 'Messages', href: '/dashboard/messages', icon: Icons.message },
    { name: 'Progress', href: '/dashboard/progress', icon: Icons.chart },
  ],
  THERAPIST: [
    { name: 'Overview', href: '/dashboard', icon: Icons.chart },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Icons.calendar },
    { name: 'Patients', href: '/dashboard/patients', icon: Icons.users },
    { name: 'Messages', href: '/dashboard/messages', icon: Icons.message },
    { name: 'Analytics', href: '/dashboard/analytics', icon: Icons.chart },
  ],
  ADMIN: [
    { name: 'Overview', href: '/dashboard', icon: Icons.chart },
    { name: 'Users', href: '/dashboard/users', icon: Icons.users },
    { name: 'Analytics', href: '/dashboard/analytics', icon: Icons.chart },
    { name: 'Settings', href: '/dashboard/settings', icon: Icons.settings },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user as SessionUser | undefined;

  const navItems = user ? roleBasedNavItems[user.role] : [];

  return (
    <RoleBasedLayout>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-background border-r p-4">
          <div className="space-y-4">
            <UserSwitcher />
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </RoleBasedLayout>
  );
} 