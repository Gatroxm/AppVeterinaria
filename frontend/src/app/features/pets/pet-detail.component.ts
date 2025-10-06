import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PetService } from '../../core/services/pet.service';
import { Pet } from '../../core/models/pet.interface';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatToolbarModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <mat-toolbar class="bg-white shadow-sm">
        <button mat-icon-button routerLink="/pets">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span class="flex-1 text-xl font-semibold">Detalles de {{pet?.name || 'Mascota'}}</span>
        <button *ngIf="pet" mat-raised-button color="primary" (click)="editPet()">
          <mat-icon class="mr-2">edit</mat-icon>
          Editar
        </button>
      </mat-toolbar>

      <!-- Content -->
      <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        <!-- Loading State -->
        <div *ngIf="loading" class="flex justify-center items-center py-12">
          <mat-icon class="animate-spin text-4xl text-veterinary-primary">refresh</mat-icon>
          <span class="ml-3 text-gray-600">Cargando...</span>
        </div>

        <!-- Error State -->
        <div *ngIf="error && !loading" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <strong class="font-bold">Error:</strong>
          <span class="block sm:inline ml-1">{{error}}</span>
        </div>

        <!-- Pet Details -->
        <div *ngIf="pet && !loading" class="bg-white rounded-lg shadow-sm">
          <div class="p-6">
            <!-- Pet Header -->
            <div class="flex items-center mb-6">
              <div class="w-20 h-20 bg-veterinary-light rounded-full flex items-center justify-center mr-6">
                <mat-icon class="text-4xl text-veterinary-primary">{{getPetIcon(pet.species)}}</mat-icon>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-900">{{pet.name}}</h1>
                <p class="text-lg text-gray-600">{{pet.breed || pet.species | titlecase}}</p>
                <mat-chip [color]="getSpeciesColor(pet.species)" class="mt-2">
                  {{pet.species | titlecase}}
                </mat-chip>
              </div>
            </div>

            <!-- Pet Information Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Información Básica</h3>
                
                <div class="flex justify-between">
                  <span class="text-gray-600">Nombre:</span>
                  <span class="font-medium">{{pet.name}}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Especie:</span>
                  <span class="font-medium">{{pet.species | titlecase}}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Raza:</span>
                  <span class="font-medium">{{pet.breed || 'No especificada'}}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Género:</span>
                  <span class="font-medium">{{pet.gender | titlecase}}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Fecha de nacimiento:</span>
                  <span class="font-medium">{{pet.dateOfBirth | date:'longDate'}}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Edad:</span>
                  <span class="font-medium">{{getPetAge(pet.dateOfBirth)}}</span>
                </div>
              </div>

              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Características Físicas</h3>
                
                <div class="flex justify-between">
                  <span class="text-gray-600">Peso:</span>
                  <span class="font-medium">{{pet.weight || 'No registrado'}} kg</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Color:</span>
                  <span class="font-medium">{{pet.color || 'No especificado'}}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Estado:</span>
                  <mat-chip [color]="pet.isActive ? 'primary' : 'warn'">
                    {{pet.isActive ? 'Activo' : 'Inactivo'}}
                  </mat-chip>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Registrado:</span>
                  <span class="font-medium">{{pet.createdAt | date:'short'}}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 mt-8 pt-6 border-t">
              <button mat-button routerLink="/pets">
                <mat-icon class="mr-2">arrow_back</mat-icon>
                Volver a la lista
              </button>
              <button mat-raised-button color="primary" (click)="editPet()">
                <mat-icon class="mr-2">edit</mat-icon>
                Editar Mascota
              </button>
            </div>
          </div>
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
export class PetDetailComponent implements OnInit {
  pet: Pet | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService
  ) {}

  ngOnInit(): void {
    const petId = this.route.snapshot.paramMap.get('id');
    if (petId) {
      this.loadPet(petId);
    } else {
      this.error = 'ID de mascota no válido';
      this.loading = false;
    }
  }

  loadPet(id: string): void {
    this.loading = true;
    this.petService.getPetById(id).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success && response.data) {
          this.pet = response.data;
        } else {
          this.error = 'No se pudo cargar la mascota';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Error al cargar la mascota';
        console.error('Error loading pet:', error);
      }
    });
  }

  getPetAge(dateOfBirth: string | Date | undefined): string {
    if (!dateOfBirth) return 'N/A';
    
    const birth = new Date(dateOfBirth);
    const today = new Date();
    const ageMs = today.getTime() - birth.getTime();
    const ageDate = new Date(ageMs);
    
    const years = ageDate.getUTCFullYear() - 1970;
    const months = ageDate.getUTCMonth();
    
    if (years > 0) {
      return `${years} año(s)`;
    } else {
      return `${months} mes(es)`;
    }
  }

  getPetIcon(species: string): string {
    const icons: {[key: string]: string} = {
      'dog': 'pets',
      'cat': 'pets',
      'bird': 'flutter_dash',
      'rabbit': 'cruelty_free',
      'other': 'pets'
    };
    return icons[species] || 'pets';
  }

  getSpeciesColor(species: string): 'primary' | 'accent' | 'warn' {
    const colors: {[key: string]: 'primary' | 'accent' | 'warn'} = {
      'dog': 'primary',
      'cat': 'accent',
      'bird': 'warn',
      'rabbit': 'primary',
      'other': 'accent'
    };
    return colors[species] || 'primary';
  }

  editPet(): void {
    if (this.pet) {
      this.router.navigate(['/pets/edit', this.pet._id]);
    }
  }
}