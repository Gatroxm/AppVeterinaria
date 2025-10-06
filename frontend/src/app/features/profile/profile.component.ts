import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center py-4">
            <button 
              routerLink="/dashboard"
              class="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors mr-4">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 class="text-xl font-semibold text-gray-900">Mi Perfil</h1>
          </div>
        </div>
      </div>

      <!-- Profile Content -->
      <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Profile Header -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="flex items-center space-x-6">
            <div class="flex-shrink-0">
              <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">{{currentUser?.name || 'Usuario'}}</h2>
              <p class="text-gray-600">{{currentUser?.email || 'No disponible'}}</p>
              <div class="mt-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  Veterinario
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Información Personal</h3>
          
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Nombre -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Nombre completo <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                formControlName="name"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                [class.border-red-500]="profileForm.get('name')?.invalid && profileForm.get('name')?.touched">
              <div *ngIf="profileForm.get('name')?.hasError('required') && profileForm.get('name')?.touched" 
                   class="text-sm text-red-600 mt-1">
                El nombre es requerido
              </div>
            </div>

            <!-- Email -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Correo electrónico <span class="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                formControlName="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                [class.border-red-500]="profileForm.get('email')?.invalid && profileForm.get('email')?.touched">
              <div *ngIf="profileForm.get('email')?.hasError('required') && profileForm.get('email')?.touched" 
                   class="text-sm text-red-600 mt-1">
                El email es requerido
              </div>
              <div *ngIf="profileForm.get('email')?.hasError('email') && profileForm.get('email')?.touched" 
                   class="text-sm text-red-600 mt-1">
                Formato de email inválido
              </div>
            </div>

            <!-- Teléfono -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input 
                type="tel" 
                formControlName="phone"
                placeholder="Ej: +52 55 1234 5678"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
            </div>

            <!-- Especialidad -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Especialidad
              </label>
              <select 
                formControlName="specialty"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
                <option value="">Selecciona una especialidad</option>
                <option value="general">Medicina General</option>
                <option value="surgery">Cirugía</option>
                <option value="cardiology">Cardiología</option>
                <option value="dermatology">Dermatología</option>
                <option value="oncology">Oncología</option>
                <option value="ophthalmology">Oftalmología</option>
                <option value="orthopedics">Ortopedia</option>
                <option value="neurology">Neurología</option>
              </select>
            </div>

            <!-- Número de cédula -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Número de cédula profesional
              </label>
              <input 
                type="text" 
                formControlName="license"
                placeholder="Ej: 12345678"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
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

            <!-- Success message -->
            <div *ngIf="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <div class="flex">
                <svg class="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <div>
                  <strong class="font-medium">Éxito:</strong>
                  <span class="ml-1">{{successMessage}}</span>
                </div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                routerLink="/dashboard"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors">
                Cancelar
              </button>
              <button 
                type="submit" 
                [disabled]="profileForm.invalid || loading"
                class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center">
                <svg *ngIf="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{loading ? 'Guardando...' : 'Guardar Cambios'}}
              </button>
            </div>
          </form>
        </div>

        <!-- Cambio de Contraseña -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Cambiar Contraseña</h3>
          
          <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()" class="space-y-6">
            <!-- Contraseña actual -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Contraseña actual <span class="text-red-500">*</span>
              </label>
              <input 
                type="password" 
                formControlName="currentPassword"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                [class.border-red-500]="passwordForm.get('currentPassword')?.invalid && passwordForm.get('currentPassword')?.touched">
            </div>

            <!-- Nueva contraseña -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Nueva contraseña <span class="text-red-500">*</span>
              </label>
              <input 
                type="password" 
                formControlName="newPassword"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                [class.border-red-500]="passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched">
              <div *ngIf="passwordForm.get('newPassword')?.hasError('minlength') && passwordForm.get('newPassword')?.touched" 
                   class="text-sm text-red-600 mt-1">
                La contraseña debe tener al menos 6 caracteres
              </div>
            </div>

            <!-- Confirmar contraseña -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Confirmar nueva contraseña <span class="text-red-500">*</span>
              </label>
              <input 
                type="password" 
                formControlName="confirmPassword"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                [class.border-red-500]="passwordForm.get('confirmPassword')?.invalid && passwordForm.get('confirmPassword')?.touched">
              <div *ngIf="passwordForm.hasError('passwordMismatch') && passwordForm.get('confirmPassword')?.touched" 
                   class="text-sm text-red-600 mt-1">
                Las contraseñas no coinciden
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button 
                type="submit" 
                [disabled]="passwordForm.invalid || loadingPassword"
                class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center">
                <svg *ngIf="loadingPassword" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{loadingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: any = null;
  loading = false;
  loadingPassword = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      specialty: [''],
      license: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser.name || '',
        email: this.currentUser.email || '',
        phone: this.currentUser.phone || '',
        specialty: this.currentUser.specialty || '',
        license: this.currentUser.license || ''
      });
    }
  }

  passwordMatchValidator(form: any) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword?.value !== confirmPassword?.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Simulamos la actualización del perfil
      setTimeout(() => {
        this.loading = false;
        this.successMessage = 'Perfil actualizado correctamente';
        
        // Actualizar el usuario actual (en una implementación real, esto se haría a través del servicio)
        this.currentUser = { ...this.currentUser, ...this.profileForm.value };
        
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      }, 1000);
    }
  }

  onChangePassword() {
    if (this.passwordForm.valid) {
      this.loadingPassword = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Simulamos el cambio de contraseña
      setTimeout(() => {
        this.loadingPassword = false;
        this.successMessage = 'Contraseña cambiada correctamente';
        this.passwordForm.reset();
        
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      }, 1000);
    }
  }
}