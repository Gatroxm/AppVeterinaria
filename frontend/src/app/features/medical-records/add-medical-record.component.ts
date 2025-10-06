import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MedicalRecordService } from '../../core/services/medical-record.service';
import { PetService } from '../../core/services/pet.service';
import { MedicalRecord, Medication } from '../../core/models/medical-record.interface';
import { Pet } from '../../core/models/pet.interface';

@Component({
  selector: 'app-add-medical-record',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center py-4">
            <button 
              routerLink="/medical-records"
              class="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors mr-4">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Nueva Historia Clínica</h1>
              <p class="text-sm text-gray-600" *ngIf="selectedPet">{{selectedPet.name}} ({{selectedPet.species | titlecase}})</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <form [formGroup]="medicalRecordForm" (ngSubmit)="onSubmit()" class="space-y-6">
          
          <!-- Pet Selection & Basic Info -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Pet Selection -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">
                  Mascota <span class="text-red-500">*</span>
                </label>
                <select 
                  formControlName="petId" 
                  (change)="onPetChange()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  [class.border-red-500]="medicalRecordForm.get('petId')?.invalid && medicalRecordForm.get('petId')?.touched">
                  <option value="">Selecciona una mascota</option>
                  <option *ngFor="let pet of pets" [value]="pet._id">
                    {{pet.name}} - {{pet.species | titlecase}} ({{pet.breed}})
                  </option>
                </select>
                <div *ngIf="medicalRecordForm.get('petId')?.hasError('required') && medicalRecordForm.get('petId')?.touched" 
                     class="text-sm text-red-600 mt-1">
                  Selecciona una mascota
                </div>
              </div>

              <!-- Date -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">
                  Fecha de consulta <span class="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  formControlName="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  [class.border-red-500]="medicalRecordForm.get('date')?.invalid && medicalRecordForm.get('date')?.touched">
                <div *ngIf="medicalRecordForm.get('date')?.hasError('required') && medicalRecordForm.get('date')?.touched" 
                     class="text-sm text-red-600 mt-1">
                  Fecha es requerida
                </div>
              </div>

              <!-- Veterinarian -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">
                  Veterinario <span class="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  formControlName="veterinarian"
                  placeholder="Dr. Nombre Apellido"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  [class.border-red-500]="medicalRecordForm.get('veterinarian')?.invalid && medicalRecordForm.get('veterinarian')?.touched">
                <div *ngIf="medicalRecordForm.get('veterinarian')?.hasError('required') && medicalRecordForm.get('veterinarian')?.touched" 
                     class="text-sm text-red-600 mt-1">
                  Nombre del veterinario es requerido
                </div>
              </div>
            </div>
          </div>

          <!-- Clinical Information -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Información Clínica</h3>
            
            <!-- Reason -->
            <div class="space-y-1 mb-6">
              <label class="block text-sm font-medium text-gray-700">
                Motivo de la consulta <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                formControlName="reason"
                placeholder="Ej: Consulta de rutina, problemas digestivos, vacunación..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                [class.border-red-500]="medicalRecordForm.get('reason')?.invalid && medicalRecordForm.get('reason')?.touched">
              <div *ngIf="medicalRecordForm.get('reason')?.hasError('required') && medicalRecordForm.get('reason')?.touched" 
                   class="text-sm text-red-600 mt-1">
                Motivo de consulta es requerido
              </div>
            </div>

            <!-- Symptoms -->
            <div class="space-y-1 mb-6">
              <label class="block text-sm font-medium text-gray-700">
                Síntomas observados
              </label>
              <textarea 
                formControlName="symptoms" 
                rows="3" 
                placeholder="Describe los síntomas observados por el propietario o durante la consulta..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"></textarea>
            </div>

            <!-- Diagnosis -->
            <div class="space-y-1 mb-6">
              <label class="block text-sm font-medium text-gray-700">
                Diagnóstico <span class="text-red-500">*</span>
              </label>
              <textarea 
                formControlName="diagnosis" 
                rows="3" 
                placeholder="Diagnóstico clínico basado en la evaluación..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                [class.border-red-500]="medicalRecordForm.get('diagnosis')?.invalid && medicalRecordForm.get('diagnosis')?.touched"></textarea>
              <div *ngIf="medicalRecordForm.get('diagnosis')?.hasError('required') && medicalRecordForm.get('diagnosis')?.touched" 
                   class="text-sm text-red-600 mt-1">
                Diagnóstico es requerido
              </div>
            </div>

            <!-- Treatment -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Tratamiento <span class="text-red-500">*</span>
              </label>
              <textarea 
                formControlName="treatment" 
                rows="3" 
                placeholder="Tratamiento prescrito y recomendaciones..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                [class.border-red-500]="medicalRecordForm.get('treatment')?.invalid && medicalRecordForm.get('treatment')?.touched"></textarea>
              <div *ngIf="medicalRecordForm.get('treatment')?.hasError('required') && medicalRecordForm.get('treatment')?.touched" 
                   class="text-sm text-red-600 mt-1">
                Tratamiento es requerido
              </div>
            </div>
          </div>

          <!-- Vital Signs -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Signos Vitales</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">Peso (kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  formControlName="weight"
                  placeholder="25.5"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">Temperatura (°C)</label>
                <input 
                  type="number" 
                  step="0.1"
                  formControlName="temperature"
                  placeholder="38.5"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">Freq. cardíaca (bpm)</label>
                <input 
                  type="number"
                  formControlName="heartRate"
                  placeholder="90"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">Freq. respiratoria (rpm)</label>
                <input 
                  type="number"
                  formControlName="respiratoryRate"
                  placeholder="24"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
              </div>
            </div>
          </div>

          <!-- Medications -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">Medicamentos</h3>
              <button 
                type="button"
                (click)="addMedication()"
                class="inline-flex items-center px-3 py-2 border border-emerald-300 text-sm font-medium rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Agregar Medicamento
              </button>
            </div>
            
            <div formArrayName="medications" class="space-y-4">
              <div *ngFor="let medication of medications.controls; let i = index" 
                   [formGroupName]="i" 
                   class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                
                <div class="flex justify-between items-start mb-4">
                  <h4 class="font-medium text-gray-900">Medicamento {{i + 1}}</h4>
                  <button 
                    type="button"
                    (click)="removeMedication(i)"
                    class="text-red-500 hover:text-red-700 p-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700">Nombre *</label>
                    <input 
                      type="text" 
                      formControlName="name"
                      placeholder="Nombre del medicamento"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
                  </div>
                  
                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700">Dosis *</label>
                    <input 
                      type="text" 
                      formControlName="dosage"
                      placeholder="Ej: 1 tableta, 5mg/kg"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
                  </div>
                  
                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700">Frecuencia *</label>
                    <input 
                      type="text" 
                      formControlName="frequency"
                      placeholder="Ej: Cada 8 horas, 2 veces al día"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
                  </div>
                  
                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700">Duración *</label>
                    <input 
                      type="text" 
                      formControlName="duration"
                      placeholder="Ej: 7 días, 2 semanas"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
                  </div>
                </div>
                
                <div class="mt-4 space-y-1">
                  <label class="block text-sm font-medium text-gray-700">Instrucciones especiales</label>
                  <textarea 
                    formControlName="instructions" 
                    rows="2" 
                    placeholder="Instrucciones adicionales para la administración..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Observations and Next Appointment -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Observaciones y Seguimiento</h3>
            
            <div class="space-y-6">
              <!-- Observations -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">Observaciones adicionales</label>
                <textarea 
                  formControlName="observations" 
                  rows="4" 
                  placeholder="Observaciones generales, comportamiento de la mascota, recomendaciones para el propietario..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"></textarea>
              </div>

              <!-- Next Appointment -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">Próxima cita (opcional)</label>
                <input 
                  type="date" 
                  formControlName="nextAppointment"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
                <p class="text-xs text-gray-500 mt-1">Fecha sugerida para la próxima consulta o seguimiento</p>
              </div>
            </div>
          </div>

          <!-- Error/Success Messages -->
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

          <!-- Form Actions -->
          <div class="flex justify-end space-x-4 pt-6">
            <button 
              type="button" 
              routerLink="/medical-records"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors">
              Cancelar
            </button>
            <button 
              type="submit" 
              [disabled]="medicalRecordForm.invalid || loading"
              class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center">
              <svg *ngIf="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{loading ? 'Guardando...' : 'Guardar Historia Clínica'}}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AddMedicalRecordComponent implements OnInit {
  medicalRecordForm: FormGroup;
  pets: Pet[] = [];
  selectedPet: Pet | null = null;
  loading = false;
  errorMessage = '';
  preselectedPetId: string = '';

  constructor(
    private fb: FormBuilder,
    private medicalRecordService: MedicalRecordService,
    private petService: PetService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.medicalRecordForm = this.fb.group({
      petId: ['', [Validators.required]],
      date: [new Date().toISOString().split('T')[0], [Validators.required]],
      veterinarian: ['', [Validators.required]],
      reason: ['', [Validators.required]],
      symptoms: [''],
      diagnosis: ['', [Validators.required]],
      treatment: ['', [Validators.required]],
      weight: [''],
      temperature: [''],
      heartRate: [''],
      respiratoryRate: [''],
      medications: this.fb.array([]),
      observations: [''],
      nextAppointment: ['']
    });
  }

  ngOnInit() {
    // Verificar si hay parámetros preseleccionados en los query params
    this.route.queryParams.subscribe(params => {
      if (params['petId']) {
        this.preselectedPetId = params['petId'];
      }
      
      // Si es un seguimiento, pre-poblar algunos campos
      if (params['followUp']) {
        this.medicalRecordForm.patchValue({
          reason: params['reason'] || 'Seguimiento de consulta anterior'
        });
      }
    });

    this.loadPets();
  }

  get medications() {
    return this.medicalRecordForm.get('medications') as FormArray;
  }

  loadPets() {
    this.petService.getPets().subscribe({
      next: (response) => {
        this.pets = response.data || [];
        
        // Si hay un petId preseleccionado, establecerlo
        if (this.preselectedPetId) {
          this.medicalRecordForm.patchValue({ petId: this.preselectedPetId });
          this.onPetChange();
        }
      },
      error: (error) => {
        console.error('Error loading pets:', error);
        this.errorMessage = 'Error al cargar las mascotas';
      }
    });
  }

  onPetChange() {
    const petId = this.medicalRecordForm.get('petId')?.value;
    this.selectedPet = this.pets.find(pet => pet._id === petId) || null;
  }

  addMedication() {
    const medicationGroup = this.fb.group({
      name: ['', [Validators.required]],
      dosage: ['', [Validators.required]],
      frequency: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      instructions: ['']
    });

    this.medications.push(medicationGroup);
  }

  removeMedication(index: number) {
    this.medications.removeAt(index);
  }

  onSubmit() {
    if (this.medicalRecordForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const formValue = this.medicalRecordForm.value;
      
      // Limpiar campos vacíos opcionales
      const medicalRecord: Partial<MedicalRecord> = {
        petId: formValue.petId,
        date: formValue.date,
        veterinarian: formValue.veterinarian,
        reason: formValue.reason,
        symptoms: formValue.symptoms || '',
        diagnosis: formValue.diagnosis,
        treatment: formValue.treatment,
        medications: formValue.medications || [],
        observations: formValue.observations || ''
      };

      // Agregar signos vitales solo si tienen valores
      if (formValue.weight) medicalRecord.weight = parseFloat(formValue.weight);
      if (formValue.temperature) medicalRecord.temperature = parseFloat(formValue.temperature);
      if (formValue.heartRate) medicalRecord.heartRate = parseInt(formValue.heartRate);
      if (formValue.respiratoryRate) medicalRecord.respiratoryRate = parseInt(formValue.respiratoryRate);
      if (formValue.nextAppointment) medicalRecord.nextAppointment = formValue.nextAppointment;

      this.medicalRecordService.createMedicalRecord(medicalRecord).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Medical record created successfully:', response);
          alert('Historia clínica creada exitosamente');
          this.router.navigate(['/medical-records']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error creating medical record:', error);
          
          if (error.status === 403) {
            this.errorMessage = 'Error 403: No tienes permisos para crear historias clínicas. Necesitas ser veterinario.';
            alert(`ERROR 403 - FORBIDDEN\n\nProblema: No tienes permisos de veterinario para crear historias clínicas.\n\nSoluciones:\n1. Inicia sesión con una cuenta de veterinario\n2. Usuario de prueba: carlos@veterinaria.com / 123456\n3. Verifica que el backend esté ejecutándose en puerto 3000\n\nDatos enviados:\n${JSON.stringify(medicalRecord, null, 2)}`);
          } else if (error.status === 0) {
            this.errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose.';
            alert(`ERROR DE CONEXIÓN\n\nProblema: No se puede conectar al servidor backend.\n\nVerifica:\n1. El backend debe estar ejecutándose en puerto 3000\n2. MongoDB debe estar funcionando\n3. No hay errores de CORS\n\nDatos que se intentaron enviar:\n${JSON.stringify(medicalRecord, null, 2)}`);
          } else {
            this.errorMessage = `Error ${error.status}: ${error.message}`;
            alert(`ERROR ${error.status}\n\nMensaje: ${error.message}\n\nDetalles del error:\n${JSON.stringify(error, null, 2)}\n\nDatos enviados:\n${JSON.stringify(medicalRecord, null, 2)}`);
          }
        }
      });
    } else {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.medicalRecordForm.controls).forEach(key => {
      const control = this.medicalRecordForm.get(key);
      control?.markAsTouched();
    });

    // También marcar los medicamentos como touched
    this.medications.controls.forEach(medicationControl => {
      Object.keys(medicationControl.value).forEach(key => {
        medicationControl.get(key)?.markAsTouched();
      });
    });
  }
}