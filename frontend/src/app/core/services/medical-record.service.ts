import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { MedicalRecord, MedicalRecordSummary } from '../models/medical-record.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private apiUrl = `${environment.apiUrl}/medical-records`;
  private medicalRecordsSubject = new BehaviorSubject<MedicalRecord[]>([]);
  public medicalRecords$ = this.medicalRecordsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Obtener todas las historias clínicas
  getMedicalRecords(): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(this.apiUrl);
  }

  // Obtener historias clínicas por mascota
  getMedicalRecordsByPet(petId: string): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${this.apiUrl}/pet/${petId}`);
  }

  // Obtener una historia clínica por ID
  getMedicalRecordById(id: string): Observable<MedicalRecord> {
    return this.http.get<MedicalRecord>(`${this.apiUrl}/${id}`);
  }

  // Crear nueva historia clínica
  createMedicalRecord(medicalRecord: Partial<MedicalRecord>): Observable<MedicalRecord> {
    console.log('Creating medical record with data:', medicalRecord);
    console.log('API URL:', this.apiUrl);
    return this.http.post<MedicalRecord>(this.apiUrl, medicalRecord);
  }

  // Actualizar historia clínica
  updateMedicalRecord(id: string, medicalRecord: Partial<MedicalRecord>): Observable<MedicalRecord> {
    return this.http.put<MedicalRecord>(`${this.apiUrl}/${id}`, medicalRecord);
  }

  // Eliminar historia clínica
  deleteMedicalRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtener resumen médico de una mascota
  getMedicalSummary(petId: string): Observable<MedicalRecordSummary> {
    return this.http.get<MedicalRecordSummary>(`${this.apiUrl}/pet/${petId}/summary`);
  }

  // Buscar historias clínicas
  searchMedicalRecords(query: string): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${this.apiUrl}/search?q=${query}`);
  }

  // Subir archivo adjunto
  uploadAttachment(file: File, recordId: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${recordId}/attachments`, formData);
  }

  // Descargar archivo adjunto
  downloadAttachment(recordId: string, attachmentId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${recordId}/attachments/${attachmentId}`, {
      responseType: 'blob'
    });
  }

  // Generar reporte médico
  generateMedicalReport(petId: string, startDate?: string, endDate?: string): Observable<Blob> {
    let url = `${this.apiUrl}/pet/${petId}/report`;
    const params = [];
    if (startDate) params.push(`start=${startDate}`);
    if (endDate) params.push(`end=${endDate}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    
    return this.http.get(url, { responseType: 'blob' });
  }

  // Métodos auxiliares para el manejo local del estado
  updateLocalMedicalRecords(records: MedicalRecord[]) {
    this.medicalRecordsSubject.next(records);
  }

  addMedicalRecordLocal(record: MedicalRecord) {
    const currentRecords = this.medicalRecordsSubject.value;
    this.medicalRecordsSubject.next([record, ...currentRecords]);
  }

  updateMedicalRecordLocal(updatedRecord: MedicalRecord) {
    const currentRecords = this.medicalRecordsSubject.value;
    const index = currentRecords.findIndex(r => r._id === updatedRecord._id);
    if (index > -1) {
      currentRecords[index] = updatedRecord;
      this.medicalRecordsSubject.next([...currentRecords]);
    }
  }

  removeMedicalRecordLocal(recordId: string) {
    const currentRecords = this.medicalRecordsSubject.value;
    const filteredRecords = currentRecords.filter(r => r._id !== recordId);
    this.medicalRecordsSubject.next(filteredRecords);
  }
}