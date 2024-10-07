class clsUsuarios {

constructor(idUsuario, idVendedor,nombre,email,contraseña,telefono,direccion,tipousuario,fecharegistro) {
        this.idUsuario =idUsuario;
        this.idVendedor =idVendedor;
        this.nombre =nombre;
        this.email =email;
    this.contraseña=contraseña;
    this.telefono=telefono;
    this.direccion=direccion;
    this.tipousuario=tipousuario;
    this.fecharegistro=fecharegistro;
}
registrarUsuario(){
    console.log(`Registrando usuario:
        ID Usuario: ${this.idUsuario},
        ID Vendedor: ${this.idVendedor},
        Nombre: ${this.nombre},
        Email: ${this.email},
        Contraseña: ${this.contraseña},
        Teléfono: ${this.telefono},
        Dirección: ${this.direccion},
        Tipo de Usuario: ${this.tipousuario},
        Fecha de Registro: ${this.fecharegistro}`
    );
    
}}
