import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MedicalRecordService } from '../../core/services/medical-record.service';
import { PetService } from '../../core/services/pet.service';
import { MedicalRecord } from '../../core/models/medical-record.interface';
import { Pet } from '../../core/models/pet.interface';
import { sampleMedicalRecordsFor68e2fcbb7514c5b01020d533 } from './sample-data';

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center">
              <button 
                routerLink="/dashboard"
                class="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors mr-4">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Historias Clínicas</h1>
                <p class="text-sm text-gray-600">Gestiona los registros médicos de las mascotas</p>
              </div>
            </div>
            
            <button 
              routerLink="/medical-records/new"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Nueva Historia Clínica
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <input 
                type="text" 
                placeholder="Buscar por mascota, diagnóstico..."
                [(ngModel)]="searchTerm"
                (input)="onSearch()"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
            </div>

            <!-- Pet filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mascota</label>
              <select 
                [(ngModel)]="selectedPetId"
                (change)="onFilterChange()"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option value="">Todas las mascotas</option>
                <option *ngFor="let pet of pets" [value]="pet._id">{{pet.name}} ({{pet.species}})</option>
              </select>
            </div>

            <!-- Date range -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
              <input 
                type="date" 
                [(ngModel)]="startDate"
                (change)="onFilterChange()"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
              <input 
                type="date" 
                [(ngModel)]="endDate"
                (change)="onFilterChange()"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
            </div>
          </div>
        </div>

        <!-- Medical Records List -->
        <div *ngIf="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>

        <div *ngIf="!loading && medicalRecords.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay historias clínicas</h3>
          <p class="mt-1 text-sm text-gray-500">Comienza creando una nueva historia clínica para una mascota.</p>
          <div class="mt-6">
            <button 
              routerLink="/medical-records/new"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Nueva Historia Clínica
            </button>
          </div>
        </div>

        <!-- Records Grid -->
        <div *ngIf="!loading && medicalRecords.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div *ngFor="let record of medicalRecords" class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div class="p-6">
              <!-- Header -->
              <div class="flex justify-between items-start mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">{{getPetName(record.petId)}}</h3>
                    <p class="text-sm text-gray-500">{{record.date | date:'dd/MM/yyyy'}}</p>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button 
                    [routerLink]="['/medical-records', record._id]"
                    class="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    [routerLink]="['/medical-records', 'edit', record._id]"
                    class="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Content -->
              <div class="space-y-3">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Motivo de consulta</h4>
                  <p class="text-sm text-gray-600">{{record.reason}}</p>
                </div>

                <div>
                  <h4 class="text-sm font-medium text-gray-900">Diagnóstico</h4>
                  <p class="text-sm text-gray-600">{{record.diagnosis || 'Sin diagnóstico registrado'}}</p>
                </div>

                <!-- Vital signs -->
                <div *ngIf="record.weight || record.temperature" class="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                  <div *ngIf="record.weight">
                    <span class="text-xs text-gray-500">Peso</span>
                    <p class="font-medium">{{record.weight}} kg</p>
                  </div>
                  <div *ngIf="record.temperature">
                    <span class="text-xs text-gray-500">Temperatura</span>
                    <p class="font-medium">{{record.temperature}}°C</p>
                  </div>
                </div>

                <!-- Veterinarian and medications -->
                <div class="pt-3 border-t border-gray-100">
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-500">Veterinario: <span class="font-medium text-gray-900">{{record.veterinarian}}</span></span>
                    <span *ngIf="record.medications?.length" class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {{record.medications.length}} medicamento{{record.medications.length !== 1 ? 's' : ''}}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div *ngIf="!loading && medicalRecords.length > 0" class="flex justify-between items-center mt-6">
          <div class="text-sm text-gray-700">
            Mostrando {{medicalRecords.length}} registros
          </div>
          <div class="flex space-x-2">
            <button class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
              Anterior
            </button>
            <button class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MedicalRecordsComponent implements OnInit {
  medicalRecords: MedicalRecord[] = [];
  pets: Pet[] = [];
  loading = true;
  
  // Filters
  searchTerm = '';
  selectedPetId = '';
  startDate = '';
  endDate = '';

  constructor(
    private medicalRecordService: MedicalRecordService,
    private petService: PetService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    
    // Cargar mascotas para el filtro
    this.petService.getPets().subscribe({
      next: (response) => {
        this.pets = response.data || [];
      },
      error: (error) => {
        console.error('Error loading pets:', error);
        // Agregar mascota de ejemplo para el ID específico
        this.pets = [
          {
            _id: '68e2fcbb7514c5b01020d533',
            name: 'Max',
            species: 'dog',
            breed: 'Labrador Retriever',
            age: 5,
            gender: 'male',
            weight: 28.5,
            owner: 'user1',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            _id: 'pet1',
            name: 'Luna',
            species: 'cat',
            breed: 'Persa',
            age: 3,
            gender: 'female',
            weight: 4.2,
            owner: 'user1',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            _id: 'pet2',
            name: 'Rocky',
            species: 'dog',
            breed: 'Pastor Alemán',
            age: 7,
            gender: 'male',
            weight: 32.0,
            owner: 'user1',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
      }
    });

    // Cargar historias clínicas
    this.medicalRecordService.getMedicalRecords().subscribe({
      next: (records) => {
        this.medicalRecords = records;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading medical records:', error);
        this.loading = false;
        // Usar datos específicos para la mascota 68e2fcbb7514c5b01020d533 + datos generales
        this.medicalRecords = [...sampleMedicalRecordsFor68e2fcbb7514c5b01020d533, ...this.getMockData()];
      }
    });
  }

  getPetName(petId: string): string {
    const pet = this.pets.find(p => p._id === petId);
    return pet ? `${pet.name} (${pet.species})` : 'Mascota no encontrada';
  }

  onSearch() {
    // Implementar búsqueda
    console.log('Searching:', this.searchTerm);
  }

  onFilterChange() {
    // Implementar filtros
    console.log('Filters changed:', {
      pet: this.selectedPetId,
      startDate: this.startDate,
      endDate: this.endDate
    });
  }

  // Datos de ejemplo para desarrollo
  private getMockData(): MedicalRecord[] {
    return [
      {
        _id: '1',
        petId: 'pet1',
        date: '2025-10-01',
        veterinarian: 'Dr. María González',
        reason: 'Consulta de rutina y vacunación',
        symptoms: 'Ninguno, revisión preventiva',
        diagnosis: 'Animal sano, se aplica vacuna antirrábica',
        treatment: 'Vacunación antirrábica, desparasitación',
        medications: [
          {
            name: 'Drontal Plus',
            dosage: '1 tableta',
            frequency: 'Dosis única',
            duration: '1 día',
            instructions: 'Administrar con alimento'
          }
        ],
        weight: 25.5,
        temperature: 38.2,
        heartRate: 90,
        respiratoryRate: 24,
        observations: 'Mascota en excelente estado de salud. Propietario muy responsable con el cuidado.',
        nextAppointment: '2026-10-01'
      },
      {
        _id: '2',
        petId: 'pet1',
        date: '2025-09-15',
        veterinarian: 'Dr. Carlos Mendoza',
        reason: 'Problemas digestivos',
        symptoms: 'Vómitos, diarrea, pérdida de apetito desde hace 2 días',
        diagnosis: 'Gastroenteritis aguda, posible intoxicación alimentaria',
        treatment: 'Dieta blanda, medicación antiemética y probióticos',
        medications: [
          {
            name: 'Metoclopramida',
            dosage: '0.5mg/kg',
            frequency: 'Cada 8 horas',
            duration: '5 días',
            instructions: 'Administrar 30 minutos antes de las comidas'
          },
          {
            name: 'Probióticos',
            dosage: '1 sobre',
            frequency: 'Cada 12 horas',
            duration: '7 días',
            instructions: 'Mezclar con un poco de agua o alimento'
          }
        ],
        weight: 25.2,
        temperature: 38.8,
        observations: 'Mejoría notable después del tratamiento. Recomendar dieta suave por una semana más.'
      },
      {
        _id: '3',
        petId: 'pet2',
        date: '2025-10-03',
        veterinarian: 'Dra. Ana Herrera',
        reason: 'Revisión post-operatoria',
        symptoms: 'Seguimiento de esterilización',
        diagnosis: 'Cicatrización normal, sin complicaciones',
        treatment: 'Limpieza de herida, control de puntos',
        medications: [
          {
            name: 'Tramadol',
            dosage: '2mg/kg',
            frequency: 'Cada 12 horas',
            duration: '3 días',
            instructions: 'Administrar con alimento para evitar molestias estomacales'
          }
        ],
        weight: 4.2,
        temperature: 38.5,
        observations: 'Herida quirúrgica en perfecto estado. Retirar puntos en 7 días.'
      }
    ];
  }
}