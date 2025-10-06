# 🏥 Sistema de Gestión Veterinaria - AppVeterinaria

Sistema completo de gestión veterinaria con arquitectura moderna, desarrollado con **Node.js + TypeScript** en el backend y **Angular 17** en el frontend. Incluye gestión de mascotas, citas médicas, historiales clínicos y sistema de roles con autenticación JWT.

## 🏗️ Arquitectura del Sistema

### **Stack Tecnológico**

#### 🔧 Backend (API REST)
- **Runtime**: Node.js 18+
- **Lenguaje**: TypeScript 5.0+
- **Framework**: Express.js 4.18
- **Base de Datos**: MongoDB 7.0+ con Mongoose ODM
- **Autenticación**: JWT (JSON Web Tokens)
- **Documentación**: Swagger/OpenAPI 3.0
- **Seguridad**: Helmet, CORS, bcrypt
- **Validación**: express-validator
- **Logging**: Morgan
- **Compresión**: compression middleware

#### 🎨 Frontend (SPA)
- **Framework**: Angular 17 (Standalone Components)
- **Lenguaje**: TypeScript 5.0+
- **UI Framework**: Angular Material + Tailwind CSS
- **HTTP**: HttpClient con Interceptores
- **Estado**: RxJS + BehaviorSubject
- **Routing**: Angular Router con Guards
- **Forms**: Reactive Forms (FormBuilder)
- **Build**: esbuild + Angular CLI

#### 🗄️ Base de Datos
- **Motor**: MongoDB (NoSQL Document Database)
- **Esquemas**: Mongoose con TypeScript interfaces
- **Indexing**: Índices optimizados para consultas
- **Validación**: Schema validation + custom validators

## 🚀 Configuración del Entorno de Desarrollo

### **Prerrequisitos**
```bash
# Verificar versiones instaladas
node --version    # v18.0.0 o superior
npm --version     # v9.0.0 o superior
git --version     # Para control de versiones
```

### **Instalación MongoDB**

#### Windows:
```powershell
# Descargar MongoDB Community Edition
# https://www.mongodb.com/try/download/community
# O usar MongoDB Atlas (cloud)

# Verificar instalación
mongod --version
```

#### Linux/Ubuntu:
```bash
sudo apt-get install mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Docker (Alternativa):
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

### **🔧 Configuración Inicial**

#### 1. Clonar e Instalar
```bash
git clone <repository-url>
cd AppVeterinaria

# Backend
cd backend
npm install
cp .env.example .env  # Configurar variables de entorno

# Frontend  
cd ../frontend
npm install
```

#### 2. Variables de Entorno (backend/.env)
```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de Datos
MONGODB_URI=mongodb://localhost:27017/veterinaria_db

# Autenticación JWT
JWT_SECRET=tu_super_secreto_jwt_cambiar_en_produccion
JWT_EXPIRES_IN=7d

# Servicios externos (Opcional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email (Opcional)
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
```

#### 3. Inicialización Automática
```powershell
# Desde la raíz del proyecto (Windows)
.\init.ps1

# Manual (Linux/Mac)
cd backend && npm run dev &
cd frontend && ng serve &
```

## 🏛️ Arquitectura de Componentes

### **Backend - Estructura MVC**
```
backend/
├── src/
│   ├── config/          # Configuraciones (DB, Swagger)
│   ├── controllers/     # Controladores de rutas
│   ├── middleware/      # Middlewares (auth, errors)
│   ├── models/          # Modelos de Mongoose
│   ├── routes/          # Definición de rutas
│   └── index.ts         # Punto de entrada
├── .env                 # Variables de entorno
├── package.json
└── tsconfig.json
```

### **Frontend - Arquitectura Angular**
```
frontend/
├── src/
│   ├── app/
│   │   ├── core/           # Servicios, guards, interceptores
│   │   │   ├── guards/     # AuthGuard, RoleGuard
│   │   │   ├── interceptors/ # HTTP Interceptor (JWT)
│   │   │   ├── models/     # Interfaces TypeScript
│   │   │   └── services/   # Servicios de negocio
│   │   ├── features/       # Componentes de funcionalidades
│   │   │   ├── auth/       # Login, Register
│   │   │   ├── dashboard/  # Panel principal
│   │   │   ├── pets/       # Gestión de mascotas
│   │   │   ├── appointments/ # Citas médicas
│   │   │   └── medical-records/ # Historiales
│   │   ├── shared/         # Componentes compartidos
│   │   └── app.component.ts
│   ├── environments/       # Configuraciones por entorno
│   └── styles/            # Estilos globales (Tailwind)
├── angular.json
├── tailwind.config.js
└── tsconfig.json
```

## 🔗 URLs y Endpoints del Sistema

### **URLs Principales**
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000/api
- **Documentación**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

### **Endpoints de API Principales**
```
# Autenticación
POST /api/auth/login
POST /api/auth/register
PUT  /api/auth/change-password

