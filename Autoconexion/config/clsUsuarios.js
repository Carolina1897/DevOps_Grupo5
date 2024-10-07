// clsUsuarios.js
const Conexion = require('./clsConexion');

class Usuarios {
constructor(config) {
    this.conexion = new Conexion(config);
}

  // Método para agregar un nuevo usuario
async agregarUsuario(usuario) {
    try {
        await this.conexion.open(); // Abre la conexión
        const sql = `
            INSERT INTO tblusuario
            (bigintIdentificacionUs, strNombreUs, strApellidoUs, strEmailUs, strContrasenaUs, strTelefonoUs, strDireccionUs, intIdCiudad)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [
            usuario.identificacion,
            usuario.nombre,
            usuario.apellido,
            usuario.email,
            usuario.contrasena,
            usuario.telefono,
            usuario.direccion,
            usuario.idCiudad,
        ];
        const resultado = await this.conexion.query(sql, params);
        console.log('Usuario agregado:', resultado);
    } catch (error) {
        console.error('Error al agregar usuario:', error.message); // Cambia aquí para mostrar el mensaje del error
    } finally {
        await this.conexion.close(); // Cierra la conexión
    }
}

//funcion para que ingresen a la pagina
async ingresarUsuario(credenciales) {
    try {
        await this.conexion.open(); // Abre la conexión
        const sql = `
            SELECT bigintIdentificacionUs FROM tblusuario WHERE strEmailUs=? AND strContrasenaUs=?`;
        const params = [
            credenciales.email,
            credenciales.contrasena,
        ];
        const resultado = await this.conexion.query(sql, params);
        
        if(resultado.length){
            console.log('Inicio exitoso:', resultado);
        }
        else {
            console.log('Error al iniciar sesion')
        }
        return resultado.length;
    } catch (error) {
        return false;
    } finally {
        await this.conexion.close(); // Cierra la conexión
    }
}

}

module.exports = Usuarios;

