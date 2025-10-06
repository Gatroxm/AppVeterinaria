import express from 'express';
import { body } from 'express-validator';
import {
  createPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
  uploadPetPhoto
} from '../controllers/pet.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Registrar nueva mascota
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - species
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Firulais"
 *               species:
 *                 type: string
 *                 enum: [dog, cat, bird, rabbit, other]
 *               breed:
 *                 type: string
 *                 example: "Labrador"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [male, female, unknown]
 *               weight:
 *                 type: number
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mascota registrada exitosamente
 */
router.post('/', protect, [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('species').isIn(['dog', 'cat', 'bird', 'rabbit', 'other']).withMessage('Especie inválida')
], createPet);

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Obtener mascotas del usuario
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mascotas
 */
router.get('/', protect, getPets);

/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: Obtener mascota por ID
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mascota encontrada
 */
router.get('/:id', protect, getPetById);

/**
 * @swagger
 * /api/pets/{id}:
 *   put:
 *     summary: Actualizar mascota
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mascota actualizada
 */
router.put('/:id', protect, updatePet);

/**
 * @swagger
 * /api/pets/{id}:
 *   delete:
 *     summary: Eliminar mascota
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mascota eliminada
 */
router.delete('/:id', protect, deletePet);

/**
 * @swagger
 * /api/pets/{id}/upload-photo:
 *   post:
 *     summary: Subir foto de mascota
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Foto subida exitosamente
 */
router.post('/:id/upload-photo', protect, uploadPetPhoto);

export default router;