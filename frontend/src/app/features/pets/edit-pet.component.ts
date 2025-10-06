import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { PetService } from '../../core/services/pet.service';
import { Pet } from '../../core/models/pet.interface';

@Component({
  selector: 'app-edit-pet',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <mat-toolbar class="bg-white shadow-sm">
        <button mat-icon-button routerLink="/pets">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span class="flex-1 text-xl font-semibold">Editar {{pet?.name || 'Mascota'}}</span>
      </mat-toolbar>

      <!-- Content -->
      <div class="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        <!-- Loading State -->
        <div *ngIf="loadingPet" class="flex justify-center items-center py-12">
          <mat-icon class="animate-spin text-4xl text-veterinary-primary">refresh</mat-icon>
          <span class="ml-3 text-gray-600">Cargando mascota...</span>
        </div>

        <!-- Form -->
        <div *ngIf="!loadingPet" class="bg-white rounded-lg shadow-sm p-6">
          <form [formGroup]="petForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <!-- Nombre -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Nombre de la mascota</mat-label>
              <input matInput formControlName="name" required>
              <mat-error *ngIf="petForm.get('name')?.hasError('required')">
                El nombre es requerido
              </mat-error>
            </mat-form-field>

            <!-- Especie -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Especie</mat-label>
              <mat-select formControlName="species" required>
                <mat-option value="dog">Perro</mat-option>
                <mat-option value="cat">Gato</mat-option>
                <mat-option value="bird">Ave</mat-option>
                <mat-option value="rabbit">Conejo</mat-option>
                <mat-option value="other">Otro</mat-option>
              </mat-select>
              <mat-error *ngIf="petForm.get('species')?.hasError('required')">
                La especie es requerida
              </mat-error>
            </mat-form-field>

            <!-- Raza -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Raza (opcional)</mat-label>
              <input matInput formControlName="breed">
            </mat-form-field>

            <!-- Fecha de nacimiento -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Fecha de nacimiento</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="dateOfBirth">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <!-- Género -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Género</mat-label>
              <mat-select formControlName="gender" required>
                <mat-option value="male">Macho</mat-option>
                <mat-option value="female">Hembra</mat-option>
                <mat-option value="unknown">No especificado</mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Peso -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Peso (kg)</mat-label>
              <input matInput type="number" step="0.1" formControlName="weight">
              <mat-hint>Peso en kilogramos</mat-hint>
            </mat-form-field>

            <!-- Color -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Color (opcional)</mat-label>
              <input matInput formControlName="color">
            </mat-form-field>

            <!-- Error message -->
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              <strong class="font-bold">Error:</strong>
              <span class="block sm:inline ml-1">{{errorMessage}}</span>
            </div>

            <!-- Success message -->
            <div *ngIf="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
              <strong class="font-bold">Éxito:</strong>
              <span class="block sm:inline ml-1">{{successMessage}}</span>
            </div>

            <!-- Buttons -->
            <div class="flex justify-between pt-4">
              <div>
                <button mat-button type="button" routerLink="/pets">
                  <mat-icon class="mr-2">arrow_back</mat-icon>
                  Cancelar
                </button>
                <button mat-button type="button" [routerLink]="['/pets', petId]" class="ml-2">
                  <mat-icon class="mr-2">visibility</mat-icon>
                  Ver Detalles
                </button>
              </div>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="petForm.invalid || loading">
                <mat-spinner *ngIf="loading" diameter="20" class="mr-2"></mat-spinner>
                <mat-icon *ngIf="!loading" class="mr-2">save</mat-icon>
                {{loading ? 'Guardando...' : 'Guardar Cambios'}}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class EditPetComponent implements OnInit {
  petForm: FormGroup;
  pet: Pet | null = null;
  petId: string | null = null;
  loading = false;
  loadingPet = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService
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

  ngOnInit(): void {
    this.petId = this.route.snapshot.paramMap.get('id');
    if (this.petId) {
      this.loadPet(this.petId);
    } else {
      this.errorMessage = 'ID de mascota no válido';
      this.loadingPet = false;
    }
  }

  loadPet(id: string): void {
    this.loadingPet = true;
    this.petService.getPetById(id).subscribe({
      next: (response) => {
        this.loadingPet = false;
        if (response.success && response.data) {
          this.pet = response.data;
          this.populateForm();
        } else {
          this.errorMessage = 'No se pudo cargar la mascota';
        }
      },
      error: (error) => {
        this.loadingPet = false;
        this.errorMessage = 'Error al cargar la mascota';
        console.error('Error loading pet:', error);
      }
    });
  }

  populateForm(): void {
    if (this.pet) {
      this.petForm.patchValue({
        name: this.pet.name,
        species: this.pet.species,
        breed: this.pet.breed || '',
        dateOfBirth: this.pet.dateOfBirth ? new Date(this.pet.dateOfBirth) : null,
        gender: this.pet.gender || 'unknown',
        weight: this.pet.weight || '',
        color: this.pet.color || ''
      });
    }
  }

  onSubmit(): void {
    if (this.petForm.valid && this.petId) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const petData = this.petForm.value;

      this.petService.updatePet(this.petId, petData).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = 'Mascota actualizada exitosamente';
            // Redirect after 2 seconds
            setTimeout(() => {
              this.router.navigate(['/pets', this.petId]);
            }, 2000);
          } else {
            this.errorMessage = 'Error al actualizar la mascota';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Error al actualizar la mascota';
          console.error('Error updating pet:', error);
        }
      });
    }
  }
}