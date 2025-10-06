# 🏥 Sistema de Gestión Veterinaria

[![GitHub license](https://img.shields.io/github/license/Gatroxm/AppVeterinaria)](https://github.com/Gatroxm/AppVeterinaria/blob/master/LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Angular Version](https://img.shields.io/badge/angular-17.0-red)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-7.0-green)](https://www.mongodb.com/)

> Sistema completo de gestión veterinaria desarrollado con **Node.js + TypeScript** y **Angular 17**. 
> Incluye autenticación JWT, roles de usuario, gestión de mascotas, citas médicas e historiales clínicos.

## ⚡ Inicio Rápido

```bash
# Clonar el repositorio
git clone https://github.com/Gatroxm/AppVeterinaria.git
cd AppVeterinaria

# Opción 1: Script automático (Windows)
.\init.ps1

# Opción 2: Manual
# Backend
cd backend && npm install && npm run dev

# Frontend (nueva terminal)
cd frontend && npm install && ng serve
```

**URLs del Sistema:**
- 🖥️ Frontend: http://localhost:4200
- 🔧 Backend: http://localhost:3000
- 📚 API Docs: http://localhost:3000/api-docs

## 🔑 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| 👤 Usuario | juan@email.com | 123456 |
| 👨‍⚕️ Veterinario | carlos@veterinaria.com | 123456 |
| 👑 Admin | admin@veterinaria.com | 123456 |

## 🏗️ Tecnologías

<div align="center">

| Frontend | Backend | Base de Datos | Herramientas |
|----------|---------|---------------|--------------|
| ![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white) | ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) | ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) |
| ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | ![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) | ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logoColor=white) | ![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white) |

</div>

## 🌟 Características

### ✅ **Sistema de Autenticación**
- 🔐 Login/Logout con JWT
- 👥 Roles: Usuario, Veterinario, Administrador
- 🛡️ Rutas protegidas con Guards
- 🔒 Encriptación bcrypt

### ✅ **Gestión de Mascotas**
- 🐕 CRUD completo de mascotas
- 📋 Filtros por especie y propietario
- 📊 Información detallada (raza, edad, peso)
- 📸 Soporte para imágenes (futuro)

### ✅ **Sistema de Citas**
- 📅 Programación de citas médicas
- ⏰ Estados: pendiente, confirmada, completada
- 🏥 Tipos: consulta, vacunación, cirugía, emergencia
- 📧 Notificaciones automáticas (futuro)

### ✅ **Historiales Médicos**
- 📋 Registros médicos detallados
- 💊 Medicamentos con dosis y frecuencias
- 📈 Signos vitales (peso, temperatura, pulso)
- 📄 Exportación a PDF
- 🔗 Sistema de compartir

### ✅ **Dashboard Interactivo**
- 📊 Estadísticas en tiempo real
- 📈 Métricas de mascotas y citas
- 💉 Próximas vacunaciones
- ⚡ Acceso rápido a funciones

## 📁 Estructura del Proyecto

```
AppVeterinaria/
├── 📂 backend/              # API REST con Node.js + TypeScript
│   ├── src/
│   │   ├── controllers/     # Controladores MVC
│   │   ├── models/          # Modelos Mongoose
│   │   ├── routes/          # Definición de rutas
│   │   ├── middleware/      # Auth, validation, errors
│   │   └── config/          # DB, Swagger config
│   └── package.json
├── 📂 frontend/             # SPA Angular 17
│   ├── src/app/
│   │   ├── core/           # Services, guards, interceptors
│   │   ├── features/       # Componentes por funcionalidad
│   │   └── shared/         # Componentes compartidos
│   └── package.json
├── 📜 init.ps1            # Script de inicialización
├── 📖 README.md            # Este archivo
└── 📄 .gitignore           # Archivos ignorados por Git
```

## 🚀 Instalación Detallada

