import mongoose, { Schema, Document } from 'mongoose';

export interface IPet extends Document {
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed?: string;
  dateOfBirth?: Date;
  gender: 'male' | 'female' | 'unknown';
  weight?: number;
  color?: string;
  photo?: string;
  owner: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PetSchema = new Schema<IPet>({
  name: {
    type: String,
    required: [true, 'El nombre de la mascota es requerido'],
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  species: {
    type: String,
    required: [true, 'La especie es requerida'],
    enum: {
      values: ['dog', 'cat', 'bird', 'rabbit', 'other'],
      message: 'Especie no válida'
    }
  },
  breed: {
    type: String,
    trim: true,
    maxlength: [50, 'La raza no puede exceder 50 caracteres']
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return !value || value <= new Date();
      },
      message: 'La fecha de nacimiento no puede ser futura'
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    default: 'unknown'
  },
  weight: {
    type: Number,
    min: [0, 'El peso debe ser un número positivo'],
    max: [200, 'El peso no puede exceder 200 kg']
  },
  color: {
    type: String,
    trim: true,
    maxlength: [30, 'El color no puede exceder 30 caracteres']
  },
  photo: {
    type: String,
    trim: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El propietario es requerido']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for pet's age
PetSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  
  const today = new Date();
  const birth = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for pet's appointments
PetSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'pet',
  justOne: false
});

// Virtual for pet's medical records
PetSchema.virtual('medicalRecords', {
  ref: 'MedicalRecord',
  localField: '_id',
  foreignField: 'pet',
  justOne: false
});

// Index for better query performance
PetSchema.index({ owner: 1, isActive: 1 });
PetSchema.index({ name: 'text', breed: 'text' });

export const Pet = mongoose.model<IPet>('Pet', PetSchema);