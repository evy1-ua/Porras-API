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
      
      // Lógica de autenticación, por ejemplo, buscar el usuario en la base de datos y verificar las credenciales
      const user = await User.findOneByEmail(email);
      if (!user || !user.comparePassword(password)) {
        return done(null, false, { message: 'Credenciales inválidas' });
      }
      console.log("Estoy en passport.js");
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
    console.log(user);
    if(!user){
      return done(null,false);
    }
    done(null, user);

  } catch (error) {
    done(error);
  }
});

module.exports = passport;
