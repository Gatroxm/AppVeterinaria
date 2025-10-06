import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet, CreatePetRequest } from '../models/pet.interface';
import { ApiResponse } from '../models/user.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Get all pets for the current user
   */
  getPets(): Observable<ApiResponse<Pet[]>> {
    return this.http.get<ApiResponse<Pet[]>>(`${this.apiUrl}/pets`);
  }

  /**
   * Get pet by ID
   */
  getPetById(id: string): Observable<ApiResponse<Pet>> {
    return this.http.get<ApiResponse<Pet>>(`${this.apiUrl}/pets/${id}`);
  }

  /**
   * Create new pet
   */
  createPet(petData: CreatePetRequest): Observable<ApiResponse<Pet>> {
    return this.http.post<ApiResponse<Pet>>(`${this.apiUrl}/pets`, petData);
  }

  /**
   * Update pet
   */
  updatePet(id: string, petData: Partial<CreatePetRequest>): Observable<ApiResponse<Pet>> {
    return this.http.put<ApiResponse<Pet>>(`${this.apiUrl}/pets/${id}`, petData);
  }

  /**
   * Delete pet
   */
  deletePet(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/pets/${id}`);
  }

  /**
   * Upload pet photo
   */
  uploadPhoto(id: string, photo: File): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('photo', photo);
    
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/pets/${id}/upload-photo`, formData);
  }
}
