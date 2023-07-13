const User = require('../models/user');

const UserController = {
  getAllUsers: (req, res) => {
    User.getAllUsers((error, users) => {
      if (error) {
        console.error('Error al obtener los usuarios:', error);
        return res.status(500).json({ error: 'Error al obtener los usuarios' });
      }
      res.json(users);
    });
  },

  createUser: (req, res) => {
    const { name, email, password } = req.body;
    const newUser = new User(null, name, email, password);

    newUser.save((error, savedUser) => {
      if (error) {
        console.error('Error al guardar el usuario:', error);
        return res.status(500).json({ error: 'Error al guardar el usuario' });
      }
      res.json(savedUser);
    });
  },

  updateUser: (req, res) => {
    const { id, name, email, password } = req.body;
    const updatedUser = new User(id, name, email, password);

    updatedUser.update((error, updatedUser) => {
      if (error) {
        console.error('Error al actualizar el usuario:', error);
        return res.status(500).json({ error: 'Error al actualizar el usuario' });
      }
      res.json(updatedUser);
    });
  },

  deleteUser: (req, res) => {
    const { id } = req.params;
    const userToDelete = new User(id, null, null, null);

    userToDelete.delete((error) => {
      if (error) {
        console.error('Error al eliminar el usuario:', error);
        return res.status(500).json({ error: 'Error al eliminar el usuario' });
      }
      res.json({ message: 'Usuario eliminado correctamente' });
    });
  },

  getHelloWorld7: (req, res) => {
    res.send("Hola Mundo7");
  }
};

module.exports = UserController;
