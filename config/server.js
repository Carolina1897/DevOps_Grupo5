// server.js
const express = require('express');
const path = require('path');
const clsConexion = require('./clsConexion.js'); // Asegúrate de que la ruta sea correcta
const clsUsuarios = require('./clsUsuarios.js'); // Importa tu clase clsUsuarios
const cors = require('cors');

// Crear una instancia de Express
const app = express();

app.use(cors())

// Configurar el puerto
const port = process.env.PORT || 3000;

// Configuración de la conexión a la base de datos
const dbConfig = {
    host: 'bkpnggnd0ehhmipfczuh-mysql.services.clever-cloud.com',
    user: 'u5e29vsn1maqolo5',
    password: '1C5HI3nzbgvp2INwfBRf',
    database: 'bkpnggnd0ehhmipfczuh',
};

// Crear una instancia de la clase de conexión
const conexion = new clsConexion(dbConfig);
const usuarios = new clsUsuarios(dbConfig); // Crea una instancia de clsUsuarios

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para servir el archivo index.html desde la carpeta 'views'
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
    

    // Llamar al método agregarUsuario de la clase clsUsuarios
        await usuarios.agregarUsuario(nuevoUsuario);
        res.status(200).send('Usuario registrado');
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).send('Error al registrar usuario');
    }
});

//ENDPOINT PARA INGRESO DE USUARIOS 
app.post("/ingresar",async (req, res) =>{
const resultado = usuarios.ingresarUsuario(req.body)
if (await resultado){
    res.status(200).send('Ingreso exitoso');
    
}
else {
    res.status(404).send('no se pudo ingresar');
}

})
// Abrir la conexión a la base de datos al iniciar el servidor
conexion.open()
    .then(() => {
        console.log('Conexión a la base de datos abierta.');

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
