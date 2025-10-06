const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/veterinaria_db');

// Definir schemas básicos (versión simplificada)
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    role: { type: String, enum: ['user', 'veterinarian', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const PetSchema = new mongoose.Schema({
    name: String,
    species: { type: String, enum: ['dog', 'cat', 'bird', 'rabbit', 'other'] },
    breed: String,
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'unknown'] },
    weight: Number,
    color: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const AppointmentSchema = new mongoose.Schema({
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    veterinarian: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appointmentDate: Date,
    serviceType: { type: String, enum: ['consultation', 'vaccination', 'surgery', 'checkup', 'emergency', 'grooming'] },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    reason: String,
    notes: String,
    price: Number
}, { timestamps: true });

const MedicalRecordSchema = new mongoose.Schema({
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' },
    veterinarian: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    recordType: { type: String, enum: ['consultation', 'vaccination', 'surgery', 'diagnosis', 'treatment', 'prescription'] },
    diagnosis: String,
    treatment: String,
    medications: [{
        name: String,
        dosage: String,
        frequency: String,
        duration: String
    }],
    vaccines: [{
        name: String,
        batch: String,
        expirationDate: Date,
        nextDose: Date
    }],
    notes: String
}, { timestamps: true });

// Crear modelos
const User = mongoose.model('User', UserSchema);
const Pet = mongoose.model('Pet', PetSchema);
const Appointment = mongoose.model('Appointment', AppointmentSchema);
const MedicalRecord = mongoose.model('MedicalRecord', MedicalRecordSchema);

async function seedDatabase() {
    try {
        // Limpiar base de datos existente
        await User.deleteMany({});
        await Pet.deleteMany({});
        await Appointment.deleteMany({});
        await MedicalRecord.deleteMany({});

        console.log('🗑️ Base de datos limpiada');

        // Hash password para usuarios
        const hashedPassword = await bcrypt.hash('123456', 10);

        // Crear usuarios
        const users = await User.create([
            {
                name: 'Juan Pérez',
                email: 'juan@email.com',
                password: hashedPassword,
                phone: '+52 555 123 4567',
                role: 'user'
            },
            {
                name: 'María García',
                email: 'maria@email.com',
                password: hashedPassword,
                phone: '+52 555 234 5678',
                role: 'user'
            },
            {
                name: 'Dr. Carlos Veterinario',
                email: 'carlos@veterinaria.com',
                password: hashedPassword,
                phone: '+52 555 345 6789',
                role: 'veterinarian'
            },
            {
                name: 'Admin Sistema',
                email: 'admin@veterinaria.com',
                password: hashedPassword,
                phone: '+52 555 456 7890',
                role: 'admin'
            }
        ]);

        console.log('👥 Usuarios creados:', users.length);

        // Crear mascotas
        const pets = await Pet.create([
            {
                name: 'Firulais',
                species: 'dog',
                breed: 'Labrador Retriever',
                dateOfBirth: new Date('2020-05-15'),
                gender: 'male',
                weight: 30.5,
                color: 'Golden',
                owner: users[0]._id
            },
            {
                name: 'Miau',
                species: 'cat',
                breed: 'Siames',
                dateOfBirth: new Date('2021-03-10'),
                gender: 'female',
                weight: 4.2,
                color: 'Blanco y Negro',
                owner: users[0]._id
            },
            {
                name: 'Luna',
                species: 'cat',
                breed: 'Persa',
                dateOfBirth: new Date('2019-11-22'),
                gender: 'female',
                weight: 5.8,
                color: 'Gris',
                owner: users[1]._id
            },
            {
                name: 'Max',
                species: 'dog',
                breed: 'Pastor Alemán',
                dateOfBirth: new Date('2018-08-07'),
                gender: 'male',
                weight: 35.0,
                color: 'Negro y Café',
                owner: users[1]._id
            },
            {
                name: 'Piolín',
                species: 'bird',
                breed: 'Canario',
                dateOfBirth: new Date('2022-01-12'),
                gender: 'unknown',
                weight: 0.02,
                color: 'Amarillo',
                owner: users[0]._id
            }
        ]);

        console.log('🐕 Mascotas creadas:', pets.length);

        // Crear citas
        const appointments = await Appointment.create([
            {
                pet: pets[0]._id,
                owner: users[0]._id,
                veterinarian: users[2]._id,
                appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // En 2 días
                serviceType: 'checkup',
                status: 'confirmed',
                reason: 'Chequeo general anual',
                price: 500
            },
            {
                pet: pets[1]._id,
                owner: users[0]._id,
                appointmentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // En 5 días
                serviceType: 'vaccination',
                status: 'pending',
                reason: 'Vacuna antirrábica',
                price: 300
            },
            {
                pet: pets[2]._id,
                owner: users[1]._id,
                veterinarian: users[2]._id,
                appointmentDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Mañana
                serviceType: 'consultation',
                status: 'confirmed',
                reason: 'Revisión de ojos',
                price: 400
            },
            {
                pet: pets[3]._id,
                owner: users[1]._id,
                appointmentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Hace 2 días
                serviceType: 'consultation',
                status: 'completed',
                reason: 'Dolor en pata trasera',
                price: 450
            }
        ]);

        console.log('📅 Citas creadas:', appointments.length);

        // Crear registros médicos
        const medicalRecords = await MedicalRecord.create([
            {
                pet: pets[0]._id,
                veterinarian: users[2]._id,
                appointment: appointments[0]._id,
                recordType: 'vaccination',
                diagnosis: 'Animal sano',
                treatment: 'Vacunación completa',
                vaccines: [{
                    name: 'Antirrábica',
                    batch: 'VAC2024-001',
                    expirationDate: new Date('2025-12-31'),
                    nextDose: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                }],
                notes: 'Mascota en excelente estado de salud'
            },
            {
                pet: pets[3]._id,
                veterinarian: users[2]._id,
                appointment: appointments[3]._id,
                recordType: 'diagnosis',
                diagnosis: 'Esguince leve en pata trasera izquierda',
                treatment: 'Reposo y antiinflamatorio',
                medications: [{
                    name: 'Carprofeno',
                    dosage: '25mg',
                    frequency: 'Cada 12 horas',
                    duration: '7 días'
                }],
                notes: 'Evitar ejercicio intenso por una semana'
            },
            {
                pet: pets[2]._id,
                veterinarian: users[2]._id,
                recordType: 'consultation',
                diagnosis: 'Conjuntivitis leve',
                treatment: 'Gotas oftálmicas',
                medications: [{
                    name: 'Tobramicina',
                    dosage: '2 gotas',
                    frequency: 'Cada 8 horas',
                    duration: '5 días'
                }],
                notes: 'Mantener área ocular limpia'
            }
        ]);

        console.log('🏥 Registros médicos creados:', medicalRecords.length);

        console.log('\n✅ ¡Base de datos poblada exitosamente!');
        console.log('\n📊 Resumen de datos:');
        console.log(`   👥 Usuarios: ${users.length}`);
        console.log(`   🐕 Mascotas: ${pets.length}`);
        console.log(`   📅 Citas: ${appointments.length}`);
        console.log(`   🏥 Registros médicos: ${medicalRecords.length}`);

        console.log('\n🔑 Credenciales de prueba:');
        console.log('   Usuario: juan@email.com - 123456');
        console.log('   Usuario: maria@email.com - 123456');
        console.log('   Veterinario: carlos@veterinaria.com - 123456');
        console.log('   Admin: admin@veterinaria.com - 123456');

    } catch (error) {
        console.error('❌ Error poblando la base de datos:', error);
    } finally {
        mongoose.disconnect();
    }
}

// Ejecutar el seeding
seedDatabase();