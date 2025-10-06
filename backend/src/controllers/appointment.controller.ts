import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Appointment } from '../models/Appointment';
import { Pet } from '../models/Pet';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createAppointment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array()
    });
  }

  // Verify pet belongs to user
  const pet = await Pet.findOne({ _id: req.body.pet, owner: req.user.id });
  if (!pet) {
    return res.status(400).json({
      success: false,
      message: 'Mascota no encontrada'
    });
  }

  const appointmentData = {
    ...req.body,
    owner: req.user.id
  };

  const appointment = await Appointment.create(appointmentData);
  await appointment.populate('pet owner');

  res.status(201).json({
    success: true,
    message: 'Cita creada exitosamente',
    data: appointment
  });
});

export const getAppointments = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { status, page = 1, limit = 10 } = req.query;
  
  const query: any = {};
  
  if (req.user.role === 'user') {
    query.owner = req.user.id;
  }
  
  if (status) {
    query.status = status;
  }

  const appointments = await Appointment.find(query)
    .populate('pet', 'name species breed')
    .populate('owner', 'name email phone')
    .populate('veterinarian', 'name email')
    .sort({ appointmentDate: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  const total = await Appointment.countDocuments(query);

  res.status(200).json({
    success: true,
    count: appointments.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: appointments
  });
});

export const getAppointmentById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const query: any = { _id: req.params.id };
  
  if (req.user.role === 'user') {
    query.owner = req.user.id;
  }

  const appointment = await Appointment.findOne(query)
    .populate('pet')
    .populate('owner', 'name email phone')
    .populate('veterinarian', 'name email');

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'Cita no encontrada'
    });
  }

  res.status(200).json({
    success: true,
    data: appointment
  });
});

export const updateAppointment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const query: any = { _id: req.params.id };
  
  if (req.user.role === 'user') {
    query.owner = req.user.id;
  }

  const appointment = await Appointment.findOneAndUpdate(
    query,
    req.body,
    { new: true, runValidators: true }
  ).populate('pet owner veterinarian');

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'Cita no encontrada'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Cita actualizada exitosamente',
    data: appointment
  });
});

export const deleteAppointment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const query: any = { _id: req.params.id };
  
  if (req.user.role === 'user') {
    query.owner = req.user.id;
  }

  const appointment = await Appointment.findOne(query);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'Cita no encontrada'
    });
  }

  appointment.status = 'cancelled';
  await appointment.save();

  res.status(200).json({
    success: true,
    message: 'Cita cancelada exitosamente'
  });
});

export const getAvailableSlots = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Placeholder for available slots logic
  res.status(200).json({
    success: true,
    message: 'Funcionalidad de horarios disponibles en desarrollo',
    data: []
  });
});