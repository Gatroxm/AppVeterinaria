export interface Appointment {
  _id: string;
  pet: string;
  owner: string;
  veterinarian?: string;
  appointmentDate: Date;
  serviceType: 'consultation' | 'vaccination' | 'surgery' | 'checkup' | 'emergency' | 'grooming';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason?: string;
  notes?: string;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAppointmentRequest {
  pet: string;
  appointmentDate: string;
  serviceType: 'consultation' | 'vaccination' | 'surgery' | 'checkup' | 'emergency' | 'grooming';
  reason?: string;
}