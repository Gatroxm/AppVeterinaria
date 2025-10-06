import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppointmentService } from '../../core/services/appointment.service';
import { PetService } from '../../core/services/pet.service';
import { Appointment } from '../../core/models/appointment.interface';
import { Pet } from '../../core/models/pet.interface';

@Component({
  selector: 'app-edit-appointment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-veterinary-light to-white py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-extrabold text-gray-900">Editar Cita</h1>
            <p class="mt-2 text-sm text-gray-600">Actualiza los detalles de la cita</p>
          </div>
          <button 
            routerLink="/appointments"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-veterinary-primary transition-colors duration-200">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Volver
          </button>
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

        <!-- Form -->
        <div *ngIf="appointmentForm && !loading" class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="bg-veterinary-primary px-6 py-4">
            <div class="flex items-center">
              <svg class="h-6 w-6 text-white mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
              <h2 class="text-xl font-bold text-white">Información de la Cita</h2>
            </div>
          </div>

          <div class="px-6 py-8">
            <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()" class="space-y-6">
              
              <!-- Mascota -->
              <div>
                <label for="pet" class="block text-sm font-medium text-gray-700 mb-2">
                  Mascota *
                </label>
                <select
                  id="pet"
                  formControlName="pet"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veterinary-primary focus:border-transparent transition-colors duration-200"
                  [class.border-red-500]="appointmentForm.get('pet')?.invalid && appointmentForm.get('pet')?.touched">
                  <option value="">Seleccionar mascota</option>
                  <option *ngFor="let pet of pets" [value]="pet._id">
                    {{ pet.name }} ({{ pet.species }})
                  </option>
                </select>
                <div class="mt-1 min-h-[20px]">
                  <p *ngIf="appointmentForm.get('pet')?.hasError('required') && appointmentForm.get('pet')?.touched"
                     class="text-sm text-red-600">
                    La mascota es obligatoria
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Fecha -->
                <div>
                  <label for="appointmentDate" class="block text-sm font-medium text-gray-700 mb-2">
                    Fecha *
                  </label>
                  <input
                    id="appointmentDate"
                    type="date"
                    formControlName="appointmentDate"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veterinary-primary focus:border-transparent transition-colors duration-200"
                    [class.border-red-500]="appointmentForm.get('appointmentDate')?.invalid && appointmentForm.get('appointmentDate')?.touched">
                  <div class="mt-1 min-h-[20px]">
                    <p *ngIf="appointmentForm.get('appointmentDate')?.hasError('required') && appointmentForm.get('appointmentDate')?.touched"
                       class="text-sm text-red-600">
                      La fecha es obligatoria
                    </p>
                  </div>
                </div>

                <!-- Hora -->
                <div>
                  <label for="time" class="block text-sm font-medium text-gray-700 mb-2">
                    Hora *
                  </label>
                  <input
                    id="time"
                    type="time"
                    formControlName="time"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veterinary-primary focus:border-transparent transition-colors duration-200"
                    [class.border-red-500]="appointmentForm.get('time')?.invalid && appointmentForm.get('time')?.touched">
                  <div class="mt-1 min-h-[20px]">
                    <p *ngIf="appointmentForm.get('time')?.hasError('required') && appointmentForm.get('time')?.touched"
                       class="text-sm text-red-600">
                      La hora es obligatoria
                    </p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Tipo de Servicio -->
                <div>
                  <label for="serviceType" class="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Servicio *
                  </label>
                  <select
                    id="serviceType"
                    formControlName="serviceType"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veterinary-primary focus:border-transparent transition-colors duration-200"
                    [class.border-red-500]="appointmentForm.get('serviceType')?.invalid && appointmentForm.get('serviceType')?.touched">
                    <option value="">Seleccionar servicio</option>
                    <option value="consultation">Consulta</option>
                    <option value="vaccination">Vacunación</option>
                    <option value="surgery">Cirugía</option>
                    <option value="checkup">Chequeo</option>
                    <option value="emergency">Emergencia</option>
                    <option value="grooming">Peluquería</option>
                  </select>
                  <div class="mt-1 min-h-[20px]">
                    <p *ngIf="appointmentForm.get('serviceType')?.hasError('required') && appointmentForm.get('serviceType')?.touched"
                       class="text-sm text-red-600">
                      El tipo de servicio es obligatorio
                    </p>
                  </div>
                </div>

                <!-- Estado -->
                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    id="status"
                    formControlName="status"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veterinary-primary focus:border-transparent transition-colors duration-200"
                    [class.border-red-500]="appointmentForm.get('status')?.invalid && appointmentForm.get('status')?.touched">
                    <option value="">Seleccionar estado</option>
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmada</option>
                    <option value="completed">Completada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                  <div class="mt-1 min-h-[20px]">
                    <p *ngIf="appointmentForm.get('status')?.hasError('required') && appointmentForm.get('status')?.touched"
                       class="text-sm text-red-600">
                      El estado es obligatorio
                    </p>
                  </div>
                </div>
              </div>

              <!-- Notas -->
              <div>
                <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
                  Notas adicionales
                </label>
                <textarea
                  id="notes"
                  formControlName="notes"
                  rows="4"
                  placeholder="Ingrese notas adicionales sobre la cita..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veterinary-primary focus:border-transparent transition-colors duration-200 resize-none"></textarea>
              </div>

              <!-- Botones -->
              <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  [disabled]="appointmentForm.invalid || submitting"
                  class="flex-1 flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-veterinary-primary hover:bg-veterinary-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-veterinary-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                  
                  <svg *ngIf="submitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  
                  <svg *ngIf="!submitting" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  
                  {{ submitting ? 'Guardando...' : 'Guardar Cambios' }}
                </button>
                
                <button
                  type="button"
                  routerLink="/appointments"
                  class="flex-1 flex justify-center items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
    
    .space-y-4 > * + * {
      margin-top: 1rem;
    }
    
    mat-form-field {
      width: 100%;
    }
  `]
})
export class EditAppointmentComponent implements OnInit {
  appointmentForm!: FormGroup;
  pets: Pet[] = [];
  appointment: Appointment | null = null;
  appointmentId: string = '';
  loading = true;
  submitting = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private petService: PetService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.appointmentId = id;
      this.loadPets();
      this.loadAppointment(id);
    } else {
      this.error = 'ID de cita no válido';
      this.loading = false;
    }
  }

  initializeForm(): void {
    this.appointmentForm = this.formBuilder.group({
      pet: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      time: ['', Validators.required],
      serviceType: ['', Validators.required],
      status: ['', Validators.required],
      notes: ['']
    });
  }

  loadPets(): void {
    this.petService.getPets().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.pets = response.data;
        }
      },
      error: (error: any) => {
        console.error('Error loading pets:', error);
      }
    });
  }

  loadAppointment(id: string): void {
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success && response.data) {
          this.appointment = response.data;
          this.populateForm(response.data);
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

  populateForm(appointment: Appointment): void {
    const appointmentDate = new Date(appointment.appointmentDate);
    const dateString = appointmentDate.toISOString().split('T')[0];
    const time = appointmentDate.toTimeString().substring(0, 5);
    
    this.appointmentForm.patchValue({
      pet: this.getPetId(appointment.pet),
      appointmentDate: dateString,
      time: time,
      serviceType: appointment.serviceType,
      status: appointment.status,
      notes: appointment.notes || ''
    });
  }

  getPetId(pet: any): string {
    if (typeof pet === 'string') {
      return pet;
    }
    return pet?._id || '';
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      this.submitting = true;
      
      const formValue = this.appointmentForm.value;
      
      // Combinar fecha y hora
      const appointmentDate = new Date(formValue.appointmentDate);
      const [hours, minutes] = formValue.time.split(':');
      appointmentDate.setHours(parseInt(hours), parseInt(minutes));

      const appointmentData = {
        pet: formValue.pet,
        appointmentDate: appointmentDate.toISOString(),
        serviceType: formValue.serviceType,
        status: formValue.status,
        notes: formValue.notes
      };

      this.appointmentService.updateAppointment(this.appointmentId, appointmentData).subscribe({
        next: (response: any) => {
          this.submitting = false;
          if (response.success) {
            this.router.navigate(['/appointments', this.appointmentId]);
          } else {
            this.error = response.message || 'Error al actualizar la cita';
          }
        },
        error: (error: any) => {
          this.submitting = false;
          this.error = 'Error al actualizar la cita';
          console.error('Error updating appointment:', error);
        }
      });
    }
  }
}