export interface MedicalRecord {
  _id?: string;
  petId: string;
  pet?: {
    _id: string;
    name: string;
    species: string;
    breed: string;
    photo?: string;
  };
  date: string;
  veterinarian: string;
  reason: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  medications: Medication[];
  weight?: number;
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
  observations: string;
  nextAppointment?: string;
  attachments?: Attachment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Attachment {
  _id?: string;
  name: string;
  type: 'image' | 'document' | 'xray' | 'lab-result';
  url: string;
  uploadDate: string;
}

export interface MedicalRecordSummary {
  totalRecords: number;
  lastVisit?: string;
  chronicConditions: string[];
  allergies: string[];
  vaccinationStatus: 'up-to-date' | 'overdue' | 'unknown';
}