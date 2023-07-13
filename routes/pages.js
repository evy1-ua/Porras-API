const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const local_strategy = require('../config/passport');


const UserController = require('../controllers/userController');
const passport = require('passport');

 router.get('/api', (req, res) => {
    res.json({ "users": ["userOne","userTwo","userThree"]})
 });
 router.get('/', (req,res) => {
   res.render('Index');
 })
//  router.get('/login', (req, res) => {
//    res.render('Login');
//  });
router.post('/login', passport.authenticate('local', {
  successRedirect:'/dashboard',
  failureRedirect: '/login'
}));

router.get('/logout', (req, res) => {
  req.logout( function(err) {
    if(err){
      console.error(error);
    }
  });
  console.log("Sesión cerrada");
  res.redirect('/')
})


 router.get('/dashboard', authMiddleware, (req,res) => {
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