const mysql = require("mysql2");
const dbConfig = require("../config/dbConnection");

const connection = mysql.createConnection(dbConfig);

class Semanas {
  constructor(id, curso_id, nombre) {
    this.id = id;
    this.curso_id = curso_id;
    this.nombre = nombre;
  }

  save(callback) {
    const query = "INSERT INTO Semanas (curso_id, nombre) VALUES (?, ?)";
    const values = [this.curso_id, this.nombre];
    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        this.id = results.insertId;
        callback(null, this);
      }
    });
  }
  delete(callback) {
    const query = "DELETE FROM Semanas WHERE id = ?";
    const values = [this.id];
    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error);
      } else {
        callback(null);
      }
    });
  }

  static getAll(callback) {
    const query = "SELECT * FROM Semanas";
    connection.query(query, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        const semanas = results.map(
          (row) => new Semanas(row.id, row.curso_id, row.nombre)
        );
        callback(null, semanas);
      }
    });
  }

  // Otras funciones del modelo, como update(), delete(), etc.
}

module.exports = Semanas;
