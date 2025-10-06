import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PetService } from '../../core/services/pet.service';
import { Pet } from '../../core/models/pet.interface';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatTableModule,
    MatToolbarModule
  ],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.scss'
})
export class PetsComponent implements OnInit {
  pets: Pet[] = [];
  loading = true;
  error = '';
  displayedColumns: string[] = ['name', 'species', 'breed', 'age', 'weight', 'actions'];

  constructor(
    private petService: PetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.loading = true;
    this.petService.getPets().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success && response.data) {
          this.pets = response.data;
        } else {
          this.error = 'No se pudieron cargar las mascotas';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Error al cargar las mascotas';
        console.error('Error loading pets:', error);
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

  editPet(pet: Pet): void {
    this.router.navigate(['/pets/edit', pet._id]);
  }

  viewPet(pet: Pet): void {
    this.router.navigate(['/pets', pet._id]);
  }

  addNewPet(): void {
    this.router.navigate(['/pets/new']);
  }

  createMedicalRecord(pet: Pet): void {
    this.router.navigate(['/medical-records/new'], { 
      queryParams: { petId: pet._id } 
    });
  }
}