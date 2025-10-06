import mongoose, { Schema, Document } from 'mongoose';

interface IMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface IVaccine {
  name: string;
  batch: string;
  expirationDate: Date;
  nextDose?: Date;
}

export interface IMedicalRecord extends Document {
  pet: mongoose.Types.ObjectId;
  veterinarian: mongoose.Types.ObjectId;
  appointment?: mongoose.Types.ObjectId;
  recordType: 'consultation' | 'vaccination' | 'surgery' | 'diagnosis' | 'treatment' | 'prescription';
  diagnosis?: string;
  treatment?: string;
  medications?: IMedication[];
  vaccines?: IVaccine[];
  attachments?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MedicationSchema = new Schema<IMedication>({
  name: {
    type: String,
    required: [true, 'El nombre del medicamento es requerido'],
    trim: true
  },
  dosage: {
    type: String,
    required: [true, 'La dosis es requerida'],
    trim: true
  },
  frequency: {
    type: String,
    required: [true, 'La frecuencia es requerida'],
    trim: true
  },
  duration: {
    type: String,
    required: [true, 'La duración es requerida'],
    trim: true
  }
}, { _id: false });

const VaccineSchema = new Schema<IVaccine>({
  name: {
    type: String,
    required: [true, 'El nombre de la vacuna es requerido'],
    trim: true
  },
  batch: {
    type: String,
    required: [true, 'El lote es requerido'],
    trim: true
  },
  expirationDate: {
    type: Date,
    required: [true, 'La fecha de expiración es requerida']
  },
  nextDose: {
    type: Date
  }
}, { _id: false });

const MedicalRecordSchema = new Schema<IMedicalRecord>({
  pet: {
    type: Schema.Types.ObjectId,
    ref: 'Pet',
    required: [true, 'La mascota es requerida']
  },
  veterinarian: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El veterinario es requerido']
  },
  appointment: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  recordType: {
    type: String,
    required: [true, 'El tipo de registro es requerido'],
    enum: {
      values: ['consultation', 'vaccination', 'surgery', 'diagnosis', 'treatment', 'prescription'],
      message: 'Tipo de registro no válido'
    }
  },
  diagnosis: {
    type: String,
    trim: true,
    maxlength: [1000, 'El diagnóstico no puede exceder 1000 caracteres']
  },
  treatment: {
    type: String,
    trim: true,
    maxlength: [1000, 'El tratamiento no puede exceder 1000 caracteres']
  },
  medications: [MedicationSchema],
  vaccines: [VaccineSchema],
  attachments: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Las notas no pueden exceder 2000 caracteres']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to populate pet data
MedicalRecordSchema.virtual('petData', {
  ref: 'Pet',
  localField: 'pet',
  foreignField: '_id',
  justOne: true
});

// Virtual to populate veterinarian data
MedicalRecordSchema.virtual('veterinarianData', {
  ref: 'User',
  localField: 'veterinarian',
  foreignField: '_id',
  justOne: true
});

// Virtual to populate appointment data
MedicalRecordSchema.virtual('appointmentData', {
  ref: 'Appointment',
  localField: 'appointment',
  foreignField: '_id',
  justOne: true
});

// Index for better query performance
MedicalRecordSchema.index({ pet: 1, createdAt: -1 });
MedicalRecordSchema.index({ veterinarian: 1, createdAt: -1 });
MedicalRecordSchema.index({ recordType: 1 });
MedicalRecordSchema.index({ 'vaccines.nextDose': 1 });

// Text index for searching in diagnosis, treatment, and notes
MedicalRecordSchema.index({
  diagnosis: 'text',
  treatment: 'text',
  notes: 'text'
});

export const MedicalRecord = mongoose.model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);