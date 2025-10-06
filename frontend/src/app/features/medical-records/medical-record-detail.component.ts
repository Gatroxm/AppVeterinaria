import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MedicalRecordService } from '../../core/services/medical-record.service';
import { PetService } from '../../core/services/pet.service';
import { MedicalRecord } from '../../core/models/medical-record.interface';
import { Pet } from '../../core/models/pet.interface';
import { ToastService } from '../../core/services/toast.service';
import { sampleMedicalRecordsFor68e2fcbb7514c5b01020d533 } from './sample-data';

@Component({
  selector: 'app-medical-record-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center">
              <button 
                routerLink="/medical-records"
                class="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors mr-4">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Historia Clínica</h1>
                <p class="text-sm text-gray-600" *ngIf="pet">{{pet.name}} - {{medicalRecord?.date | date:'dd/MM/yyyy'}}</p>
              </div>
            </div>
            
            <button 
              *ngIf="medicalRecord"
              [routerLink]="['/medical-records', 'edit', medicalRecord._id]"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </button>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Loading -->
        <div *ngIf="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>

        <!-- Medical Record Detail -->
        <div *ngIf="!loading && medicalRecord" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Pet Information -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Información de la Mascota</h3>
              <div *ngIf="pet" class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-sm text-gray-500">Nombre</span>
                  <p class="font-medium">{{pet.name}}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Especie</span>
                  <p class="font-medium">{{pet.species | titlecase}}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Raza</span>
                  <p class="font-medium">{{pet.breed || 'No especificada'}}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Edad</span>
                  <p class="font-medium">{{pet.age ? pet.age + ' años' : 'No especificada'}}</p>
                </div>
              </div>
            </div>

            <!-- Visit Information -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Información de la Consulta</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span class="text-sm text-gray-500">Fecha</span>
                  <p class="font-medium">{{medicalRecord.date | date:'dd/MM/yyyy'}}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Veterinario</span>
                  <p class="font-medium">{{medicalRecord.veterinarian}}</p>
                </div>
              </div>
              
              <div class="mt-6 space-y-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Motivo de la consulta</h4>
                  <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{{medicalRecord.reason}}</p>
                </div>
                
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Síntomas observados</h4>
                  <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{{medicalRecord.symptoms}}</p>
                </div>
                
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Diagnóstico</h4>
                  <p class="text-sm text-gray-700 bg-emerald-50 p-3 rounded-lg border-l-4 border-emerald-400">{{medicalRecord.diagnosis}}</p>
                </div>
                
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Tratamiento</h4>
                  <p class="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">{{medicalRecord.treatment}}</p>
                </div>
                
                <div *ngIf="medicalRecord.observations">
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Observaciones</h4>
                  <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{{medicalRecord.observations}}</p>
                </div>
              </div>
            </div>

            <!-- Medications -->
            <div *ngIf="medicalRecord.medications?.length" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Medicamentos Prescritos</h3>
              <div class="space-y-4">
                <div *ngFor="let medication of medicalRecord.medications" class="border border-gray-200 rounded-lg p-4">
                  <div class="flex justify-between items-start mb-3">
                    <h4 class="font-medium text-gray-900">{{medication.name}}</h4>
                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{{medication.duration}}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-gray-500">Dosis:</span>
                      <span class="font-medium ml-2">{{medication.dosage}}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Frecuencia:</span>
                      <span class="font-medium ml-2">{{medication.frequency}}</span>
                    </div>
                  </div>
                  <div *ngIf="medication.instructions" class="mt-3 text-sm text-gray-600 bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                    <strong>Instrucciones:</strong> {{medication.instructions}}
                  </div>
                </div>
              </div>
            </div>

            <!-- Attachments -->
            <div *ngIf="medicalRecord.attachments?.length" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Archivos Adjuntos</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div *ngFor="let attachment of medicalRecord.attachments" class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{attachment.name}}</p>
                    <p class="text-xs text-gray-500">{{attachment.type | titlecase}} - {{attachment.uploadDate | date:'dd/MM/yyyy'}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            
            <!-- Vital Signs -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Signos Vitales</h3>
              <div class="space-y-4">
                <div *ngIf="medicalRecord.weight" class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Peso</span>
                  <span class="font-medium">{{medicalRecord.weight}} kg</span>
                </div>
                <div *ngIf="medicalRecord.temperature" class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Temperatura</span>
                  <span class="font-medium">{{medicalRecord.temperature}}°C</span>
                </div>
                <div *ngIf="medicalRecord.heartRate" class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Frecuencia cardíaca</span>
                  <span class="font-medium">{{medicalRecord.heartRate}} bpm</span>
                </div>
                <div *ngIf="medicalRecord.respiratoryRate" class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Frecuencia respiratoria</span>
                  <span class="font-medium">{{medicalRecord.respiratoryRate}} rpm</span>
                </div>
              </div>
            </div>

            <!-- Next Appointment -->
            <div *ngIf="medicalRecord.nextAppointment" class="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-emerald-900 mb-2">Próxima Cita</h3>
              <p class="text-emerald-700">{{medicalRecord.nextAppointment | date:'dd/MM/yyyy'}}</p>
              <button class="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                Ver detalles de la cita →
              </button>
            </div>

            <!-- Actions -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Acciones</h3>
              <div class="space-y-3">
                <button 
                  (click)="downloadPDF()"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center transition-colors">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descargar PDF
                </button>
                <button 
                  (click)="shareRecord()"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center transition-colors">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Compartir
                </button>
                <button 
                  (click)="createFollowUp()"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center transition-colors">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H9.5a2 2 0 01-2-2V5a2 2 0 012-2H17" />
                  </svg>
                  Crear seguimiento
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div *ngIf="!loading && !medicalRecord" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Historia clínica no encontrada</h3>
          <p class="mt-1 text-sm text-gray-500">La historia clínica que buscas no existe o fue eliminada.</p>
          <div class="mt-6">
            <button 
              routerLink="/medical-records"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700">
              Volver a historias clínicas
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MedicalRecordDetailComponent implements OnInit {
  medicalRecord: MedicalRecord | null = null;
  pet: Pet | null = null;
  loading = true;
  recordId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medicalRecordService: MedicalRecordService,
    private petService: PetService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.recordId = this.route.snapshot.params['id'];
    this.loadMedicalRecord();
  }

  loadMedicalRecord() {
    this.loading = true;
    
    this.medicalRecordService.getMedicalRecordById(this.recordId).subscribe({
      next: (record) => {
        this.medicalRecord = record;
        if (record.petId) {
          this.loadPet(record.petId);
        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading medical record:', error);
        this.loading = false;
        
        // Buscar primero en los datos específicos de la mascota
        const specificRecord = sampleMedicalRecordsFor68e2fcbb7514c5b01020d533.find(r => r._id === this.recordId);
        this.medicalRecord = specificRecord || this.getMockRecord();
        
        if (this.medicalRecord?.petId) {
          this.loadPet(this.medicalRecord.petId);
        }
      }
    });
  }

  loadPet(petId: string) {
    this.petService.getPetById(petId).subscribe({
      next: (response) => {
        this.pet = response.data || null;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pet:', error);
        this.loading = false;
        // Usar datos de ejemplo para desarrollo
        if (petId === '68e2fcbb7514c5b01020d533') {
          this.pet = {
            _id: petId,
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
          };
        } else {
          this.pet = {
            _id: petId,
            name: 'Mascota Ejemplo',
            species: 'dog',
            breed: 'Raza Mixta',
            age: 3,
            gender: 'male',
            weight: 20.0,
            owner: 'user1',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          };
        }
      }
    });
  }

  private getMockRecord(): MedicalRecord {
    return {
      _id: this.recordId,
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
    };
  }

  // Métodos de acción
  downloadPDF() {
    if (!this.medicalRecord || !this.pet) return;
    
    // Crear contenido del PDF
    const content = this.generatePDFContent();
    
    // Crear blob y descargar
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `historia_clinica_${this.pet.name}_${this.medicalRecord.date}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    // Mostrar notificación de éxito
    this.toastService.success('Éxito', 'Historia clínica descargada correctamente');
  }

  shareRecord() {
    if (!this.medicalRecord || !this.pet) return;
    
    // Verificar si el navegador soporta Web Share API
    if (navigator.share) {
      navigator.share({
        title: `Historia Clínica de ${this.pet.name}`,
        text: `Historia clínica del ${this.medicalRecord.date} - ${this.medicalRecord.reason}`,
        url: window.location.href
      }).then(() => {
        this.toastService.success('Éxito', 'Historia clínica compartida');
      }).catch(err => {
        console.log('Error sharing:', err);
        this.fallbackShare();
      });
    } else {
      this.fallbackShare();
    }
  }

  createFollowUp() {
    if (!this.medicalRecord) return;
    
    // Navegar al formulario de nueva historia clínica con datos pre-poblados
    this.router.navigate(['/medical-records/new'], {
      queryParams: {
        petId: this.medicalRecord.petId,
        followUp: this.recordId,
        reason: 'Seguimiento de: ' + this.medicalRecord.reason
      }
    });
  }

  // Métodos auxiliares
  private generatePDFContent(): string {
    if (!this.medicalRecord || !this.pet) return '';
    
    return `
==============================================
           HISTORIA CLÍNICA VETERINARIA
==============================================

INFORMACIÓN DE LA MASCOTA:
- Nombre: ${this.pet.name}
- Especie: ${this.pet.species.toUpperCase()}
- Raza: ${this.pet.breed || 'No especificada'}
- Edad: ${this.pet.age || 'No especificada'} años
- Género: ${this.pet.gender}

INFORMACIÓN DE LA CONSULTA:
- Fecha: ${new Date(this.medicalRecord.date).toLocaleDateString('es-ES')}
- Veterinario: ${this.medicalRecord.veterinarian}
- Motivo: ${this.medicalRecord.reason}

SÍNTOMAS:
${this.medicalRecord.symptoms || 'No reportados'}

DIAGNÓSTICO:
${this.medicalRecord.diagnosis}

TRATAMIENTO:
${this.medicalRecord.treatment}

SIGNOS VITALES:
- Peso: ${this.medicalRecord.weight ? this.medicalRecord.weight + ' kg' : 'No registrado'}
- Temperatura: ${this.medicalRecord.temperature ? this.medicalRecord.temperature + '°C' : 'No registrada'}
- Frecuencia cardíaca: ${this.medicalRecord.heartRate ? this.medicalRecord.heartRate + ' bpm' : 'No registrada'}
- Frecuencia respiratoria: ${this.medicalRecord.respiratoryRate ? this.medicalRecord.respiratoryRate + ' rpm' : 'No registrada'}

MEDICAMENTOS PRESCRITOS:
${this.medicalRecord.medications?.map((med, index) => 
  `${index + 1}. ${med.name}
   - Dosis: ${med.dosage}
   - Frecuencia: ${med.frequency}
   - Duración: ${med.duration}
   - Instrucciones: ${med.instructions || 'Ninguna'}`
).join('\n') || 'No se prescribieron medicamentos'}

OBSERVACIONES:
${this.medicalRecord.observations || 'Ninguna'}

PRÓXIMA CITA:
${this.medicalRecord.nextAppointment ? new Date(this.medicalRecord.nextAppointment).toLocaleDateString('es-ES') : 'No programada'}

==============================================
Documento generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}
==============================================
    `;
  }

  private fallbackShare() {
    // Método alternativo para compartir (copiar al portapapeles)
    const shareText = `Historia Clínica de ${this.pet?.name} - ${this.medicalRecord?.date}\n${window.location.href}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        this.toastService.success('Éxito', 'Enlace copiado al portapapeles');
      });
    } else {
      // Método legacy para navegadores antiguos
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.toastService.success('Éxito', 'Enlace copiado al portapapeles');
    }
  }


}