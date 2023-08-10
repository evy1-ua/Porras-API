const mysql = require('mysql2');
const dbConfig = require('../config/dbConnection');

const connection = mysql.createConnection(dbConfig);


class Categoria {
  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
  }

  // Función para crear una nueva categoría
  static create(nombre, callback) {
    const sql = 'INSERT INTO Categoria (nombre) VALUES (?)';
    db.query(sql, [nombre], (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        const nuevaCategoria = new Categoria(result.insertId, nombre);
        callback(null, nuevaCategoria);
      }
    });
  }

  // Función para obtener una categoría por su ID
  static getById(id, callback) {
    const sql = 'SELECT * FROM Categoria WHERE id = ?';
    db.query(sql, [id], (error, rows) => {
      if (error) {
        callback(error, null);
      } else if (rows.length === 0) {
        callback(null, null); // No se encontró la categoría
      } else {
        const categoria = new Categoria(rows[0].id, rows[0].nombre);
        callback(null, categoria);
      }
    });
  }

  // Función para actualizar una categoría por su ID
  update(callback) {
    const sql = 'UPDATE Categoria SET nombre = ? WHERE id = ?';
    db.query(sql, [this.nombre, this.id], (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, this);
      }
    });
  }

  // Función para eliminar una categoría por su ID
  static deleteById(id, callback) {
    const sql = 'DELETE FROM Categoria WHERE id = ?';
    db.query(sql, [id], (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, result.affectedRows > 0);
      }
    });
  }

  // Función estática para obtener todas las categorías
  static getAll(callback) {
    const sql = 'SELECT * FROM Categoria';
    db.query(sql, (error, rows) => {
      if (error) {
        callback(error, null);
      } else {
        const categorias = rows.map((row) => new Categoria(row.id, row.nombre));
        callback(null, categorias);
      }
    });
  }
}

module.exports = Categoria;
