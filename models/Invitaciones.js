const mysql = require('mysql2');
const dbConfig = require('../config/dbConnection')
//Inicio la conexión
const connection = mysql.createConnection(dbConfig)

class Invitaciones{
    constructor(id,codigo,fecha_creacion,estado,usuario_id,rol){
        this.id=id;
        this.codigo=codigo;
        this.fecha_creacion= fecha_creacion;
        this.estado = estado;
        this.usuario_id = usuario_id;
        this.rol = rol;
    }
    //Función que guarda un código de invitación
     save(callback){
         const query = 'INSERT INTO Invitaciones (codigo,fecha_creacion,estado,usuario_id,rol) VALUES (?,?,?,?,?)';
         const values = [this.codigo,this.fecha_creacion,this.estado,this.usuario_id,this.rol];
         connection.query(query,values, (error, results) =>{
             if(error){
                 callback(error,null);
             } else{
                 this.id = results.insertId;
                 callback(null,this);
             }
         });
     }
     //Función que actualiza una invitacion y la anula
     update(callback){
        const query ='UPDATE Invitaciones SET estado = ?, usuario_id = ?   WHERE id = ?';
        const values = [this.estado,this.usuario_id,this.id];
        connection.query(query,values, (error,results) => {
            if(error){
                callback(error,null);
            } else{
                callback(null,this);
            }
        });
    }
    //Funcíon que borra una invitacion
    delete(callback){
        const query = 'DELETE FROM Invitaciones WHERE id = ?';
        const values = [this.id];
        connection.query(query,values, (error,results) => {
            if(error){
                callback(error)
            } else{
                callback(null);
            }
        });
    }
    static checkInvitacion(codigo, callback) {
        const query = 'SELECT * FROM Invitaciones WHERE codigo = ? AND estado = ?';
        const values = [codigo, 'valido'];
        connection.query(query, values, (error, results) => {
            if(error) {
                
                callback(error, null);
            } else {
                // Si la consulta devuelve resultados y la invitación no está en estado usado, se crea una instancia de Invitaciones
                if (results.length && results[0].estado === 'valido') {
                    const invitacion = new Invitaciones(
                        results[0].id,
                        results[0].codigo,
                        results[0].fecha_creacion,
                        results[0].estado,
                        results[0].usuario_id,
                        results[0].rol
                    );
                    callback(null, invitacion);
                } else {
                    
                // Si la consulta no devuelve resultados o la invitación está en estado usado, se pasa null a través del callback
                    callback(null, null);
                }     
            }
        });
    }
}

module.exports = Invitaciones;