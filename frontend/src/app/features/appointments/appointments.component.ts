import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { AppointmentService } from '../../core/services/appointment.service';
import { Appointment } from '../../core/models/appointment.interface';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatTableModule,
    MatToolbarModule,
    MatTabsModule
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent implements OnInit {
  allAppointments: Appointment[] = [];
  pendingAppointments: Appointment[] = [];
  upcomingAppointments: Appointment[] = [];
  pastAppointments: Appointment[] = [];
  loading = true;
  error = '';

  constructor(
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.appointmentService.getAppointments().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success && response.data) {
          this.allAppointments = response.data;
          this.categorizeAppointments();
        } else {
          this.error = 'No se pudieron cargar las citas';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Error al cargar las citas';
        console.error('Error loading appointments:', error);
      }
    });
  }

  categorizeAppointments(): void {
    const now = new Date();
    
    this.pendingAppointments = this.allAppointments.filter(apt => 
      apt.status === 'pending'
    );
    
    this.upcomingAppointments = this.allAppointments.filter(apt => 
      (apt.status === 'confirmed' || apt.status === 'pending') && 
      new Date(apt.appointmentDate) > now
    );
    
    this.pastAppointments = this.allAppointments.filter(apt => 
      new Date(apt.appointmentDate) <= now || apt.status === 'completed'
    );
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'confirmed':
        return 'primary';
      case 'pending':
        return 'accent';
      case 'cancelled':
        return 'warn';
      case 'completed':
        return 'primary';
      default:
        return 'primary';
    }
  }

  getStatusText(status: string): string {
    const statusMap: {[key: string]: string} = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
  }

  getServiceTypeText(serviceType: string): string {
    const serviceMap: {[key: string]: string} = {
      'consultation': 'Consulta',
      'vaccination': 'Vacunación',
      'surgery': 'Cirugía',
      'checkup': 'Chequeo',
      'emergency': 'Emergencia',
      'grooming': 'Peluquería'
    };
    return serviceMap[serviceType] || serviceType;
  }

  viewAppointment(appointment: Appointment): void {
    this.router.navigate(['/appointments', appointment._id]);
  }

  editAppointment(appointment: Appointment): void {
    this.router.navigate(['/appointments/edit', appointment._id]);
  }

  addNewAppointment(): void {
    this.router.navigate(['/appointments/new']);
  }

  isUpcoming(date: string): boolean {
    return new Date(date) > new Date();
  }

  getPetName(pet: any): string {
    if (typeof pet === 'string') {
      return pet; // Si es solo un ID
    } else if (pet && pet.name) {
      return pet.name; // Si es un objeto con nombre
    } else {
      return 'Mascota no especificada';
    }
  }
}