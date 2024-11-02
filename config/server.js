const express = require('express');
const path = require('path');
const clsConexion = require('./clsConexion.js');
const clsUsuarios = require('./clsUsuarios.js');
const clsVehiculos = require('./clsVenderVehiculo.js');
const cors = require('cors');
const multer = require('multer');
const sessionstorage = require('express-session');
require('dotenv').config()

// Crear una instancia de Express
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './config/public/imagenesautos/'); // Guardar en la carpeta uploads
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
let usuario;

// Configuración de la conexión a la base de datos
const dbConfig = {
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    port:process.env.port,
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
        app.post("/ingresar",async (req, res) =>{
            const resultado = await usuarios.ingresarUsuario(req.body)
            
            if ( resultado){
                usuario=resultado;
                data ={
                    mensaje: 'Ingreso exitoso',
                    usuario: resultado
                }
                res.status(200).send(data);
                
            }
            else {
                res.status(404).send('no se pudo ingresar');
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
                
                

                
                // Crear un objeto vehículo con los datos recibidos
                const nuevoVehiculo = {
                    descripcion: req.body.descripcion,
                    tipoVehiculo:req.body.tipoVehiculo,
                    modelo:req.body.modelo,
                    anio:req.body.anio,
                    precio:req.body.precio,
                    CategoriaAuto:req.body.categoriaAuto,
                    placa:req.body.placa,
                    kilometraje:req.body.kilometraje,
                    idCiudad:req.body.idCiudad,
                    idMarca:req.body.idMarca,
                    idConcesionario:req.body.idConcesionario==''?null:req.body.idConcesionario,
                    usuario:parseInt(req.body.idUsuario),
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
