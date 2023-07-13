 const bcrypt = require('bcrypt');
 const mysql = require('mysql2');
 const dbConfig = require('../config/dbConnection')
 //Inicio la conexión
 const connection = mysql.createConnection(dbConfig)
 class User {
     //Constructor de Usuario
     constructor(id, name, email, password){
         this.id=id;
         this.name=name;
         this.email=email;
         this.password=password;
     }
     //Función que guarda un usuario
     save(callback){
         const query = 'INSERT INTO Users (name, email, password) VALUES (?,?,?)';
         const values = [this.name,this.email,this.password];
         connection.query(query,values, (error, results) =>{
             if(error){
                 callback(error,null);
             } else{
                 this.id = results.insertId;
                 callback(null,this);
             }
         });
     }
     //Función que actualiza un Usuario
     update(callback){
         const query ='UPDATE Users SET name = ?, email = ?, password = ? WHERE id = ?';
         const values = [this.name,this.email,this.password,this.id];
         connection.query(query,values, (error,results) => {
             if(error){
                 callback(error,null);
             } else{
                 callback(null,this);
             }
         });
     }
     //Funcíon que borra un usuario
     delete(callback){
         const query = 'DELETE FROM Users WHERE id = ?';
         const values = [this.id];
         connection.query(query,values, (error,results) => {
             if(error){
                 callback(error)
             } else{
                 callback(null);
             }
         });
     }
     //Función de instancia que devuelve todos los usuarios
     static getAllUsers(callback){
         const query= 'SELECT * FROM Users';
         connection.execute(query, (error,results) => {
             if(error){
                 callback(error,null);
             } else{
                 const users = results.map((userRow) => {
                     return new User(userRow.id,userRow.name,userRow.email,userRow.password);
                 });
                 callback(null, users);
             }
         });
     }
     static findOneByEmail(email) {
        return new Promise((resolve, reject) => {
          const query = 'SELECT * FROM users WHERE email = ?';
          const values = [email];
          connection.query(query, values, (error, results) => {
            if (error) {
              reject(error);
            } else {
              const userRow = results[0];
              if (userRow) {
                const user = new User(userRow.id, userRow.name, userRow.email, userRow.password);
                
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
          const query = 'SELECT * FROM users WHERE id = ?';
          const values = [id];
      
          connection.query(query, values, (error, results) => {
            if (error) {
              reject(error);
            } else {
              const userRow = results[0];
              if (userRow) {
                const user = new User(userRow.id, userRow.name, userRow.email, userRow.password);
                resolve(user);
              } else {
                resolve(null);
              }
            }
          });
        });
      }
      
     comparePassword(password){
         //Contraseña con hash
         // return bcrypt.compareSync(password, this.password);
         //Contraseña texto plano
         return this.password === password;
     }
 }
 module.exports = User;