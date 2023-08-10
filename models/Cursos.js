const mysql = require("mysql2");
const dbConfig = require("../config/dbConnection");

const connection = mysql.createConnection(dbConfig);

class Cursos {
  constructor(id, nombre, descripcion, foto, duracion, nivel, categoria) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.foto = foto;
    this.duracion = duracion;
    this.nivel = nivel;
    this.categoria = categoria;
  }
  //Funcion que guarda un Curso
  save(callback) {
    const query =
      "INSERT INTO Cursos (nombre,descripcion,foto,duracion,nivel,categoria) VALUES ( ?,?,?,?,?,?)";
    const values = [
      this.nombre,
      this.descripcion,
      this.foto,
      this.duracion,
      this.nivel,
      this.categoria,
    ];
    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        this.id = results.insertId;
        callback(null, this);
      }
    });
  }
  //Funcion que actualiza un curso
  update(callback) {
    const query =
      "UPDATE Invitaciones SET nombre = ?, descripcion = ? , foto = ? , duracion = ? , nivel = ? , categoria = ?   WHERE id = ?";
    const values = [this.estado, this.usuario_id, this.id];
    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, this);
      }
    });
  }
  // Funcion que borra un curso
  delete(callback) {
    const query = "DELETE FROM Cursos WHERE id = ?";
    const values = [this.id];
    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error);
      } else {
        callback(null);
      }
    });
  }
  // Función para agregar un profesor de supervisión a un curso
  addSupervision(id_profesor, callback) {
    const query =
      "INSERT INTO Supervision_Cursos (id_curso, id_profesor) VALUES (?, ?)";
    const values = [this.id, id_profesor];
    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results.insertId);
      }
    });
  }
  // Función para eliminar la supervisión de un profesor en un curso
  removeSupervision(id_profesor, callback) {
    const query =
      "DELETE FROM Supervision_Cursos WHERE id_curso = ? AND id_profesor = ?";
    const values = [this.id, id_profesor];
    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error);
      } else {
        callback(null);
      }
    });
  }
  // Función para obtener los profesores que supervisan un curso
  getSupervisingProfessors(callback) {
    const query =
      "SELECT id_profesor FROM Supervision_Cursos WHERE id_curso = ?";
    const values = [this.id];
    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        const professorIds = results.map((result) => result.id_profesor);
        callback(null, professorIds);
      }
    });
  }
  //Funcion que devuelve los tres ultimos cursos
  static getLastCourses(callback) {
    const query = "SELECT * FROM Cursos ORDER BY id DESC LIMIT 3";
    connection.query(query, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        const cursos = results.map((cursoRow) => {
          return new Cursos(
            cursoRow.id,
            cursoRow.nombre,
            cursoRow.descripcion,
            cursoRow.foto,
            cursoRow.duracion,
            cursoRow.nivel,
            cursoRow.categoria
          );
        });
        callback(null, cursos);
      }
    });
  }
  // Función para obtener las semanas de un curso por su ID
  static getSemanasByCursoId(cursoId, callback) {
    const query = 'SELECT * FROM Semanas WHERE curso_id = ?';
    const values = [cursoId];
    
    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        const semanas = results.map(result => ({
          id: result.id,
          nombre: result.nombre,
          // ... Otros campos de semana que necesites
        }));
        callback(null, semanas);
      }
    });
  }
}
module.exports = Cursos;
