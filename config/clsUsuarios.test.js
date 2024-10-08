// clsUsuarios.test.js
const Usuarios = require('./clsUsuarios');
const Conexion = require('./clsConexion');

jest.mock('./clsConexion'); // Mockea el módulo de conexión

describe('Clase Usuarios', () => {
    let usuarios;
    let mockConexion;

    beforeEach(() => {
        mockConexion = new Conexion();
        usuarios = new Usuarios({});
        usuarios.conexion = mockConexion; // Asigna la conexión mock
    });

    afterEach(() => {
        jest.clearAllMocks(); // Limpia los mocks después de cada test
    });

    describe('agregarUsuario', () => {
        it('debería agregar un nuevo usuario correctamente', async () => {
            const usuario = {
                identificacion: 12345678,
                nombre: 'John',
                apellido: 'Doe',
                email: 'john.doe@example.com',
                contrasena: 'password123',
                telefono: '1234567890',
                direccion: '123 Main St',
                idCiudad: 1,
            };

            mockConexion.open.mockResolvedValue(); // Simula abrir la conexión
            mockConexion.query.mockResolvedValue({ affectedRows: 1 }); // Simula resultado de la consulta
            mockConexion.close.mockResolvedValue(); // Simula cerrar la conexión

            await usuarios.agregarUsuario(usuario);

            expect(mockConexion.open).toHaveBeenCalled();
            expect(mockConexion.query).toHaveBeenCalledWith(expect.any(String), [
                usuario.identificacion,
                usuario.nombre,
                usuario.apellido,
                usuario.email,
                usuario.contrasena,
                usuario.telefono,
                usuario.direccion,
                usuario.idCiudad,
            ]);
            expect(mockConexion.close).toHaveBeenCalled();
        });

        it('debería manejar errores al agregar un usuario', async () => {
            const usuario = { /* usuario de prueba */ };
            mockConexion.open.mockResolvedValue();
            mockConexion.query.mockRejectedValue(new Error('Error en la consulta'));
            mockConexion.close.mockResolvedValue();

            await usuarios.agregarUsuario(usuario);

            expect(mockConexion.open).toHaveBeenCalled();
            expect(mockConexion.query).toHaveBeenCalled();
            expect(mockConexion.close).toHaveBeenCalled();
        });
    });

    describe('ingresarUsuario', () => {
        it('debería iniciar sesión correctamente', async () => {
            const credenciales = {
                email: 'john.doe@example.com',
                contrasena: 'password123',
            };

            mockConexion.open.mockResolvedValue();
            mockConexion.query.mockResolvedValue([{ bigintIdentificacionUs: 12345678 }]); // Simula un usuario encontrado
            mockConexion.close.mockResolvedValue();

            const result = await usuarios.ingresarUsuario(credenciales);

            expect(mockConexion.open).toHaveBeenCalled();
            expect(mockConexion.query).toHaveBeenCalledWith(expect.any(String), [
                credenciales.email,
                credenciales.contrasena,
            ]);
            expect(mockConexion.close).toHaveBeenCalled();
            expect(result).toBe(1); // Debería devolver la longitud del resultado
        });

        it('debería manejar el error de inicio de sesión', async () => {
            const credenciales = { email: 'wrong@example.com', contrasena: 'wrongpassword' };
            mockConexion.open.mockResolvedValue();
            mockConexion.query.mockResolvedValue([]); // Simula que no se encontró el usuario
            mockConexion.close.mockResolvedValue();

            const result = await usuarios.ingresarUsuario(credenciales);

            expect(mockConexion.open).toHaveBeenCalled();
            expect(mockConexion.query).toHaveBeenCalled();
            expect(mockConexion.close).toHaveBeenCalled();
            expect(result).toBe(0); // Debería devolver 0 si no hay usuario
        });
    });
});
