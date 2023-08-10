const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const local_strategy = require('../config/passport');
const multer = require("multer");

const UserController = require('../controllers/userController');
const InvitacionesControllers = require('../controllers/InvitacionesController');
const CursoController = require('../controllers/CursoController');



const Invitaciones = require('../models/Invitaciones');
const passport = require('passport');

// Configuración dinámica de Multer según el controlador
const storage = multer.diskStorage({
  
  destination: (req, file, cb) => {
    let destinationDir = ""; // Directorio de destino inicial
   console.log("hola");
    if (req.url.includes("/users")) {
      destinationDir = "public/images/users"; // Directorio de destino para el controlador "users"
    } else if (req.url.includes("/courses_create")) {
      destinationDir = "public/images/courses"; // Directorio de destino para el controlador "courses"
    } else {
      // Directorio de destino predeterminado si no coincide con ninguno de los controladores anteriores
      destinationDir = "public/images";
    }

    cb(null, destinationDir);
  },
  filename: (req, file, cb) => {
    // Nombre del archivo en el servidor (puedes personalizarlo como desees)
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

 router.get('/api', (req, res) => {
    res.json({ "users": ["userOne","userTwo","userThree"]});
 });

 


 //Cursos

 // Ruta para crear un curso y asociarle una semana y un profesor

// Ruta para crear un curso (usando el middleware upload.single() para procesar la imagen)
router.post('/api/create_course',upload.single('foto'), CursoController.createCurso);
// Ruta para agregar una semana a un curso específico
router.post('/api/courses/:id/add_semana', CursoController.addSemanaToCurso);
// Ruta para agregar un profesor a un curso específico
router.post('/api/courses/:id/add_profesor', CursoController.addProfesorToCurso);
// Obtenemos la lista de los ultimos cursos añadidos
router.get('/api/getLastCourses',CursoController.getLastCourses);
//Obtenemos las semanas de un curso por su id
router.get('/api/courses/:id/getSemanas', CursoController.getSemanasByCursoId)


 //Invitaciones

 router.get('/api/register/:codigo', (req,res) => {
    const codigo = req.params.codigo;
    //Verificamos la validez del código de invitación
    Invitaciones.checkInvitacion(codigo, (error, invitacion) => {
      if (error) {
        
        return res.status(500).json({ error: 'Error en el servidor' });
      }
  
      // Si la invitación no es válida o ya ha sido usada, redirigir a una página de error o mostrar un mensaje
      if (!invitacion) {
        return res.status(404).json({ error: 'Código de invitación no válido' });
      }
      // Si el código de invitación es válido, mostrar el formulario de registro
      return res.status(200).json({ isValid: true, rol: invitacion.rol });
    });

 });
 router.put('/api/usar_invitacion/:codigo',InvitacionesControllers.usarInvitacion);
 router.post('/api/crear_invitaciones', InvitacionesControllers.createInvitacion);

//Usuarios
 router.post('/api/crear_usuario',UserController.createUser); 
 //Obtenemos la lista de los tres ultimos usuarios añadidos
 router.get('/api/getLastUsers',UserController.getLastUsers); 


// Función de middleware para verificar la autenticación
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  next();
}
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Autenticación fallida, redirigir a /login
      return res.status(400).json({ success: false, message: 'Credenciales inválidas' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log(user);
      // Autenticación exitosa, redirigir a /dashboard
      return res.status(200).json({ success: true, message: 'Autenticación exitosa', user: user });
      
    });
  })(req, res, next);
});




router.get('/logout',  (req, res) => {
  req.logout( function(err) {
    if(err){
      console.error(error);
    }
  });
  console.log("Sesión cerrada");
  res.redirect('/')
})


 router.get('/dashboard', passport.authenticate('local', {session: false}), (req,res) => {
  console.log("estoy en get de dashboard");
  res.status(200).json({ user: req.user });
 });
 router.get('/dashboard/curso/:id', authMiddleware, (req,res) => {
   if(req.user) {
     console.log('Sesión iniciada');
    res.json({user: req.user});
   } else{
     console.log('Sesión no iniciada');
     res.redirect('/');
   }
 });

router.get('/users', UserController.getAllUsers);
router.post('/users', UserController.createUser);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

module.exports=router;