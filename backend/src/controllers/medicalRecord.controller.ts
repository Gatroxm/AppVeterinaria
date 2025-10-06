import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { MedicalRecord } from '../models/MedicalRecord';
import { Pet } from '../models/Pet';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createMedicalRecord = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array()
    });
  }

  const recordData = {
    ...req.body,
    veterinarian: req.user.id
  };

  const medicalRecord = await MedicalRecord.create(recordData);
  await medicalRecord.populate('pet veterinarian');

  res.status(201).json({
    success: true,
    message: 'Registro médico creado exitosamente',
    data: medicalRecord
  });
});

export const getMedicalRecords = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { pet, recordType } = req.query;
  
  const query: any = {};
  
  if (pet) {
    query.pet = pet;
  }
  
  if (recordType) {
    query.recordType = recordType;
  }

  // If user is not veterinarian/admin, only show records for their pets
  if (req.user.role === 'user') {
    const userPets = await Pet.find({ owner: req.user.id }).select('_id');
    query.pet = { $in: userPets.map(p => p._id) };
  }

  const medicalRecords = await MedicalRecord.find(query)
    .populate('pet', 'name species breed')
    .populate('veterinarian', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: medicalRecords.length,
    data: medicalRecords
  });
});

export const getMedicalRecordById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const medicalRecord = await MedicalRecord.findById(req.params.id)
    .populate('pet')
    .populate('veterinarian', 'name email')
    .populate('appointment');

  if (!medicalRecord) {
    return res.status(404).json({
      success: false,
      message: 'Registro médico no encontrado'
    });
  }

  // Check if user owns the pet (for non-veterinarians)
  if (req.user.role === 'user') {
    const pet = await Pet.findOne({ _id: medicalRecord.pet, owner: req.user.id });
    if (!pet) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver este registro'
      });
    }
  }

  res.status(200).json({
    success: true,
    data: medicalRecord
  });
});

export const updateMedicalRecord = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const medicalRecord = await MedicalRecord.findById(req.params.id);

  if (!medicalRecord) {
    return res.status(404).json({
      success: false,
      message: 'Registro médico no encontrado'
    });
  }

  // Only allow the veterinarian who created it to update
  if (medicalRecord.veterinarian.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'No autorizado para actualizar este registro'
    });
  }

  const updatedRecord = await MedicalRecord.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('pet veterinarian');

  res.status(200).json({
    success: true,
    message: 'Registro médico actualizado exitosamente',
    data: updatedRecord
  });
});

export const deleteMedicalRecord = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const medicalRecord = await MedicalRecord.findById(req.params.id);

  if (!medicalRecord) {
    return res.status(404).json({
      success: false,
      message: 'Registro médico no encontrado'
    });
  }

  // Only allow the veterinarian who created it to delete
  if (medicalRecord.veterinarian.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'No autorizado para eliminar este registro'
    });
  }

  await MedicalRecord.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Registro médico eliminado exitosamente'
  });
});

export const getVaccinationHistory = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { petId } = req.params;

  // Check if user owns the pet (for non-veterinarians)
  if (req.user.role === 'user') {
    const pet = await Pet.findOne({ _id: petId, owner: req.user.id });
    if (!pet) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver este historial'
      });
    }
  }

  const vaccinationRecords = await MedicalRecord.find({
    pet: petId,
    recordType: 'vaccination',
    'vaccines.0': { $exists: true }
  })
    .populate('veterinarian', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: vaccinationRecords.length,
    data: vaccinationRecords
  });
});