### **Prerrequisitos**
- Node.js ≥ 18.0.0
- npm ≥ 9.0.0
- MongoDB ≥ 7.0 (local o Atlas)
- Git

### **Configuración Backend**
```bash
cd backend
npm install
cp .env.example .env    # Configurar variables
npm run dev             # Iniciar servidor
```

### **Configuración Frontend**
```bash
cd frontend
npm install
ng serve                # http://localhost:4200
```

### **Base de Datos**
```bash
# Poblar con datos de prueba
cd backend
node seed.js
```

## 📊 API Endpoints

<details>
<summary>🔓 <strong>Autenticación</strong></summary>

```http
POST /api/auth/login          # Iniciar sesión
POST /api/auth/register       # Registrar usuario
PUT  /api/auth/change-password # Cambiar contraseña
```
</details>

<details>
<summary>🐾 <strong>Mascotas</strong></summary>

```http
GET    /api/pets              # Listar mascotas
POST   /api/pets              # Crear mascota
GET    /api/pets/:id          # Ver mascota
PUT    /api/pets/:id          # Actualizar mascota
DELETE /api/pets/:id          # Eliminar mascota
```
</details>

<details>
<summary>📅 <strong>Citas</strong></summary>

```http
GET    /api/appointments      # Listar citas
POST   /api/appointments      # Crear cita
GET    /api/appointments/:id  # Ver cita
PUT    /api/appointments/:id  # Actualizar cita
DELETE /api/appointments/:id  # Cancelar cita
```
</details>

<details>
<summary>🏥 <strong>Historiales (Veterinarios)</strong></summary>

```http
GET    /api/medical-records      # Listar historiales
POST   /api/medical-records      # Crear historial
GET    /api/medical-records/:id  # Ver historial
PUT    /api/medical-records/:id  # Actualizar historial
DELETE /api/medical-records/:id  # Eliminar historial
```
</details>

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test                # Unit tests
npm run test:coverage   # Coverage report

# Frontend tests
cd frontend
ng test                 # Unit tests
ng e2e                  # E2E tests
```

## 🚨 Solución de Problemas

### Error 403 - Forbidden
```
Problema: No tienes permisos para crear historiales médicos
Solución: Inicia sesión como veterinario (carlos@veterinaria.com / 123456)
```

### MongoDB Connection Error
```bash
# Verificar MongoDB
mongosh --eval "db.adminCommand('ping')"

# Iniciar servicio (Windows)
net start MongoDB

# Docker alternativo
docker run -d -p 27017:27017 mongo:7.0
```

### Puerto Ocupado
```bash
# Verificar puertos
netstat -ano | findstr :3000
netstat -ano | findstr :4200

# Cambiar puertos en .env o angular.json
```

## 🤝 Contribuir

1. **Fork** el repositorio
2. **Crear** branch: `git checkout -b feature/nueva-funcionalidad`
3. **Commit**: `git commit -m 'feat: agregar nueva funcionalidad'`
4. **Push**: `git push origin feature/nueva-funcionalidad`
5. **Pull Request**: Crear PR en GitHub

### Convenciones de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: actualización documentación
style: cambios de formato (no código)
refactor: refactorización
test: agregar/modificar tests
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Gatroxm**
- GitHub: [@Gatroxm](https://github.com/Gatroxm)
- Repository: [AppVeterinaria](https://github.com/Gatroxm/AppVeterinaria)

## 🙏 Agradecimientos

- Angular Team por el increíble framework
- MongoDB por la base de datos NoSQL
- Tailwind CSS por el sistema de diseño
- La comunidad open source

---

<div align="center">

**🏥 Hecho con ❤️ para modernizar la gestión veterinaria**

[![GitHub stars](https://img.shields.io/github/stars/Gatroxm/AppVeterinaria?style=social)](https://github.com/Gatroxm/AppVeterinaria/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Gatroxm/AppVeterinaria?style=social)](https://github.com/Gatroxm/AppVeterinaria/network/members)

</div>