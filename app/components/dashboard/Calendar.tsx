'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';

interface Appointment {
  id: string;
  datetime: string;
  patient: {
    name: string;
  };
  type: string;
  status: string;
}

export default function Calendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const getDayAppointments = (date: Date) => {
    return appointments.filter(
      (apt) =>
        format(new Date(apt.datetime), 'yyyy-MM-dd') ===
        format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Calendar</h2>
      </div>

      <div className="rounded-md border p-4">
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          components={{
            DayContent: ({ date }: { date: Date }) => {
              const dayAppointments = getDayAppointments(date);
              return (
                <div className="relative w-full h-full">
                  <div>{format(date, 'd')}</div>
                  {dayAppointments.length > 0 && (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Badge
                          variant="secondary"
                          className="absolute bottom-0 right-0 -mb-1 -mr-1"
                        >
                          {dayAppointments.length}
                        </Badge>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">
                            Appointments for {format(date, 'PP')}
                          </h4>
                          {dayAppointments.map((apt) => (
                            <div
                              key={apt.id}
                              className="flex justify-between items-center text-sm"
                            >
                              <span>{apt.patient.name}</span>
                              <span>{format(new Date(apt.datetime), 'p')}</span>
                              <Badge variant="outline">{apt.type}</Badge>
                            </div>
                          ))}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </div>
              );
            },
          }}
        />
      </div>

      {selectedDate && (
        <div className="space-y-2">
          <h3 className="font-medium">
            Appointments for {format(selectedDate, 'PP')}
          </h3>
          <div className="space-y-2">
            {getDayAppointments(selectedDate).map((apt) => (
              <div
                key={apt.id}
                className="flex justify-between items-center p-2 rounded-md border"
              >
                <div>
                  <p className="font-medium">{apt.patient.name}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(apt.datetime), 'p')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{apt.type}</Badge>
                  <Badge
                    variant={
                      apt.status === 'scheduled' ? 'secondary' : 'default'
                    }
                  >
                    {apt.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 