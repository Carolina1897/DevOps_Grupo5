const request = require('supertest');
const express = require('express');
const path = require('path');
const clsConexion = require('../clsConexion.js');
const clsUsuarios = require('../clsUsuarios.js');
const clsVehiculos = require('../clsVenderVehiculo.js');
const cors = require('cors');
const multer = require('multer');
const sessionstorage = require('express-session');
require('dotenv').config();

// Mockear los módulos de base de datos
jest.mock('../clsConexion');
jest.mock('../clsUsuarios');
jest.mock('../clsVenderVehiculo');

// Configuración de la aplicación Express para pruebas
const app = express();
app.use(express.json());
app.use(cors());

// Configurar sesiones (si es necesario)
app.use(sessionstorage({
    secret: 'testSecret', // Cambia esto a una clave segura en producción
    resave: false,
    saveUninitialized: true,
}));

// Definir las rutas necesarias para los tests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/usuarios', async (req, res) => {
    // Lógica de creación de usuario usando clsUsuarios mockeado
    await clsUsuarios().agregarUsuario(req.body);
    res.status(200).send('Usuario registrado');
});

app.post('/ingresar', async (req, res) => {
    // Lógica de ingreso de usuario usando clsUsuarios mockeado
    const usuario = await clsUsuarios().ingresarUsuario(req.body.email, req.body.contrasena);
    res.status(200).json({ mensaje: 'Ingreso exitoso', usuario });
});

app.get('/ciudades', async (req, res) => {
    // Lógica para listar ciudades usando clsConexion mockeado
    const ciudades = await clsConexion().query('SELECT * FROM tblCiudad');
    res.status(200).json(ciudades);
});

app.post('/vehiculos', async (req, res) => {
    // Lógica para agregar un vehículo usando clsVehiculos mockeado
    await clsVehiculos().agregarVehiculo(req.body);
    res.status(200).send('Vehículo agregado correctamente');
});

describe('API Endpoints', () => {
    
    // Configuración de mocks para evitar conexiones reales a la base de datos
    beforeAll(() => {
        clsConexion.mockImplementation(() => ({
            open: jest.fn().mockResolvedValue(),
            close: jest.fn().mockResolvedValue(),
            query: jest.fn().mockResolvedValue([{ id: 1, nombre: 'Ciudad Mock' }])
        }));

        clsUsuarios.mockImplementation(() => ({
            agregarUsuario: jest.fn().mockResolvedValue(),
            ingresarUsuario: jest.fn().mockResolvedValue({ id: 1, nombre: 'Usuario Mock' })
        }));

        clsVehiculos.mockImplementation(() => ({
            agregarVehiculo: jest.fn().mockResolvedValue(true)
        }));
    });

    // Pruebas de los endpoints
    test('GET / - debería retornar el archivo index.html', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(404);
        expect(response.headers['content-type']).toMatch(/html/);
    });

    test('POST /usuarios - debería crear un nuevo usuario', async () => {
        const nuevoUsuario = {
            nombre: 'John',
            apellido: 'Doe',
            identificacion: '123456789',
            contrasena: 'Password123',
            email: 'john.doe@example.com',
            direccion: '123 Main St',
            telefono: '1234567890',
            idCiudad: 1,
        };

        const response = await request(app)
            .post('/usuarios')
            .send(nuevoUsuario);

        expect(response.status).toBe(200);
        expect(response.text).toBe('Usuario registrado');
    });

    test('POST /ingresar - debería permitir ingreso de usuario', async () => {
        const usuario = {
            email: 'john.doe@example.com',
            contrasena: 'Password123'
        };

        const response = await request(app)
            .post('/ingresar')
            .send(usuario);

        expect(response.status).toBe(200);
        expect(response.body.mensaje).toBe('Ingreso exitoso');
        expect(response.body).toHaveProperty('usuario');
    });

    test('GET /ciudades - debería listar todas las ciudades', async () => {
        const response = await request(app).get('/ciudades');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toEqual({ id: 1, nombre: 'Ciudad Mock' });
    });

    test('POST /vehiculos - debería agregar un nuevo vehículo', async () => {
        const nuevoVehiculo = {
            descripcion: 'Un vehículo nuevo',
            tipoVehiculo: 'Carro',
            modelo: 'Model X',
            anio: 2023,
            precio: 50000,
            categoriaAuto: 'SUV',
            placa: 'XYZ123',
            kilometraje: 1000,
            idCiudad: 1,
            idMarca: 2,
            idConcesionario: 3,
            idUsuario: 1,
            imagenes: 'imagen1.jpg,imagen2.jpg'
        };

        const response = await request(app)
            .post('/vehiculos')
            .send(nuevoVehiculo);

        expect(response.status).toBe(200);
        expect(response.text).toBe('Vehículo agregado correctamente');
    });
<<<<<<< HEAD
});
=======
});
>>>>>>> 8e8d7cd7ddb6b437e8dcac08d3227abc2e67bfbc
