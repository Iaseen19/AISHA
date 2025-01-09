'use client';

import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ROLE_PERMISSIONS, UserRoles, type UserRole, type SessionUser } from '../lib/auth-config';
import { useSession } from 'next-auth/react';
import { Icons } from './ui/icons';

const mockUsers: SessionUser[] = [
  { 
    id: '1', 
    name: 'Dr. Smith', 
    email: 'dr.smith@example.com', 
    role: UserRole.THERAPIST,
  },
  { 
    id: '2', 
    name: 'John Patient', 
    email: 'john@example.com', 
    role: UserRole.PATIENT,
  },
  { 
    id: '3', 
    name: 'Admin User', 
    email: 'admin@example.com', 
    role: UserRole.ADMIN,
  },
];

const roleIcons: Record<UserRole, typeof Icons[keyof typeof Icons]> = {
  PATIENT: Icons.user,
  THERAPIST: Icons.stethoscope,
  ADMIN: Icons.shield,
};

export function UserSwitcher() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [currentUser, setCurrentUser] = useState<SessionUser>(mockUsers[0]);

  useEffect(() => {
    if (session?.user) {
      setCurrentUser(session.user as SessionUser);
    }
  }, [session]);

  const handleUserSwitch = async (user: SessionUser) => {
    setCurrentUser(user);
    // In a real app, we would use the auth API to switch users
    // For demo purposes, we'll just update the session
    await update({
      ...session,
      user,
    });
    router.refresh();
  };

  const getRolePermissions = (role: UserRole) => {
    return Object.entries(ROLE_PERMISSIONS[role])
      .filter(([_, hasPermission]) => hasPermission)
      .map(([permission]) => permission.replace(/can|([A-Z])/g, ' $1').trim());
  };

  const Icon = roleIcons[currentUser.role];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2">
          {Icon && <Icon className="h-4 w-4" />}
          <span className="truncate">
            {currentUser.name}
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            {currentUser.role}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Switch User</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mockUsers.map((user) => {
          const Icon = roleIcons[user.role];
          return (
            <DropdownMenuItem
              key={user.id}
              onClick={() => handleUserSwitch(user)}
              className="flex items-center gap-2"
            >
              {Icon && <Icon className="h-4 w-4" />}
              <div className="flex flex-col">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {getRolePermissions(user.role).join(', ')}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 