'use client';

import { format } from 'date-fns';
import { Icons } from '../ui/icons';
import { type SessionUser } from '../../lib/auth-config';

interface Appointment {
  id: string;
  datetime: string;
  type: string;
  status: string;
  patient: SessionUser;
  therapist: {
    user: SessionUser;
  };
}

export default function AppointmentList() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
      <div className="divide-y rounded-md border">
        {/* Appointments will be rendered here */}
      </div>
    </div>
  );
} 