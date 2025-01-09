'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Patient {
  id: string;
  name: string;
  email: string;
  appointments: {
    datetime: string;
    status: string;
  }[];
  analyticsData: {
    moodScores: number[];
    progressMetrics: any[];
  }[];
}

export default function PatientList() {
  const { data: session } = useSession();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLastAppointment = (patient: Patient) => {
    if (patient.appointments.length === 0) return 'No appointments';
    const sortedAppointments = [...patient.appointments].sort(
      (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );
    return format(new Date(sortedAppointments[0].datetime), 'PP');
  };

  const getAverageMoodScore = (patient: Patient) => {
    if (patient.analyticsData.length === 0) return 'N/A';
    const allScores = patient.analyticsData.flatMap((data) => data.moodScores);
    const average =
      allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
    return average.toFixed(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Patient</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
            </DialogHeader>
            {/* Add patient form */}
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Last Appointment</TableHead>
              <TableHead>Avg. Mood Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{getLastAppointment(patient)}</TableCell>
                <TableCell>{getAverageMoodScore(patient)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      patient.appointments.some(
                        (apt) => apt.status === 'scheduled'
                      )
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {patient.appointments.some(
                      (apt) => apt.status === 'scheduled'
                    )
                      ? 'Active'
                      : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedPatient && (
        <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Patient Details - {selectedPatient.name}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="font-medium">Recent Appointments</h3>
                <div className="space-y-2">
                  {selectedPatient.appointments
                    .slice(0, 5)
                    .map((appointment, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 rounded-md border"
                      >
                        <span>
                          {format(new Date(appointment.datetime), 'PP p')}
                        </span>
                        <Badge variant="outline">{appointment.status}</Badge>
                      </div>
                    ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium">Progress Metrics</h3>
                <div className="space-y-2">
                  {selectedPatient.analyticsData.map((data, index) => (
                    <div
                      key={index}
                      className="p-2 rounded-md border"
                    >
                      <div className="flex justify-between items-center">
                        <span>Mood Score</span>
                        <span className="font-medium">
                          {data.moodScores[data.moodScores.length - 1]}
                        </span>
                      </div>
                      {/* Add more metrics visualization here */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 