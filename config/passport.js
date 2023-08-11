const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      console.log("Estoy en passport.js");
      // Lógica de autenticación, por ejemplo, buscar el usuario en la base de datos y verificar las credenciales
      const user = await User.findOneByEmail(email);
      if (!user || !user.comparePassword(password)) {
        return done(null, false, { message: 'Credenciales inválidas' });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("Usuario no encontrado");
      return done(null, false);
    }
    console.log("Usuario encontrado:", user);
    done(null, user);
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    done(error);
  }
});

module.exports = passport;
