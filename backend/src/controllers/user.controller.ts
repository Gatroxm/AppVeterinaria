import { Response, NextFunction } from 'express';
import { User } from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const users = await User.find({ isActive: true }).select('-password');

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

/**
 * @desc    Get single user
 * @route   GET /api/users/:id
 * @access  Private
 */
export const getUserById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id).populate('pets');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Usuario actualizado exitosamente',
    data: user
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  // Soft delete by setting isActive to false
  user.isActive = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Usuario eliminado exitosamente'
  });
});