import express from 'express';
import { body } from 'express-validator';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAvailableSlots
} from '../controllers/appointment.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Crear nueva cita
 *     tags: [Appointments]
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
 *               - appointmentDate
 *               - serviceType
 *             properties:
 *               pet:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109ca"
 *               appointmentDate:
 *                 type: string
 *                 format: date-time
 *               serviceType:
 *                 type: string
 *                 enum: [consultation, vaccination, surgery, checkup, emergency, grooming]
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 */
router.post('/', protect, [
  body('pet').isMongoId().withMessage('ID de mascota inválido'),
  body('appointmentDate').isISO8601().withMessage('Fecha inválida'),
  body('serviceType').isIn(['consultation', 'vaccination', 'surgery', 'checkup', 'emergency', 'grooming'])
    .withMessage('Tipo de servicio inválido')
], createAppointment);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Obtener citas
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, completed, cancelled]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de citas
 */
router.get('/', protect, getAppointments);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Obtener cita por ID
 *     tags: [Appointments]
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
 *         description: Cita encontrada
 */
router.get('/:id', protect, getAppointmentById);

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Actualizar cita
 *     tags: [Appointments]
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
 *         description: Cita actualizada
 */
router.put('/:id', protect, updateAppointment);

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     summary: Cancelar cita
 *     tags: [Appointments]
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
 *         description: Cita cancelada
 */
router.delete('/:id', protect, deleteAppointment);

/**
 * @swagger
 * /api/appointments/available-slots:
 *   get:
 *     summary: Obtener horarios disponibles
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: veterinarian
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Horarios disponibles
 */
router.get('/available-slots', protect, getAvailableSlots);

export default router;