class Vehiculos {
    constructor(conexion) {
        this.conexion = conexion;
    }

    async agregarVehiculo(vehiculo) {
        // Validación simple de datos
        if (!vehiculo.descripcion || !vehiculo.placa) {
            console.error('Error: Falta información requerida.');
            return false;
        }
        
        try {
            const sql = `
                INSERT INTO tblvehiculos
                (strDescripcion, enumTipoVehiculo, strModelo, strAño, dcmPrecio, enumCategoriaAuto, dateFechaPublicacion, strPlaca, dcmKilometraje, intIdCiudad, intIdMarca, intIdConcesionario, bigintIdentificacionUs, strimagenes)
                VALUES (?, ?, ?, ?, ?, ?,CURRENT_DATE(), ?, ?, ?, ?, ?, ?)`;

            const params = [
                vehiculo.descripcion,          // strDescripcion
                vehiculo.tipoVehiculo,         // enumTipoVehiculo
                vehiculo.modelo,               // strModelo
                vehiculo.anio,                 // strAño
                parseFloat(vehiculo.precio),   // dcmPrecio (asegúrate de convertirlo a float)
                vehiculo.CategoriaAuto,        // enumCategoriaAuto
                vehiculo.placa,                // strPlaca
                parseFloat(vehiculo.kilometraje), // dcmKilometraje (asegúrate de convertirlo a float)
                vehiculo.idCiudad,             // intIdCiudad
                vehiculo.idMarca,              // intIdMarca
                vehiculo.idConcesionario,      // intIdConcesionario
                parseInt(vehiculo.idUsuario),  // bigintIdentificacionUs (asegúrate de convertirlo a int)
                vehiculo.imagenes              // strimagenes (aquí usa el string concatenado de nombres)
            ];

            const resultado = await this.conexion.query(sql, params);
            return resultado.affectedRows > 0;
        } catch (error) {
            console.error('Error al agregar vehículo:', error.message);
            return false;
        }
    }
}
module.exports = Vehiculos;
