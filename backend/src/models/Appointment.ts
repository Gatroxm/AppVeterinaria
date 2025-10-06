import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  pet: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  veterinarian?: mongoose.Types.ObjectId;
  appointmentDate: Date;
  serviceType: 'consultation' | 'vaccination' | 'surgery' | 'checkup' | 'emergency' | 'grooming';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason?: string;
  notes?: string;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
  pet: {
    type: Schema.Types.ObjectId,
    ref: 'Pet',
    required: [true, 'La mascota es requerida']
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El propietario es requerido']
  },
  veterinarian: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  appointmentDate: {
    type: Date,
    required: [true, 'La fecha de la cita es requerida'],
    validate: {
      validator: function(value: Date) {
        return value > new Date();
      },
      message: 'La fecha de la cita debe ser futura'
    }
  },
  serviceType: {
    type: String,
    required: [true, 'El tipo de servicio es requerido'],
    enum: {
      values: ['consultation', 'vaccination', 'surgery', 'checkup', 'emergency', 'grooming'],
      message: 'Tipo de servicio no válido'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  reason: {
    type: String,
    trim: true,
    maxlength: [500, 'La razón no puede exceder 500 caracteres']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Las notas no pueden exceder 1000 caracteres']
  },
  price: {
    type: Number,
    min: [0, 'El precio debe ser un número positivo']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to populate pet and owner data
AppointmentSchema.virtual('petData', {
  ref: 'Pet',
  localField: 'pet',
  foreignField: '_id',
  justOne: true
});

AppointmentSchema.virtual('ownerData', {
  ref: 'User',
  localField: 'owner',
  foreignField: '_id',
  justOne: true
});

AppointmentSchema.virtual('veterinarianData', {
  ref: 'User',
  localField: 'veterinarian',
  foreignField: '_id',
  justOne: true
});

// Index for better query performance
AppointmentSchema.index({ appointmentDate: 1, status: 1 });
AppointmentSchema.index({ owner: 1, status: 1 });
AppointmentSchema.index({ veterinarian: 1, appointmentDate: 1 });
AppointmentSchema.index({ pet: 1 });

// Pre-validate to ensure appointment time doesn't conflict
AppointmentSchema.pre('save', async function(next) {
  if (!this.isModified('appointmentDate') && !this.isNew) {
    return next();
  }

  // Check for conflicting appointments (same veterinarian, overlapping time)
  if (this.veterinarian) {
    const startTime = new Date(this.appointmentDate);
    const endTime = new Date(this.appointmentDate.getTime() + 60 * 60 * 1000); // 1 hour later

    const conflictingAppointment = await mongoose.model('Appointment').findOne({
      veterinarian: this.veterinarian,
      appointmentDate: {
        $gte: startTime,
        $lt: endTime
      },
      status: { $in: ['confirmed', 'pending'] },
      _id: { $ne: this._id }
    });

    if (conflictingAppointment) {
      const error = new Error('El veterinario ya tiene una cita programada en este horario');
      return next(error);
    }
  }

  next();
});

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);