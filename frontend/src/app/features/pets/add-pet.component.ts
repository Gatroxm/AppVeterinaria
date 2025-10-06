import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PetService } from '../../core/services/pet.service';

@Component({
  selector: 'app-add-pet',
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
            <h1 class="text-3xl font-extrabold text-gray-900">Agregar Nueva Mascota</h1>
            <p class="mt-2 text-sm text-gray-600">Completa los datos de tu nueva mascota</p>
          </div>
          <button 
            routerLink="/pets"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-veterinary-primary transition-colors duration-200">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Volver
          </button>
        </div>

        <!-- Form Container -->
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="bg-veterinary-primary px-6 py-4">
            <div class="flex items-center">
              <svg class="h-6 w-6 text-white mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19C3 20.11 3.89 21 5 21H11V19H5V3H13V9H21ZM16 10V12H14V16H12V12H10V10H12V8H14V10H16ZM20 14L18 12L16 14L18 16L20 14Z"/>
              </svg>
              <h2 class="text-xl font-bold text-white">Información de la Mascota</h2>
            </div>
          </div>

          <div class="px-6 py-8">
            <form [formGroup]="petForm" (ngSubmit)="onSubmit()" class="space-y-6">
              
              <!-- Nombre -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la mascota *
                </label>
                <input 
                  id="name"
                  type="text" 
                  formControlName="name" 
                  required
                  placeholder="Ej: Max, Luna, Bobby..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veterinary-primary focus:border-transparent transition-colors duration-200"
                  [class.border-red-500]="petForm.get('name')?.invalid && petForm.get('name')?.touched">
                <div class="mt-1 min-h-[20px]">
                  <p *ngIf="petForm.get('name')?.hasError('required') && petForm.get('name')?.touched" 
                     class="text-sm text-red-600">
                    El nombre es requerido
                  </p>
                  <p *ngIf="petForm.get('name')?.hasError('minlength') && petForm.get('name')?.touched" 
                     class="text-sm text-red-600">
                    El nombre debe tener al menos 2 caracteres
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Especie -->
                <div>
                  <label for="species" class="block text-sm font-medium text-gray-700 mb-2">
                    Especie *
                  </label>
                  <select
                    id="species"
                    formControlName="species"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veterinary-primary focus:border-transparent transition-colors duration-200"
                    [class.border-red-500]="petForm.get('species')?.invalid && petForm.get('species')?.touched">
                    <option value="">Seleccionar especie</option>
                    <option value="dog">🐕 Perro</option>
                    <option value="cat">🐱 Gato</option>
                    <option value="bird">🐦 Ave</option>
                    <option value="rabbit">🐰 Conejo</option>
                    <option value="other">🐾 Otro</option>
                  </select>
                  <div class="mt-1 min-h-[20px]">
                    <p *ngIf="petForm.get('species')?.hasError('required') && petForm.get('species')?.touched"
                       class="text-sm text-red-600">
                      La especie es requerida
                    </p>
                  </div>
                </div>

                <!-- Raza -->
                <div>
                  <label for="breed" class="block text-sm font-medium text-gray-700 mb-2">
                    Raza <span class="text-gray-400">(opcional)</span>
                  </label>
                  <input 
                    id="breed"
                    type="text" 
                    formControlName="breed"
                    placeholder="Ej: Labrador, Persa, Canario..."
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veterinary-primary focus:border-transparent transition-colors duration-200">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Fecha de nacimiento -->
                <div>
                  <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de nacimiento <span class="text-gray-400">(opcional)</span>
                  </label>
                  <input 
                    id="dateOfBirth"
                    type="date" 
                    formControlName="dateOfBirth"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veterinary-primary focus:border-transparent transition-colors duration-200">
                </div>

                <!-- Género -->
                <div>
                  <label for="gender" class="block text-sm font-medium text-gray-700 mb-2">
                    Género *
                  </label>
                  <select
                    id="gender"
                    formControlName="gender"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veterinary-primary focus:border-transparent transition-colors duration-200">
                    <option value="male">♂️ Macho</option>
                    <option value="female">♀️ Hembra</option>
                    <option value="unknown">❓ No especificado</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Peso -->
                <div>
                  <label for="weight" class="block text-sm font-medium text-gray-700 mb-2">
                    Peso <span class="text-gray-400">(kg, opcional)</span>
                  </label>
                  <div class="relative">
                    <input 
                      id="weight"
                      type="number" 
                      step="0.1"
                      formControlName="weight"
                      placeholder="0.0"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veterinary-primary focus:border-transparent transition-colors duration-200">
                    <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">kg</span>
                  </div>
                  <p class="mt-1 text-xs text-gray-500">Peso aproximado en kilogramos</p>
                </div>

                <!-- Color -->
                <div>
                  <label for="color" class="block text-sm font-medium text-gray-700 mb-2">
                    Color <span class="text-gray-400">(opcional)</span>
                  </label>
                  <input 
                    id="color"
                    type="text" 
                    formControlName="color"
                    placeholder="Ej: Negro, Blanco, Marrón..."
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veterinary-primary focus:border-transparent transition-colors duration-200">
                </div>
              </div>

              <!-- Error message -->
              <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <strong class="font-bold">Error:</strong>
                <span class="block sm:inline"> {{ errorMessage }}</span>
              </div>

              <!-- Buttons -->
              <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  [disabled]="petForm.invalid || loading"
                  class="flex-1 flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-veterinary-primary hover:bg-veterinary-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-veterinary-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                  
                  <svg *ngIf="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  
                  <svg *ngIf="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  
                  {{ loading ? 'Guardando...' : 'Guardar Mascota' }}
                </button>
                
                <button
                  type="button"
                  routerLink="/pets"
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
  `
})
export class AddPetComponent implements OnInit {
  petForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private router: Router
  ) {
    this.petForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      species: ['', Validators.required],
      breed: [''],
      dateOfBirth: [''],
      gender: ['unknown', Validators.required],
      weight: [''],
      color: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.petForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const petData = this.petForm.value;

      this.petService.createPet(petData).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.router.navigate(['/pets']);
          } else {
            this.errorMessage = 'Error al crear la mascota';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Error al crear la mascota';
          console.error('Error creating pet:', error);
        }
      });
    }
  }
}