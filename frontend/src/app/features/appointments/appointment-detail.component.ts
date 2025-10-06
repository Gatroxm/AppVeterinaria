import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppointmentService } from '../../core/services/appointment.service';
import { Appointment } from '../../core/models/appointment.interface';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-veterinary-light to-white py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-extrabold text-gray-900">Detalle de Cita</h1>
            <p class="mt-2 text-sm text-gray-600">Información completa de la cita médica</p>
          </div>
          <div class="flex gap-3 mt-4 sm:mt-0">
            <button 
              [routerLink]="['/appointments/edit', appointmentId]"
              [disabled]="!appointment"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-veterinary-primary hover:bg-veterinary-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-veterinary-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Editar
            </button>
            <button 
              routerLink="/appointments"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Volver
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="flex justify-center py-16">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-veterinary-primary"></div>
        </div>

        <!-- Error -->
        <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <strong class="font-bold">Error:</strong>
          <span class="block sm:inline"> {{ error }}</span>
        </div>

        <!-- Content -->
        <div *ngIf="appointment && !loading" class="bg-white shadow-lg rounded-lg overflow-hidden">
          <!-- Header Card -->
          <div class="bg-veterinary-primary px-6 py-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <svg class="h-8 w-8 text-white mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
                <div>
                  <h2 class="text-xl font-bold text-white">Cita #{{ appointment._id.slice(-6) }}</h2>
                  <p class="text-veterinary-light text-sm">{{ formatDate(appointment.appointmentDate) }}</p>
                </div>
              </div>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    [ngClass]="getStatusBadgeClass(appointment.status)">
                {{ getStatusText(appointment.status) }}
              </span>
            </div>
          </div>

          <div class="px-6 py-8">
            <!-- Main Info Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <!-- Appointment Details -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-veterinary-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                  Información de la Cita
                </h3>
                <div class="space-y-4">
                  <div class="flex justify-between items-center py-2 border-b border-gray-200">
                    <span class="text-sm font-medium text-gray-600">Fecha:</span>
                    <span class="text-sm font-semibold text-gray-900">{{ formatDate(appointment.appointmentDate) }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-200">
                    <span class="text-sm font-medium text-gray-600">Hora:</span>
                    <span class="text-sm font-semibold text-gray-900">{{ formatTime(appointment.appointmentDate) }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-200">
                    <span class="text-sm font-medium text-gray-600">Tipo de Servicio:</span>
                    <span class="text-sm font-semibold text-gray-900">{{ getServiceTypeText(appointment.serviceType) }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-sm font-medium text-gray-600">Estado:</span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          [ngClass]="getStatusBadgeClass(appointment.status)">
                      {{ getStatusText(appointment.status) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Pet Details -->
              <div class="bg-blue-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19C3 20.11 3.89 21 5 21H11V19H5V3H13V9H21ZM16 10V12H14V16H12V12H10V10H12V8H14V10H16ZM20 14L18 12L16 14L18 16L20 14Z"/>
                  </svg>
                  Información de la Mascota
                </h3>
                <div class="space-y-4">
                  <div class="flex justify-between items-center py-2 border-b border-blue-200">
                    <span class="text-sm font-medium text-gray-600">Nombre:</span>
                    <span class="text-sm font-semibold text-gray-900">{{ getPetName(appointment.pet) }}</span>
                  </div>
                  <div class="text-center py-4">
                    <div class="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto">
                      <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19C3 20.11 3.89 21 5 21H11V19H5V3H13V9H21ZM16 10V12H14V16H12V12H10V10H12V8H14V10H16ZM20 14L18 12L16 14L18 16L20 14Z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes Section -->
            <div *ngIf="appointment.notes" class="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Notas Adicionales
              </h3>
              <p class="text-gray-700 leading-relaxed">{{ appointment.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
    
    .space-y-2 > * + * {
      margin-top: 0.5rem;
    }
    
    .space-y-3 > * + * {
      margin-top: 0.75rem;
    }
    
    .space-y-4 > * + * {
      margin-top: 1rem;
    }
    
    .space-y-6 > * + * {
      margin-top: 1.5rem;
    }
  `]
})
export class AppointmentDetailComponent implements OnInit {
  appointment: Appointment | null = null;
  appointmentId: string = '';
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.appointmentId = id;
      this.loadAppointment(id);
    } else {
      this.error = 'ID de cita no válido';
      this.loading = false;
    }
  }

  loadAppointment(id: string): void {
    this.loading = true;
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success && response.data) {
          this.appointment = response.data;
        } else {
          this.error = 'No se pudo cargar la cita';
        }
      },
      error: (error: any) => {
        this.loading = false;
        this.error = 'Error al cargar la cita';
        console.error('Error loading appointment:', error);
      }
    });
  }

  getPetName(pet: any): string {
    if (typeof pet === 'string') {
      return pet;
    }
    return pet?.name || 'Mascota no especificada';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}