# Usuarios
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users (admin)

# Mascotas
GET    /api/pets
POST   /api/pets
GET    /api/pets/:id
PUT    /api/pets/:id
DELETE /api/pets/:id

# Citas
GET    /api/appointments
POST   /api/appointments
GET    /api/appointments/:id
PUT    /api/appointments/:id
DELETE /api/appointments/:id

# Historiales Médicos (Requiere rol veterinario)
GET    /api/medical-records
POST   /api/medical-records
GET    /api/medical-records/:id
PUT    /api/medical-records/:id
DELETE /api/medical-records/:id
```

## 🔑 Sistema de Autenticación y Roles

### **Credenciales de Prueba**
| Rol | Email | Contraseña | Permisos |
|-----|-------|------------|----------|
| **Usuario** | juan@email.com | 123456 | Ver sus mascotas y citas |
| **Veterinario** | carlos@veterinaria.com | 123456 | Crear historiales, gestionar citas |
| **Administrador** | admin@veterinaria.com | 123456 | Acceso completo al sistema |

### **Flujo de Autenticación**
1. **Login**: Usuario envía credenciales
2. **Validación**: Backend verifica con bcrypt
3. **Token JWT**: Generación y firma con secret
4. **Interceptor**: Frontend adjunta token en headers
5. **Middleware**: Backend valida token en rutas protegidas
6. **Autorización**: Verificación de roles específicos

## 🗄️ Modelo de Datos

### **Esquemas Principales**

#### User (Usuario)
```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string; // bcrypt hash
  phone?: string;
  role: 'user' | 'veterinarian' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Pet (Mascota)
```typescript
interface Pet {
  _id: ObjectId;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  weight?: number;
  color?: string;
  owner: ObjectId; // ref: User
  createdAt: Date;
  updatedAt: Date;
}
```

#### MedicalRecord (Historia Clínica)
```typescript
interface MedicalRecord {
  _id: ObjectId;
  petId: ObjectId; // ref: Pet
  veterinarian: ObjectId; // ref: User
  date: Date;
  reason: string;
  symptoms?: string;
  diagnosis?: string;
  treatment?: string;
  medications: Medication[];
  weight?: number;
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
  observations?: string;
  nextAppointment?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## 📋 Funcionalidades Implementadas

### ✅ **Sistema de Autenticación**
- Login/Logout con JWT
- Registro de usuarios
- Protección de rutas con Guards
- Sistema de roles (User/Veterinarian/Admin)
- Interceptor HTTP para tokens automáticos

### ✅ **Gestión de Mascotas**
- CRUD completo de mascotas
- Filtros por especie y propietario
- Validación de datos del formulario
- Interfaz responsive con Material + Tailwind

### ✅ **Sistema de Citas**
- Programación de citas médicas
- Estados: pendiente, confirmada, completada, cancelada
- Tipos: consulta, vacunación, cirugía, emergencia
- Calendario de disponibilidad

### ✅ **Historiales Médicos**
- Creación de registros médicos (solo veterinarios)
- Medicamentos con dosis y frecuencias
- Signos vitales (peso, temperatura, frecuencias)
- Exportación a PDF y compartir
- Sistema de seguimiento

### ✅ **Dashboard Interactivo**
- Estadísticas en tiempo real
- Información del usuario y rol
- Próximas vacunaciones
- Citas pendientes y mascotas registradas

### ✅ **Sistema de Notificaciones**
- Toast notifications para feedback
- Alertas de error detalladas
- Mensajes de éxito en operaciones

## 🚀 Comandos de Desarrollo

### **Desarrollo Backend**
```bash
cd backend
npm run dev        # Servidor con hot-reload
npm run build      # Compilar TypeScript
npm start          # Servidor producción
npm test           # Ejecutar tests
npm run lint       # Linting del código
```

### **Desarrollo Frontend**
```bash
cd frontend
ng serve           # Servidor desarrollo (puerto 4200)
ng build           # Build para producción
ng test            # Ejecutar tests unitarios
ng e2e            # Tests end-to-end
ng lint           # Linting del código
```

### **Base de Datos**
```bash
cd backend
node seed.js       # Poblar con datos de prueba
mongosh            # Consola MongoDB
```

## 🔧 Configuración de Producción

### **Variables de Entorno Producción**
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/veterinaria
JWT_SECRET=super_secreto_seguro_random_256_bits
FRONTEND_URL=https://tudominio.com
```

