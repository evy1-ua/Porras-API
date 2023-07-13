
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const dbConfig = require("./config/dbConnection");
const mysql = require("mysql2");
const { exec } = require("child_process");



//Cargamos ls variables de entorno
dotenv.config();

// Creamos la aplicación de Express
const app = express();

// Habilitar CORS
app.use(cors());

//Configuración de la sesión
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
// Iniciar Passport y establecer conexión
app.use(passport.initialize());
app.use(passport.session());

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
// Configuración de la carpeta de archivos estáticos
 const url = path.join(__dirname, "..", "client", "build");
 app.use(express.static(url));
 console.log(url)
 // Ruta para todas las solicitudes que no sean a los archivos estáticos
 app.get("*", (req, res) => {
   res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
 });

// Configurar el motor de vistas
  const viewsPath = path.join(__dirname, '..', 'client', 'src','views');
  app.set('views', viewsPath);
  console.log('Ruta de las vistas:', viewsPath);
  app.set("view engine", "jsx");
  app.engine("jsx", require("express-react-views").createEngine());

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
