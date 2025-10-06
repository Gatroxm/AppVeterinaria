import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { CustomError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      const error = new Error('No autorizado para acceder a esta ruta') as CustomError;
      error.statusCode = 401;
      return next(error);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

      // Get user from token
      const user = await User.findById(decoded.id);
      if (!user) {
        const error = new Error('No se encontró el usuario con este token') as CustomError;
        error.statusCode = 401;
        return next(error);
      }

      if (!user.isActive) {
        const error = new Error('Usuario inactivo') as CustomError;
        error.statusCode = 401;
        return next(error);
      }

      req.user = user;
      next();
    } catch (err) {
      const error = new Error('Token inválido') as CustomError;
      error.statusCode = 401;
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user.role)) {
      const error = new Error(`Rol ${req.user.role} no autorizado para acceder a esta ruta`) as CustomError;
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};