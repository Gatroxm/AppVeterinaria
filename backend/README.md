# 🏥 Veterinary Backend API

Backend para aplicación veterinaria desarrollado con Node.js, TypeScript, Express y MongoDB.

## 🚀 Características

- ✅ **Autenticación JWT** completa con registro, login y gestión de perfiles
- ✅ **Gestión de Mascotas** - CRUD completo para registrar y administrar mascotas
- ✅ **Sistema de Citas** - Programación y gestión de citas veterinarias
- ✅ **Expedientes Médicos** - Historial médico completo con diagnósticos, tratamientos y vacunas
- ✅ **Documentación Swagger** - API completamente documentada
- ✅ **Roles de Usuario** - Usuario, Veterinario, Administrador
- ✅ **Validaciones** - Validación robusta de datos de entrada
- ✅ **Manejo de Errores** - Sistema centralizado de manejo de errores

## 📋 Requisitos Previos

- Node.js >= 18.0.0
- MongoDB >= 4.4
- npm o yarn

## ⚡ Instalación Rápida

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   # Copiar y editar el archivo .env
   cp .env.example .env
   ```
   
   Editar `.env` con tus configuraciones:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/veterinaria_db
   JWT_SECRET=tu_super_secreto_jwt_aqui
   JWT_EXPIRES_IN=7d
   ```

3. **Iniciar MongoDB** (si usas MongoDB local):
   ```bash
   # Windows
   mongod
   
   # macOS/Linux
   sudo service mongod start
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

5. **Acceder a la documentación:**
   - API Docs: http://localhost:3000/api-docs
   - Health Check: http://localhost:3000/health

## 📖 Documentación API

### 🔐 Autenticación

#### Registrar Usuario
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "password": "123456",
  "phone": "+52 555 123 4567"
}
```

#### Iniciar Sesión
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@email.com",
  "password": "123456"
}
```

### 🐾 Gestión de Mascotas

#### Registrar Mascota
```bash
POST /api/pets
Authorization: Bearer <tu_token>
Content-Type: application/json

{
  "name": "Firulais",
  "species": "dog",
  "breed": "Labrador",
  "dateOfBirth": "2020-05-15",
  "gender": "male",
  "weight": 25.5,
  "color": "Golden"
}
```

#### Obtener Mascotas del Usuario
```bash
GET /api/pets
Authorization: Bearer <tu_token>
```

### 📅 Sistema de Citas

#### Crear Cita
```bash
POST /api/appointments
Authorization: Bearer <tu_token>
Content-Type: application/json

{
  "pet": "60d0fe4f5311236168a109ca",
  "appointmentDate": "2024-12-01T10:00:00.000Z",
  "serviceType": "consultation",
  "reason": "Chequeo general"
}
```

#### Obtener Citas
```bash
GET /api/appointments?status=pending&page=1&limit=10
Authorization: Bearer <tu_token>
```

### 🏥 Expedientes Médicos

#### Crear Registro Médico (Solo Veterinarios)
```bash
POST /api/medical-records
Authorization: Bearer <token_veterinario>
Content-Type: application/json

{
  "pet": "60d0fe4f5311236168a109ca",
  "recordType": "consultation",
  "diagnosis": "Otitis externa",
  "treatment": "Limpieza y medicación tópica",
  "medications": [
    {
      "name": "Otomaxin",
      "dosage": "3 gotas",
      "frequency": "Cada 8 horas",
      "duration": "7 días"
    }
  ],
  "notes": "Evitar que se moje las orejas"
}
```

## 🔑 Roles de Usuario

### 👤 Usuario (user)
- Registrar y gestionar sus mascotas
- Crear y ver sus citas
- Ver expedientes médicos de sus mascotas

### 🩺 Veterinario (veterinarian)
- Todo lo del usuario
- Crear y gestionar expedientes médicos
- Gestionar citas de todos los usuarios
- Actualizar estado de citas

### 👨‍💼 Administrador (admin)
- Acceso completo a todo el sistema
- Gestionar usuarios
- Ver estadísticas y reportes

## 🛠️ Scripts Disponibles

```bash
# Desarrollo con recarga automática
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar en producción
npm run start

# Ejecutar tests
npm test

# Linting
npm run lint
npm run lint:fix
```

## 📁 Estructura del Proyecto

```
src/
├── config/           # Configuraciones (DB, Swagger)
├── controllers/      # Controladores de rutas
├── middleware/       # Middlewares personalizados
├── models/          # Modelos de MongoDB
├── routes/          # Definición de rutas
└── index.ts         # Punto de entrada

dist/                # Código compilado (auto-generado)
```

## 🔧 Configuración de Producción

### Variables de Entorno Requeridas

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://tu-servidor/veterinaria_db
JWT_SECRET=un_secreto_muy_seguro_para_produccion
JWT_EXPIRES_IN=7d
```

### Compilar para Producción

```bash
# Compilar
npm run build

# Ejecutar
npm start
```

## 🐛 Debugging

### Logs de Desarrollo
Los logs incluyen:
- Conexiones a MongoDB
- Errores de validación
- Errores de autenticación
- Requests HTTP (Morgan)

### Health Check
```bash
GET /health
```

Respuesta:
```json
{
  "status": "OK",
  "message": "Veterinary API is running",
  "timestamp": "2024-10-05T12:00:00.000Z",
  "environment": "development"
}
```

## 📊 Base de Datos

### Modelos Principales

1. **User** - Usuarios del sistema (dueños, veterinarios, admins)
2. **Pet** - Mascotas registradas
3. **Appointment** - Citas programadas
4. **MedicalRecord** - Expedientes médicos completos

### Índices de MongoDB
- Búsquedas optimizadas por dueño, mascota y fecha
- Índices de texto para búsquedas semánticas
- Índices únicos para emails

## 🚀 Próximas Funcionalidades

- [ ] Sistema de notificaciones push
- [ ] Integración con servicios de email
- [ ] Subida de archivos/imágenes
- [ ] Sistema de pagos
- [ ] Reportes y estadísticas
- [ ] WebSocket para tiempo real
- [ ] Integración con laboratorios externos

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: support@veterinaria.com
- Issues: GitHub Issues
- Documentación: http://localhost:3000/api-docs