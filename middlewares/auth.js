const passport = require('passport');
const authMiddleware = (req, res, next) => {
  // Verificar si el usuario está autenticado
  if (req.isAuthenticated()) {
    console.log("Usuario autenticado");
    // El usuario está autenticado, continuar con la siguiente función middleware
    next();
  } else {
    // El usuario no está autenticado, redirigir a la página de inicio de sesión
    console.log("Usuario no autenticado");
    res.redirect('/');
  }
};

module.exports = authMiddleware;