const Invitaciones = require('../models/Invitaciones');

const InvitacionesControllers = {
    createInvitacion: (req, res) => {
        const {codigo,fecha_creacion, estado , usuario_id,rol } = req.body;
        const nuevaInvitacion = new Invitaciones(null, codigo, fecha_creacion, estado, null,rol);
        nuevaInvitacion.save((error, invitacionGuardada) => {
            if(error){
                console.error('Error al guardar la invitación:',error);
                res.status(500).json({ error: 'Error al guardar la invitación' })
            }
            else {
                res.status(201).json(invitacionGuardada);
            }
        });
    },
    // Controlador para actualizar invitacion y marcarla como usada
    usarInvitacion: (req, res) => {
        
        const {codigo, estado, usuario_id} = req.body;
        //Primero, verifica si la invitación existe en la base de datos
        Invitaciones.checkInvitacion(codigo, (error, invitacion) => {
            if(error) {
                console.error('Error al verificar la invitación:', error);
                return res.status(500).json({ error: 'Error al verificar la invitación'});
            }
            if(!invitacion) {
                return res.status(404).json({ error: 'Invitación no encontrada'});
            }
            //Si la invitación existe, actualiza su estado y asigna el usuario_id
            invitacion.estado= req.body.estado;
            invitacion.usuario_id = req.body.usuario_id;
            

            invitacion.update((error, invitacionActualizada) => {
                if(error){
                    console.error('Error al actualizar la invitación:', error);
                    return res.status(500).json({ error: 'Error al actualizar la invitación'});
                }
                return res.status(200).json(invitacionActualizada);
            });
        });
    }
};

module.exports = InvitacionesControllers;