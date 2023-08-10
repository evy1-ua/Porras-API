
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const dbConfig = require("./config/dbConnection");
const mysql = require("mysql2");
const { exec } = require("child_process");
const multer = require("multer");




//Cargamos ls variables de entorno
dotenv.config();

// Creamos la aplicación de Express
const app = express();

// Habilitar CORS
app.use(cors());

app.use(cookieParser('secret-key'));
//Configuración de la sesión
app.use(
  session({
    secret: "secret-key",
    resave: true,
    saveUninitialized: true,
  })
);

// Iniciar Passport y establecer conexión
app.use(passport.initialize());
app.use(passport.session());

// Importamos nuestra Estrategia Local
const passport_config = require("./config/passport");

// Middleware para analizar el cuerpo de las solicitudes en formato JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Comprobación de Conexión a la base de datos
const connection = mysql.createConnection(dbConfig);
connection.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Conectado correctamente a la base de datos");
  }
});

// Definición de rutas
 const routes = require("./routes/pages");
 app.use("/", routes);

//Configuramos el puerto
const port = process.env.PORT || 5000;

console.log(passport.session.name);
/* Modo desarrolador*/
// Iniciamos el servidor
const server = app.listen(port, () => {
  const address = server.address();
  console.log(`Servidor en funcionamiento en el puerto ${port}`);

  // Abrir el navegador automáticamente en la dirección y puerto especificados
  // const url = `http://localhost:${port}`;
  // switch (process.platform) {
  //   case "darwin": // macOS
  //     exec(`open ${url}`);
  //     break;
  //   case "win32": // Windows
  //     exec(`start ${url}`);
  //     break;
  //   default:
  //     console.log(`Abre tu navegador en ${url}`);
  // }
});

module.exports = app;
