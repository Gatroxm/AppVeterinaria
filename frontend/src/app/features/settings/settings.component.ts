import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
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
            <h1 class="text-xl font-semibold text-gray-900">Configuración</h1>
          </div>
        </div>
      </div>

      <!-- Settings Content -->
      <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        <!-- General Settings -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Configuración General</h3>
          
          <form [formGroup]="settingsForm" (ngSubmit)="onSaveSettings()" class="space-y-6">
            
            <!-- Tema de la aplicación -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Tema de la aplicación
              </label>
              <select 
                formControlName="theme"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>

            <!-- Idioma -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Idioma
              </label>
              <select 
                formControlName="language"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>

            <!-- Zona horaria -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Zona horaria
              </label>
              <select 
                formControlName="timezone"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
                <option value="America/Mexico_City">Ciudad de México (UTC-6)</option>
                <option value="America/Cancun">Cancún (UTC-5)</option>
                <option value="America/Tijuana">Tijuana (UTC-8)</option>
              </select>
            </div>

            <!-- Formato de fecha -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Formato de fecha
              </label>
              <select 
                formControlName="dateFormat"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
                <option value="dd/MM/yyyy">DD/MM/AAAA</option>
                <option value="MM/dd/yyyy">MM/DD/AAAA</option>
                <option value="yyyy-MM-dd">AAAA-MM-DD</option>
              </select>
            </div>

          </form>
        </div>

        <!-- Notification Settings -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Notificaciones</h3>
          
          <div class="space-y-4">
            <!-- Email notifications -->
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input 
                  type="checkbox" 
                  formControlName="emailNotifications"
                  class="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2">
              </div>
              <div class="ml-3 text-sm">
                <label class="font-medium text-gray-700">Notificaciones por email</label>
                <p class="text-gray-500">Recibe notificaciones sobre citas y recordatorios por correo electrónico</p>
              </div>
            </div>

            <!-- Browser notifications -->
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input 
                  type="checkbox" 
                  formControlName="browserNotifications"
                  class="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2">
              </div>
              <div class="ml-3 text-sm">
                <label class="font-medium text-gray-700">Notificaciones del navegador</label>
                <p class="text-gray-500">Mostrar notificaciones emergentes en el navegador</p>
              </div>
            </div>

            <!-- Appointment reminders -->
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input 
                  type="checkbox" 
                  formControlName="appointmentReminders"
                  class="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2">
              </div>
              <div class="ml-3 text-sm">
                <label class="font-medium text-gray-700">Recordatorios de citas</label>
                <p class="text-gray-500">Enviar recordatorios antes de las citas programadas</p>
              </div>
            </div>
          </div>

          <!-- Reminder timing -->
          <div class="mt-6 space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              Enviar recordatorios con
            </label>
            <select 
              formControlName="reminderTiming"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
              <option value="15">15 minutos de anticipación</option>
              <option value="30">30 minutos de anticipación</option>
              <option value="60">1 hora de anticipación</option>
              <option value="120">2 horas de anticipación</option>
              <option value="1440">1 día de anticipación</option>
            </select>
          </div>
        </div>

        <!-- Privacy Settings -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Privacidad y Seguridad</h3>
          
          <div class="space-y-4">
            <!-- Auto logout -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Cerrar sesión automáticamente después de
              </label>
              <select 
                formControlName="autoLogout"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
                <option value="0">Nunca</option>
                <option value="30">30 minutos</option>
                <option value="60">1 hora</option>
                <option value="120">2 horas</option>
                <option value="480">8 horas</option>
              </select>
            </div>

            <!-- Two factor authentication -->
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input 
                  type="checkbox" 
                  formControlName="twoFactorAuth"
                  class="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2">
              </div>
              <div class="ml-3 text-sm">
                <label class="font-medium text-gray-700">Autenticación de dos factores</label>
                <p class="text-gray-500">Agregar una capa extra de seguridad a tu cuenta</p>
              </div>
            </div>

            <!-- Data sharing -->
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input 
                  type="checkbox" 
                  formControlName="dataSharing"
                  class="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2">
              </div>
              <div class="ml-3 text-sm">
                <label class="font-medium text-gray-700">Compartir datos para mejorar el servicio</label>
                <p class="text-gray-500">Permitir el uso anónimo de datos para mejorar la aplicación</p>
              </div>
            </div>
          </div>
        </div>

        <!-- System Settings -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Sistema</h3>
          
          <div class="space-y-4">
            <!-- Backup frequency -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Frecuencia de respaldo automático
              </label>
              <select 
                formControlName="backupFrequency"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
                <option value="manual">Manual solamente</option>
              </select>
            </div>

            <!-- Export data button -->
            <div class="pt-4">
              <button 
                type="button"
                (click)="exportData()"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-lg hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar mis datos
              </button>
            </div>
          </div>
        </div>

        <!-- Success/Error Messages -->
        <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
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

        <div *ngIf="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
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

        <!-- Save Button -->
        <div class="flex justify-end space-x-4">
          <button 
            type="button" 
            routerLink="/dashboard"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors">
            Cancelar
          </button>
          <button 
            type="button"
            (click)="onSaveSettings()"
            [disabled]="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center">
            <svg *ngIf="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{loading ? 'Guardando...' : 'Guardar Configuración'}}
          </button>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.settingsForm = this.fb.group({
      // General settings
      theme: ['light'],
      language: ['es'],
      timezone: ['America/Mexico_City'],
      dateFormat: ['dd/MM/yyyy'],
      
      // Notification settings
      emailNotifications: [true],
      browserNotifications: [true],
      appointmentReminders: [true],
      reminderTiming: ['30'],
      
      // Privacy settings
      autoLogout: ['120'],
      twoFactorAuth: [false],
      dataSharing: [false],
      
      // System settings
      backupFrequency: ['weekly']
    });
  }

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    // En una implementación real, cargarías la configuración desde el backend
    const savedSettings = localStorage.getItem('veterinaryAppSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.settingsForm.patchValue(settings);
    }
  }

  onSaveSettings() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Simular guardado de configuración
    setTimeout(() => {
      try {
        // Guardar en localStorage (en una implementación real, se enviaría al backend)
        localStorage.setItem('veterinaryAppSettings', JSON.stringify(this.settingsForm.value));
        
        this.loading = false;
        this.successMessage = 'Configuración guardada correctamente';
        
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      } catch (error) {
        this.loading = false;
        this.errorMessage = 'Error al guardar la configuración';
      }
    }, 1000);
  }

  exportData() {
    // Simular exportación de datos
    this.successMessage = 'Exportación de datos iniciada. Te notificaremos cuando esté lista.';
    
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
}