### **Build y Deploy**
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
ng build --configuration production
# Servir archivos estáticos con nginx/apache
```

## 📊 Monitoreo y Logs

### **Health Check**
```bash
curl http://localhost:3000/health
# Response: {"status":"OK","timestamp":"...","environment":"development"}
```

### **Logs del Sistema**
- **Morgan**: HTTP request logging
- **Console**: Application events
- **MongoDB**: Database connection status

## 🤝 Contribución

### **Estructura de Commits**
```
feat: nueva funcionalidad
fix: corrección de errores  
docs: actualización documentación
style: cambios de formato
refactor: refactorización de código
test: agregando tests
```

### **Flujo de Desarrollo**
1. Fork del repositorio
2. Crear branch: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push branch: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

---

**🏥 Desarrollado para modernizar la gestión veterinaria con tecnologías de vanguardia**

## 🎯 Comandos del Script de Inicialización

### **Script Automático (init.ps1)**
```powershell
# Ejecutar desde la raíz del proyecto
.\init.ps1
```

**Comandos disponibles después de la inicialización:**
- `logs` - Mostrar logs de ambos servidores
- `status` - Ver estado de los trabajos en ejecución  
- `stop` - Detener ambos servidores
- `restart` - Reiniciar servicios
- `exit` - Salir y detener todo

## 🧪 Datos de Prueba

### **Inicialización de Base de Datos**
```bash
cd backend
node seed.js    # Poblar con datos de ejemplo
```

### **Datos Pre-cargados**
- **3 usuarios** (user, veterinario, admin)
- **5 mascotas** de diferentes especies
- **8 citas médicas** con varios estados
- **6 historiales médicos** detallados
- **Medicamentos y tratamientos** de ejemplo

## � Resolución de Problemas Comunes

### **Error 403 al crear historias clínicas**
```
Problema: No tienes permisos para crear historias clínicas
Solución: Inicia sesión como veterinario (carlos@veterinaria.com / 123456)
```

### **Error de conexión a MongoDB**
```bash
# Windows
net start MongoDB

# Docker
docker run -d -p 27017:27017 mongo:7.0

# Verificar conexión
mongosh --eval "db.adminCommand('ping')"
```

### **Puerto 4200 o 3000 ocupado**
```bash
# Verificar procesos
netstat -ano | findstr :4200
netstat -ano | findstr :3000

# Cambiar puertos en package.json o environment
```

### **Problemas de CORS**
```typescript
// backend/src/index.ts - Ya configurado
app.use(cors({
  origin: ['http://localhost:4200', 'https://tudominio.com'],
  credentials: true
}));
```

## 📈 Métricas y Performance

### **Optimizaciones Implementadas**
- **Lazy Loading**: Componentes cargados bajo demanda
- **Compresión**: Middleware de compresión en backend
- **Índices MongoDB**: Consultas optimizadas
- **HTTP Caching**: Headers de cache apropiados
- **Tree Shaking**: Bundle optimizado con esbuild

### **Monitoreo**
```bash
# Memoria y CPU
npm run dev    # Muestra estadísticas de desarrollo

# Bundle size (frontend)
ng build --stats-json
npx webpack-bundle-analyzer dist/frontend/stats.json
```

## 🔒 Seguridad Implementada

### **Backend Security**
- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de origen cruzado
- **Rate Limiting**: Prevención de ataques DDoS
- **Input Validation**: express-validator
- **Password Hashing**: bcrypt con salt rounds
- **JWT Tokens**: Firma y verificación segura

### **Frontend Security**
- **Route Guards**: Protección de rutas
- **HTTP Interceptors**: Manejo automático de tokens
- **XSS Protection**: Sanitización de datos
- **HTTPS Redirect**: En producción

## 🧰 Testing

### **Backend Tests**
```bash
cd backend
npm test                    # Unit tests con Jest
npm run test:coverage      # Coverage report
npm run test:e2e           # End-to-end tests
```

### **Frontend Tests**
```bash
cd frontend
ng test                     # Unit tests con Jasmine/Karma
ng e2e                      # E2E tests con Cypress
ng test --code-coverage     # Coverage report
```

### **API Testing**
- **Swagger UI**: http://localhost:3000/api-docs
- **Postman Collection**: Disponible en `/docs`
- **curl examples**: En documentación de endpoints

## � Deploy y CI/CD

### **Docker Support**
```dockerfile
# Dockerfile.backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["npm", "start"]

# Dockerfile.frontend  
FROM nginx:alpine
COPY dist/frontend/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### **GitHub Actions (CI/CD)**
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci && npm test
      - run: docker build -t app .
      - run: docker push registry/app:latest
```

## 📚 Recursos Adicionales

### **Documentación Técnica**
- [Angular 17 Guide](https://angular.io/guide)
- [Express.js Documentation](https://expressjs.com/)  
- [MongoDB Manual](https://docs.mongodb.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### **APIs y Servicios Externos**
- **Cloudinary**: Para subida de imágenes
- **SendGrid**: Para notificaciones por email
- **Stripe**: Para pagos (futuro)
- **Google Maps**: Para ubicación de clínicas

---

**🏥 Sistema completo de gestión veterinaria - Listo para producción**  
**Desarrollado con las mejores prácticas de desarrollo moderno**