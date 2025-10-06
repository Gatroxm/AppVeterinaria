import express from 'express';
import { body } from 'express-validator';
import {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord,
  getVaccinationHistory
} from '../controllers/medicalRecord.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /api/medical-records:
 *   post:
 *     summary: Crear registro médico (solo veterinarios)
 *     tags: [Medical Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pet
 *               - recordType
 *             properties:
 *               pet:
 *                 type: string
 *               recordType:
 *                 type: string
 *                 enum: [consultation, vaccination, surgery, diagnosis, treatment, prescription]
 *               diagnosis:
 *                 type: string
 *               treatment:
 *                 type: string
 *               medications:
 *                 type: array
 *                 items:
 *                   type: object
 *               vaccines:
 *                 type: array
 *                 items:
 *                   type: object
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registro médico creado exitosamente
 */
router.post('/', protect, authorize('veterinarian', 'admin'), [
  body('pet').isMongoId().withMessage('ID de mascota inválido'),
  body('recordType').isIn(['consultation', 'vaccination', 'surgery', 'diagnosis', 'treatment', 'prescription'])
    .withMessage('Tipo de registro inválido')
], createMedicalRecord);

/**
 * @swagger
 * /api/medical-records:
 *   get:
 *     summary: Obtener registros médicos
 *     tags: [Medical Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pet
 *         schema:
 *           type: string
 *       - in: query
 *         name: recordType
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de registros médicos
 */
router.get('/', protect, getMedicalRecords);

/**
 * @swagger
 * /api/medical-records/{id}:
 *   get:
 *     summary: Obtener registro médico por ID
 *     tags: [Medical Records]
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
 *         description: Registro médico encontrado
 */
router.get('/:id', protect, getMedicalRecordById);

/**
 * @swagger
 * /api/medical-records/{id}:
 *   put:
 *     summary: Actualizar registro médico (solo veterinarios)
 *     tags: [Medical Records]
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
 *         description: Registro médico actualizado
 */
router.put('/:id', protect, authorize('veterinarian', 'admin'), updateMedicalRecord);

/**
 * @swagger
 * /api/medical-records/{id}:
 *   delete:
 *     summary: Eliminar registro médico (solo veterinarios)
 *     tags: [Medical Records]
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
 *         description: Registro médico eliminado
 */
router.delete('/:id', protect, authorize('veterinarian', 'admin'), deleteMedicalRecord);

/**
 * @swagger
 * /api/medical-records/vaccination-history/{petId}:
 *   get:
 *     summary: Obtener historial de vacunación
 *     tags: [Medical Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historial de vacunación
 */
router.get('/vaccination-history/:petId', protect, getVaccinationHistory);

export default router;