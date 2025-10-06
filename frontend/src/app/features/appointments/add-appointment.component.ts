import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppointmentService } from '../../core/services/appointment.service';
import { PetService } from '../../core/services/pet.service';
import { Pet } from '../../core/models/pet.interface';

@Component({
  selector: 'app-add-appointment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center py-4">
            <button 
              routerLink="/appointments"
              class="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors mr-4">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 class="text-xl font-semibold text-gray-900">Agendar Nueva Cita</h1>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <!-- Mascota -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Mascota <span class="text-red-500">*</span>
              </label>
              <select 
                formControlName="pet" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                [class.border-red-500]="appointmentForm.get('pet')?.invalid && appointmentForm.get('pet')?.touched">
                <option value="">Selecciona una mascota</option>
                <option *ngFor="let pet of pets" [value]="pet._id">
                  {{pet.name}} - {{pet.species | titlecase}}
                </option>
              </select>
              <div *ngIf="appointmentForm.get('pet')?.hasError('required') && appointmentForm.get('pet')?.touched" 
                   class="text-sm text-red-600 mt-1">
                Selecciona una mascota
              </div>
            </div>

            <!-- Tipo de servicio -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Tipo de servicio <span class="text-red-500">*</span>
              </label>
              <select 
                formControlName="serviceType" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                [class.border-red-500]="appointmentForm.get('serviceType')?.invalid && appointmentForm.get('serviceType')?.touched">
                <option value="">Selecciona un tipo de servicio</option>
                <option value="consultation">Consulta</option>
                <option value="vaccination">Vacunación</option>
                <option value="surgery">Cirugía</option>
                <option value="checkup">Chequeo</option>
                <option value="emergency">Emergencia</option>
                <option value="grooming">Peluquería</option>
              </select>
              <div *ngIf="appointmentForm.get('serviceType')?.hasError('required') && appointmentForm.get('serviceType')?.touched" 
                   class="text-sm text-red-600 mt-1">
                Selecciona un tipo de servicio
              </div>
            </div>

            <!-- Fecha y hora -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Fecha y hora <span class="text-red-500">*</span>
              </label>
              <input 
                type="datetime-local" 
                formControlName="appointmentDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                [class.border-red-500]="appointmentForm.get('appointmentDate')?.invalid && appointmentForm.get('appointmentDate')?.touched">
              <div *ngIf="appointmentForm.get('appointmentDate')?.hasError('required') && appointmentForm.get('appointmentDate')?.touched" 
                   class="text-sm text-red-600 mt-1">
                Selecciona fecha y hora
              </div>
            </div>

            <!-- Motivo -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Motivo de la cita
              </label>
              <textarea 
                formControlName="reason" 
                rows="3" 
                placeholder="Describe el motivo de la consulta"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"></textarea>
            </div>

            <!-- Notas -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Notas adicionales (opcional)
              </label>
              <textarea 
                formControlName="notes" 
                rows="2" 
                placeholder="Información adicional"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"></textarea>
            </div>

            <!-- Precio estimado -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Precio estimado
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 text-sm">$</span>
                </div>
                <input 
                  type="number" 
                  step="0.01" 
                  formControlName="price"
                  class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
              </div>
              <p class="text-xs text-gray-500 mt-1">Precio en pesos mexicanos</p>
            </div>

            <!-- Error message -->
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div class="flex">
                <svg class="w-5 h-5 text-red-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <div>
                  <strong class="font-medium">Error:</strong>
                  <span class="ml-1">{{errorMessage}}</span>
                </div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                routerLink="/appointments"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors">
                Cancelar
              </button>
              <button 
                type="submit" 
                [disabled]="appointmentForm.invalid || loading"
                class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center">
                <svg *ngIf="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{loading ? 'Agendando...' : 'Agendar Cita'}}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AddAppointmentComponent implements OnInit {
  appointmentForm: FormGroup;
  pets: Pet[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private petService: PetService,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      pet: ['', Validators.required],
      serviceType: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      reason: ['', Validators.required],
      notes: [''],
      price: ['']
    });
  }

  ngOnInit(): void {
    this.loadPets();
    this.setDefaultDate();
  }

  loadPets(): void {
    this.petService.getPets().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.pets = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading pets:', error);
        this.errorMessage = 'Error al cargar las mascotas';
      }
    });
  }

  setDefaultDate(): void {
    // Set default to tomorrow at 10:00 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    
    const formattedDate = tomorrow.toISOString().slice(0, 16);
    this.appointmentForm.patchValue({
      appointmentDate: formattedDate
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const appointmentData = {
        ...this.appointmentForm.value,
        appointmentDate: new Date(this.appointmentForm.value.appointmentDate)
      };

      this.appointmentService.createAppointment(appointmentData).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.router.navigate(['/appointments']);
          } else {
            this.errorMessage = 'Error al crear la cita';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Error al crear la cita';
          console.error('Error creating appointment:', error);
        }
      });
    }
  }
}