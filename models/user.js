const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const dbConfig = require("../config/dbConnection");
//Inicio la conexión
const connection = mysql.createConnection(dbConfig);
class User {
  //Constructor de Usuario
  constructor(
    id,
    nombre,
    apellidos,
    fecha_nacimiento,
    fecha_ingreso,
    rol,
    foto,
    contraseña,
    correo_electronico,
    telefono,
    direccion
  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.fecha_nacimiento = fecha_nacimiento;
    this.fecha_ingreso = fecha_ingreso;
    this.rol = rol;
    this.foto = foto;
    this.contraseña = contraseña;
    this.correo_electronico = correo_electronico;
    this.telefono = telefono;
    this.direccion = direccion;
  }
  //Función que guarda un usuario
  save(callback) {
    const query =
      "INSERT INTO Usuarios (nombre, apellidos, fecha_nacimiento, fecha_ingreso, rol, foto, contraseña, correo_electronico , telefono, direccion) VALUES (?,?,?,?,?,?,?,?,?,?)";
    const values = [
      this.nombre,
      this.apellidos,
      this.fecha_nacimiento,
      this.fecha_ingreso,
      this.rol,
      this.foto,
      this.contraseña,
      this.correo_electronico,
      this.telefono,
      this.direccion,
    ];
    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        this.id = results.insertId;

        if (this.rol == "Estudiante") {
          const insertAlumnoQuery =
            "INSERT INTO Alumno (id) VALUES (?)";
          const alumnoValues = [this.id];
          connection.query(
            insertAlumnoQuery,
            alumnoValues,
            (error, alumnoResults) => {
              if (error) {
                return callback(error, null);
              }
              callback(null, this);
            }
          );
        } else if (this.rol == "Profesor") {
          const insertProfesorQuery =
            "INSERT INTO Profesor (id) VALUES (?)";
          const ProfesorValues = [this.id];
          connection.query(
            insertProfesorQuery,
            ProfesorValues,
            (error, ProfesorResults) => {
              if (error) {
                return callback(error, null);
              }
              callback(null, this);
            }
          );
        } else if (this.rol == "Administrador") {
          const insertAdminQuery =
            "INSERT INTO Admin (id) VALUES (?)";
          const AdminValues = [this.id];
          connection.query(
            insertAdminQuery,
            AdminValues,
            (error, AdminResults) => {
              if (error) {
                return callback(error, null);
              }
              callback(null, this);
            }
          );
        } else {
          callback(null, this);
        }
      }
    });
  }
  //Función que actualiza un Usuario
  update(callback) {
    const query =
      "UPDATE Usuarios SET nombre = ?, apellidos = ? , fecha_nacimiento = ?, fecha_ingreso = ?, rol = ? , foto = ?, contraseña = ?, correo_electronico  = ?, telefono = ? , direccion = ?  WHERE id = ?";
    const values = [
      this.nombre,
      this.apellidos,
      this.fecha_nacimiento,
      this.fecha_ingreso,
      this.rol,
      this.foto,
      this.contraseña,
      this.correo_electronico,
      this.telefono,
      this.direccion,
      this.id,
    ];
    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, this);
      }
    });
  }
  //Funcíon que borra un usuario
  delete(callback) {
    const query = "DELETE FROM Usuarios WHERE id = ?";
    const values = [this.id];
    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error);
      } else {
        callback(null);
      }
    });
  }
  //Función de instancia que devuelve todos los usuarios
  static getAllUsers(callback) {
    const query = "SELECT * FROM Usuarios";
    connection.execute(query, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        const users = results.map((userRow) => {
          //  return new User(userRow.id,userRow.nombre,userRow.email,userRow.password);
        });
        callback(null, users);
      }
    });
  }
  static findOneByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Usuarios WHERE correo_electronico = ?";
      const values = [email];
      connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const userRow = results[0];
          if (userRow) {
            const user = new User(
              userRow.id,
              userRow.nombre,
              userRow.apellidos,
              userRow.fecha_nacimiento,
              userRow.fecha_ingreso,
              userRow.rol,
              userRow.foto,
              userRow.contraseña,
              userRow.correo_electronico,
              userRow.telefono,
              userRow.direccion
            );
            resolve(user);
          } else {
            resolve(null);
          }
        }
      });
    });
  }
  static findById(id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Usuarios WHERE id = ?";
      const values = [id];

      connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const userRow = results[0];
          if (userRow) {
            const user = new User(
              userRow.id,
              userRow.nombre,
              userRow.apellidos,
              userRow.fecha_nacimiento,
              userRow.fecha_ingreso,
              userRow.rol,
              userRow.foto,
              userRow.contraseña,
              userRow.correo_electronico,
              userRow.telefono,
              userRow.direccion
            );
            resolve(user);
          } else {
            resolve(null);
          }
        }
      });
    });
  }
  // Función estática para obtener los últimos 3 usuarios añadidos
  static getLastUsers(callback) {
    const query = "SELECT * FROM Usuarios ORDER BY id DESC LIMIT 3";
    connection.execute(query, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        const users = results.map((userRow) => {
          return new User(
            userRow.id,
            userRow.nombre,
            userRow.apellidos,
            userRow.fecha_nacimiento,
            userRow.fecha_ingreso,
            userRow.rol,
            userRow.foto,
            userRow.contraseña,
            userRow.correo_electronico,
            userRow.telefono,
            userRow.direccion
          );
        });
        callback(null, users);
      }
    });
  }
  comparePassword(password) {
    //Contraseña con hash
    // return bcrypt.compareSync(password, this.password);
    //Contraseña texto plano
    return this.contraseña === password;
  }
}
module.exports = User;
