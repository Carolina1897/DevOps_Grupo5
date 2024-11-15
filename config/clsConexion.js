// clsConexion.js
const mysql = require('mysql2');

class Conexion {
  constructor(config) {
    this.config = config;
    this.connection = null;
  }

  // Método para abrir la conexión
  open() {
    return new Promise((resolve, reject) => {
      this.connection = mysql.createConnection(this.config);
      this.connection.connect((err) => {
        if (err) {
          /*console.error('Error de conexión: ' + err.stack);*/
          reject(err);
        } else {
          console.log('Conectado a la base de datos como id ' + this.connection.threadId);
          resolve(this.connection);
        }
      });
    });
  }

  // Método para cerrar la conexión
  close() {
    return new Promise((resolve, reject) => {
      if (this.connection) {
        this.connection.end((err) => {
          if (err) {
            console.error('Error al cerrar la conexión: ' + err.stack);
            reject(err);
          } else {
            console.log('Conexión cerrada.');
            resolve();
          }
        });
      } else {
        resolve(); // Si no hay conexión, resuelve sin hacer nada
      }
    });
  }

  // Método para ejecutar consultas
  query(sql, params) {
    return new Promise((resolve, reject) => {
      if (!this.connection) {
        reject(new Error('La conexión no está abierta.'));
        return;
      }
      this.connection.query(sql, params, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = Conexion;
