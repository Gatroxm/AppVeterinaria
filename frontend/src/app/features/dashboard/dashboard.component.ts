import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../core/services/auth.service';
import { PetService } from '../../core/services/pet.service';
import { AppointmentService } from '../../core/services/appointment.service';
import { MedicalRecordService } from '../../core/services/medical-record.service';
import { User } from '../../core/models/user.interface';
import { Pet } from '../../core/models/pet.interface';
import { Appointment } from '../../core/models/appointment.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentPets: Pet[] = [];
  upcomingAppointments: Appointment[] = [];
  
  stats = {
    pets: 0,
    pendingAppointments: 0,
    upcomingVaccinations: 0,
    medicalRecords: 0
  };

  constructor(
    private authService: AuthService,
    private petService: PetService,
    private appointmentService: AppointmentService,
    private medicalRecordService: MedicalRecordService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get current user
    this.currentUser = this.authService.getCurrentUser();
    
    // Load dashboard data
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load pets
    this.petService.getPets().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.recentPets = response.data.slice(0, 3); // Show only 3 recent pets
          this.stats.pets = response.data.length;
        }
      },
      error: (error) => {
        console.error('Error loading pets:', error);
      }
    });

    // Load appointments
    this.appointmentService.getAppointments().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.upcomingAppointments = response.data
            .filter(apt => apt.status === 'confirmed' || apt.status === 'pending')
            .slice(0, 3); // Show only 3 upcoming appointments
          
          this.stats.pendingAppointments = response.data
            .filter(apt => apt.status === 'pending').length;
            
          // Count upcoming vaccinations from appointments
          const now = new Date();
          const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
          
          this.stats.upcomingVaccinations = response.data
            .filter(apt => {
              const appointmentDate = new Date(apt.appointmentDate);
              return apt.serviceType === 'vaccination' && 
                     appointmentDate >= now && 
                     appointmentDate <= nextMonth &&
                     (apt.status === 'confirmed' || apt.status === 'pending');
            }).length;
        }
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
      }
    });

    // Load medical records count
    this.medicalRecordService.getMedicalRecords().subscribe({
      next: (records) => {
        this.stats.medicalRecords = records.length;
      },
      error: (error) => {
        console.error('Error loading medical records:', error);
      }
    });
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

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'confirmed':
        return 'primary';
      case 'pending':
        return 'accent';
      case 'cancelled':
        return 'warn';
      default:
        return 'primary';
    }
  }

  navigateToAllPets(): void {
    this.router.navigate(['/pets']);
  }

  navigateToAddPet(): void {
    this.router.navigate(['/pets/new']);
  }

  navigateToAllAppointments(): void {
    this.router.navigate(['/appointments']);
  }

  navigateToAddAppointment(): void {
    this.router.navigate(['/appointments/new']);
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

  navigateToMedicalRecords(): void {
    this.router.navigate(['/medical-records']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
