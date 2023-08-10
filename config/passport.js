const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


passport.use(new LocalStrategy(
  {
    // Configuración de la estrategia
  },
  async (email, password, done) => {
    try {
      console.log("Estrategia de autenticación en proceso...");

      // Lógica de autenticación

      if (!user || !user.comparePassword(password)) {
        console.log("Autenticación fallida");
        return done(null, false, { message: 'Credenciales inválidas' });
      }

      console.log("Autenticación exitosa");
      return done(null, user);
    } catch (error) {
      console.error("Error en la estrategia de autenticación:", error);
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  console.log("Serializando usuario:", user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log("Deserializando usuario:", id);
    const user = await User.findById(id);

    if (!user) {
      console.log("Usuario no encontrado");
      return done(null, false);
    }

    console.log("Usuario deserializado:", user);
    done(null, user);
  } catch (error) {
    console.error("Error en la deserialización de usuario:", error);
    done(error);
  }
});

module.exports = passport;
