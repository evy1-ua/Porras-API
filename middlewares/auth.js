const passport = require("passport");
const express = require("express");
const session = require("express-session");
const authMiddleware = (req, res, next) => {
  console.log(req.isAuthenticated());
  // Verificar si el usuario está autenticado
  if (req.isAuthenticated()) {
    console.log("Usuario autenticado");
    // El usuario está autenticado, continuar con la siguiente función middleware
    next();
  } else {
    // El usuario no está autenticado, redirigir a la página de inicio de sesión
    console.log("Usuario no autenticado");
    res.status(401).json({ error: 'No autenticado' });
  }
};

module.exports = authMiddleware;