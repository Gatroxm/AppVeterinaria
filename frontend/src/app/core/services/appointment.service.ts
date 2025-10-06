import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Appointment, CreateAppointmentRequest } from '../models/appointment.interface';
import { ApiResponse } from '../models/user.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Sample data for development
  private sampleAppointments: Appointment[] = [
    {
      _id: '1',
      pet: '68e2fcbb7514c5b01020d533',
      owner: 'user123',
      veterinarian: 'vet456',
      appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // En 3 días
      serviceType: 'vaccination',
      status: 'confirmed',
      reason: 'Vacuna anual contra la rabia',
      notes: 'Revisar historial de alergias',
      price: 45.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '2',
      pet: '68e2fcbb7514c5b01020d533',
      owner: 'user123',
      veterinarian: 'vet789',
      appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // En 1 semana
      serviceType: 'vaccination',
      status: 'pending',
      reason: 'Vacuna múltiple (DHPP)',
      price: 65.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '3',
      pet: '68e2fcbb7514c5b01020d534',
      owner: 'user123',
      veterinarian: 'vet456',
      appointmentDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // En 2 semanas
      serviceType: 'checkup',
      status: 'confirmed',
      reason: 'Chequeo rutinario',
      price: 35.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '4',
      pet: '68e2fcbb7514c5b01020d535',
      owner: 'user123',
      veterinarian: 'vet789',
      appointmentDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // En 3 semanas
      serviceType: 'vaccination',
      status: 'pending',
      reason: 'Vacuna contra la leucemia felina',
      price: 55.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '5',
      pet: '68e2fcbb7514c5b01020d533',
      owner: 'user123',
      veterinarian: 'vet456',
      appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // En 2 días
      serviceType: 'consultation',
      status: 'pending',
      reason: 'Consulta por problemas digestivos',
      notes: 'Traer muestras de heces',
      price: 40.00,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  /**
   * Get appointments with optional filters
   */
  getAppointments(status?: string, page = 1, limit = 10): Observable<ApiResponse<Appointment[]>> {
    // For development, return sample data
    let filteredAppointments = this.sampleAppointments;
    
    if (status) {
      filteredAppointments = this.sampleAppointments.filter(apt => apt.status === status);
    }

    const response: ApiResponse<Appointment[]> = {
      success: true,
      message: 'Appointments retrieved successfully',
      data: filteredAppointments
    };

    return of(response);

    // Production code (commented out for development):
    // let params = new HttpParams()
    //   .set('page', page.toString())
    //   .set('limit', limit.toString());
    // 
    // if (status) {
    //   params = params.set('status', status);
    // }
    // 
    // return this.http.get<ApiResponse<Appointment[]>>(`${this.apiUrl}/appointments`, { params });
  }

  /**
   * Get appointment by ID
   */
  getAppointmentById(id: string): Observable<ApiResponse<Appointment>> {
    return this.http.get<ApiResponse<Appointment>>(`${this.apiUrl}/appointments/${id}`);
  }

  /**
   * Create new appointment
   */
  createAppointment(appointmentData: CreateAppointmentRequest): Observable<ApiResponse<Appointment>> {
    return this.http.post<ApiResponse<Appointment>>(`${this.apiUrl}/appointments`, appointmentData);
  }

  /**
   * Update appointment
   */
  updateAppointment(id: string, appointmentData: Partial<CreateAppointmentRequest>): Observable<ApiResponse<Appointment>> {
    return this.http.put<ApiResponse<Appointment>>(`${this.apiUrl}/appointments/${id}`, appointmentData);
  }

  /**
   * Cancel appointment
   */
  cancelAppointment(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/appointments/${id}`);
  }

  /**
   * Get available time slots for a specific date
   */
  getAvailableSlots(date: string, veterinarian?: string): Observable<ApiResponse<string[]>> {
    let params = new HttpParams().set('date', date);
    
    if (veterinarian) {
      params = params.set('veterinarian', veterinarian);
    }

    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/appointments/available-slots`, { params });
  }
}
