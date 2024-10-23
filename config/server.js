const express = require('express');
const path = require('path');
const clsConexion = require('./clsConexion.js');
const clsUsuarios = require('./clsUsuarios.js');
const clsVehiculos = require('./clsVenderVehiculo.js');
const cors = require('cors');
const multer = require('multer');

// Crear una instancia de Express
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/imagenesautos');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // Limitar a 1 MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Tipos permitidos
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb('Error: Tipo de archivo no permitido.');
    }
});

// Configurar el puerto
const port = process.env.PORT || 3000;

// Configuración de la conexión a la base de datos
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'luisa',
    database: 'dboAutoConexion',
};

// Crear una instancia de la clase de conexión
const conexion = new clsConexion(dbConfig);

// Abrir la conexión a la base de datos
conexion.open()
    .then(() => {
        console.log('Conexión a la base de datos abierta.');

        const vehiculos = new clsVehiculos(conexion);
        const usuarios = new clsUsuarios(conexion);

        // Ruta principal
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
        });

        // Ruta para manejar la creación de un nuevo usuario
        app.post('/usuarios', async (req, res) => {
            try {
                const { nombre, apellido, identificacion, contrasena, email, direccion, telefono, idCiudad } = req.body;

                // Crear un objeto usuario con los datos recibidos
                const nuevoUsuario = {
                    nombre,
                    apellido,
                    identificacion,
                    contrasena,
                    email,
                    direccion,
                    telefono,
                    idCiudad,
                };

                await usuarios.agregarUsuario(nuevoUsuario);
                res.status(200).send('Usuario registrado');
            } catch (err) {
                console.error('Error al registrar usuario:', err);
                res.status(500).send('Error al registrar usuario');
            }
        });

        // Endpoint para ingreso de usuarios
        app.post('/ingresar', async (req, res) => {
            try {
                const resultado = await usuarios.ingresarUsuario(req.body);
                resultado ? res.status(200).send('Ingreso exitoso') : res.status(404).send('No se pudo ingresar');
            } catch (error) {
                console.error('Error al ingresar usuario:', error);
                res.status(500).send('Error del servidor');
            }
        });

        // Endpoint para listar ciudades
        app.get('/ciudades', async (req, res) => {
            try {
                const ciudades = await conexion.query('SELECT intIdCiudad, strCiudad FROM tblciudad');
                res.status(200).json(ciudades);
            } catch (error) {
                console.error('Error al obtener ciudades:', error);
                res.status(500).send('Error al obtener ciudades');
            }
        });

        // Endpoint para listar marcas
        app.get('/marcas', async (req, res) => {
            try {
                const marcas = await conexion.query('SELECT intIdMarca, strMarca FROM tblmarca');
                res.status(200).json(marcas);
            } catch (error) {
                console.error('Error al obtener marcas:', error);
                res.status(500).send('Error al obtener marcas');
            }
        });

        // Endpoint para listar concesionarios
        app.get('/concesionarios', async (req, res) => {
            try {
                const concesionarios = await conexion.query('SELECT intIdConcesionario, strNombreConcesionario FROM tblconcesionario');
                res.status(200).json(concesionarios);
            } catch (error) {
                console.error('Error al obtener concesionarios:', error);
                res.status(500).send('Error al obtener concesionarios');
            }
        });

        // Ruta para subir un vehículo
        app.post('/vehiculos', upload.array('carImages'), async (req, res) => {
            try {
                console.log(req.files);
                console.log(req.body);
                const {
                    descripcion,
                    tipoVehiculo,
                    modelo,
                    anio,
                    precio,
                    CategoriaAuto,
                    placa,
                    kilometraje,
                    idCiudad,
                    idMarca,
                    idConcesionario,
                } = req.body;

                const idUsuario = req.body.idUsuario;
                // Crear un objeto vehículo con los datos recibidos
                const nuevoVehiculo = {
                    descripcion,
                    tipoVehiculo,
                    modelo,
                    anio,
                    precio,
                    CategoriaAuto,
                    placa,
                    kilometraje,
                    idCiudad,
                    idMarca,
                    idConcesionario,
                    idUsuario,
                    imagenes: req.files.map(file => file.originalname).join(',')// Concatenar nombres de imágenes
                };

                const resultado = await vehiculos.agregarVehiculo(nuevoVehiculo);
                resultado ? res.status(200).send('Vehículo agregado correctamente') : res.status(500).send('Error al agregar vehículo');
            } catch (error) {
                console.error('Error al subir vehículo:', error);
                res.status(500).send('Error del servidor');
            }
        });

        // Iniciar el servidor
        app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}`);
        });

    })
    .catch((error) => {
        console.error('Error al abrir la conexión a la base de datos:', error);
    });

// Cerrar la conexión cuando se detiene el servidor
process.on('SIGINT', () => {
    conexion.close()
        .then(() => {
            console.log('Conexión a la base de datos cerrada.');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Error al cerrar la conexión:', error);
            process.exit(1);
        });
});
