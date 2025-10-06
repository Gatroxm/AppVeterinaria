import { Application } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Veterinary API',
      version: '1.0.0',
      description: 'API completa para aplicación veterinaria - Gestión de mascotas, citas y expedientes médicos',
      contact: {
        name: 'API Support',
        email: 'support@veterinaria.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server'
      },
      {
        url: 'https://api.veterinaria.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del usuario'
            },
            name: {
              type: 'string',
              description: 'Nombre completo del usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico único'
            },
            phone: {
              type: 'string',
              description: 'Número de teléfono'
            },
            role: {
              type: 'string',
              enum: ['user', 'veterinarian', 'admin'],
              default: 'user',
              description: 'Rol del usuario'
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Estado del usuario'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Pet: {
          type: 'object',
          required: ['name', 'species', 'owner'],
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string',
              description: 'Nombre de la mascota'
            },
            species: {
              type: 'string',
              enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
              description: 'Especie de la mascota'
            },
            breed: {
              type: 'string',
              description: 'Raza de la mascota'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'Fecha de nacimiento'
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'unknown'],
              description: 'Género de la mascota'
            },
            weight: {
              type: 'number',
              description: 'Peso en kilogramos'
            },
            color: {
              type: 'string',
              description: 'Color de la mascota'
            },
            photo: {
              type: 'string',
              description: 'URL de la foto'
            },
            owner: {
              type: 'string',
              description: 'ID del propietario'
            },
            isActive: {
              type: 'boolean',
              default: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Appointment: {
          type: 'object',
          required: ['pet', 'owner', 'appointmentDate', 'serviceType'],
          properties: {
            _id: {
              type: 'string'
            },
            pet: {
              type: 'string',
              description: 'ID de la mascota'
            },
            owner: {
              type: 'string',
              description: 'ID del propietario'
            },
            veterinarian: {
              type: 'string',
              description: 'ID del veterinario asignado'
            },
            appointmentDate: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha y hora de la cita'
            },
            serviceType: {
              type: 'string',
              enum: ['consultation', 'vaccination', 'surgery', 'checkup', 'emergency', 'grooming'],
              description: 'Tipo de servicio'
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'completed', 'cancelled'],
              default: 'pending',
              description: 'Estado de la cita'
            },
            reason: {
              type: 'string',
              description: 'Motivo de la consulta'
            },
            notes: {
              type: 'string',
              description: 'Notas adicionales'
            },
            price: {
              type: 'number',
              description: 'Precio del servicio'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        MedicalRecord: {
          type: 'object',
          required: ['pet', 'veterinarian', 'recordType'],
          properties: {
            _id: {
              type: 'string'
            },
            pet: {
              type: 'string',
              description: 'ID de la mascota'
            },
            veterinarian: {
              type: 'string',
              description: 'ID del veterinario'
            },
            appointment: {
              type: 'string',
              description: 'ID de la cita relacionada'
            },
            recordType: {
              type: 'string',
              enum: ['consultation', 'vaccination', 'surgery', 'diagnosis', 'treatment', 'prescription'],
              description: 'Tipo de registro médico'
            },
            diagnosis: {
              type: 'string',
              description: 'Diagnóstico'
            },
            treatment: {
              type: 'string',
              description: 'Tratamiento prescrito'
            },
            medications: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  dosage: { type: 'string' },
                  frequency: { type: 'string' },
                  duration: { type: 'string' }
                }
              },
              description: 'Medicamentos prescritos'
            },
            vaccines: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  batch: { type: 'string' },
                  expirationDate: { type: 'string', format: 'date' },
                  nextDose: { type: 'string', format: 'date' }
                }
              },
              description: 'Vacunas administradas'
            },
            attachments: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'URLs de archivos adjuntos'
            },
            notes: {
              type: 'string',
              description: 'Notas del veterinario'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Mensaje de error'
            },
            errors: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Lista detallada de errores'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Mensaje de éxito'
            },
            data: {
              type: 'object',
              description: 'Datos de respuesta'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/models/*.ts'
  ]
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Application): void => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Veterinary API Documentation'
  }));

  // JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log('📚 Swagger documentation setup complete');
};