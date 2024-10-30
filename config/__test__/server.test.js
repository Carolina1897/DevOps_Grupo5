const request = require('supertest');
const express = require('express');
const path = require('path');
const clsConexion = require('../clsConexion.js');
const clsUsuarios = require('../clsUsuarios.js');
const clsVehiculos = require('../clsVenderVehiculo.js');
const cors = require('cors');
const multer = require('multer');
const sessionstorage = require('express-session');
const { domainToASCII } = require('url');
require('dotenv').config();

const app = express();

// Configura tus middleware y rutas aquí, como en el código original...
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Incluyan el resto de tu configuración aquí, rutas etc... de ser necesario

// Test de los endpoints
describe('API Endpoints', () => {
    let conexion;
    let usuarios;
    let vehiculos;

    beforeAll(async () => {
        // Configura la conexión a la base de datos
        const dbConfig = {
            host: process.env.host,
            user: process.env.user,
            password: process.env.password,
            database: process.env.database,
        };

        conexion = new clsConexion(dbConfig);
        await conexion.open();
        usuarios = new clsUsuarios(conexion);
        vehiculos = new clsVehiculos(conexion);
    });

    afterAll(async () => {
        await conexion.close();
    });

    test('GET / - deberia retornar el archivo index.html', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.header['content-type']).toEqual(expect.stringContaining('html'));
    });

    test('POST /usuarios - deberia crear un nuevo usuario', async () => {
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

        const response = await request(app).post('/usuarios').send(nuevoUsuario);
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Usuario registrado');
    });

    test('POST /ingresar - deberia permitir el ingreso de un usuario', async () => {
        const usuario = {
            email: 'john.doe@example.com',
            contrasena: 'Password123',
        };

        const response = await request(app).post('/ingresar').send(usuario);
        expect(response.statusCode).toBe(200);
        expect(response.body.mensaje).toBe('Ingreso exitoso');
    });

    test('GET /ciudades - deberia listar las ciudades', async () => {
        const response = await request(app).get('/ciudades');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /marcas - deberia listar las marcas', async () => {
        const response = await request(app).get('/marcas');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /concesionarios - deberia listar los concesionarios', async () => {
        const response = await request(app).get('/concesionarios');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /vehiculos - deberia subir un nuevo vehiculo', async () => {
        const nuevoVehiculo = {
            descripcion: 'Descripción del vehículo',
            tipoVehiculo: 'Sedán',
            modelo: '2024',
            anio: '2024',
            precio: '20000',
            categoriaAuto: 'SUV',
            placa: 'ABC123',
            kilometraje: '0',
            idCiudad: '1',
            idMarca: '1',
            idConcesionario: null,
            idUsuario: '1',
        };

        const response = await request(app)
            .post('/vehiculos')
            .field('descripcion', nuevoVehiculo.descripcion)
            .field('tipoVehiculo', nuevoVehiculo.tipoVehiculo)
            .field('modelo', nuevoVehiculo.modelo)
            .field('anio', nuevoVehiculo.anio)
            .field('precio', nuevoVehiculo.precio)
            .field('categoriaAuto', nuevoVehiculo.categoriaAuto)
            .field('placa', nuevoVehiculo.placa)
            .field('kilometraje', nuevoVehiculo.kilometraje)
            .field('idCiudad', nuevoVehiculo.idCiudad)
            .field('idMarca', nuevoVehiculo.idMarca)
            .field('idConcesionario', nuevoVehiculo.idConcesionario)
            .field('idUsuario', nuevoVehiculo.idUsuario)
            .attach('carImages', 'path/to/your/test/image.jpg'); // Cambia a la ruta a la imagen de sus pruebas especficas esto solo es un ejemplo

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Vehículo agregado correctamente');
    });
});



// Nota: Estos ejemplos fueron creados basados unicamente en el archivo por lo cual no se probaron debido a la falta de la base de datos 
// En caso de que no pasen los test se deben ajustar dependiendo su logica personalbar, el ambiente quedo listo para el desarrollo de pruebas unitarias.