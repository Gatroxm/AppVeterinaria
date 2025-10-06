import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Pet } from '../models/Pet';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createPet = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array()
    });
  }

  const petData = {
    ...req.body,
    owner: req.user.id
  };

  const pet = await Pet.create(petData);

  res.status(201).json({
    success: true,
    message: 'Mascota registrada exitosamente',
    data: pet
  });
});

export const getPets = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const pets = await Pet.find({ 
    owner: req.user.id, 
    isActive: true 
  }).populate('owner', 'name email');

  res.status(200).json({
    success: true,
    count: pets.length,
    data: pets
  });
});

export const getPetById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const pet = await Pet.findOne({
    _id: req.params.id,
    owner: req.user.id,
    isActive: true
  }).populate('owner', 'name email');

  if (!pet) {
    return res.status(404).json({
      success: false,
      message: 'Mascota no encontrada'
    });
  }

  res.status(200).json({
    success: true,
    data: pet
  });
});

export const updatePet = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const pet = await Pet.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!pet) {
    return res.status(404).json({
      success: false,
      message: 'Mascota no encontrada'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Mascota actualizada exitosamente',
    data: pet
  });
});

export const deletePet = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const pet = await Pet.findOne({
    _id: req.params.id,
    owner: req.user.id
  });

  if (!pet) {
    return res.status(404).json({
      success: false,
      message: 'Mascota no encontrada'
    });
  }

  pet.isActive = false;
  await pet.save();

  res.status(200).json({
    success: true,
    message: 'Mascota eliminada exitosamente'
  });
});

export const uploadPetPhoto = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Placeholder for photo upload functionality
  res.status(200).json({
    success: true,
    message: 'Funcionalidad de subida de fotos en desarrollo'
  });
});