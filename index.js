// Importar el módulo http
const http = require("http");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const mysql = require('mysql2');
const { error } = require("console");


// Definir el puerto en el que el servidor escuchará
const port = process.env.PORT;
const hostname = "0.0.0.0";

// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'progra4'
});

db.connect(err => {
  if (err) {
      throw err;
  }
  console.log('Conectado a la base de datos MySQL');
});


let query = `CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`

// Crear la tabla de la base datos si  no existe
db.query(query);


const getRequestBody = (req, callback) => {
  let body = '';
  req.on('data', chunk => {
      body += chunk.toString();
  });
  req.on('end', () => {
      callback(body);
  });
};

// Crear el servidor
const server = http.createServer((req, res) => {
  const filePath = req.url === "/" ? "./public/index.html" : `./public${req.url}`;
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".svg": "application/image/svg+xml",
  };

  const contentType = mimeTypes[extname];

  console.log(filePath)
  if (filePath == "./public/registrar_usuario" && req.method === 'POST') {
    getRequestBody(req, (body) => {
        const query = "CALL insertar_usuario(?, ?, ?, ?);";
        const parsedBody = new URLSearchParams(body);
        const fullname = parsedBody.get('fullname');
        const email = parsedBody.get('email');
        const username = parsedBody.get('username');
        const password = parsedBody.get('password');

        let errorContent = `
          <html lang="es">
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="styles.css" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
            rel="stylesheet"
          />
          <title>Hotel - Error</title>
          </head>
          <body>
          <a href="/">
            <button>Regresar al home</button>
          </a>
          <script>
            alert("No se pudo crear usuario")
          </script>
          </body>
          </html>
        `;

        let successContent = `
          <html lang="es">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="styles.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
              href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700&display=swap"
              rel="stylesheet"
            />
            <title>Registro exitoso</title>
            </head>
            <body>
                <a href="/">
                  <button>Regresar al home</button>
                </a>
              <script>
                alert("Su usuario ha sido creado con éxito");
              </script>
            </body>
          </html>
        `;

        //res.writeHead(500, { 'Content-Type': 'text/html' });

        db.query(query, [fullname, email, username, password], (err, results) => {
            if (err) {
                //res.writeHead(500, { 'Content-Type': 'text/html' });
                console.log("error ****")
                res.end(errorContent);
            } else {
                ///res.writeHead(200, { 'Content-Type': 'text/html' });
                console.log("success  ****")
                res.end(successContent);
            }
        });
    });
}

  // Crear nuevo registro de habitacion
  if(filePath == "./public/register" && req.method === 'POST'){
    getRequestBody(req, (body)=>{
      const query = 'CALL CreateReserva(?, ?, ?, ?, ?, ?)';
      const parsedBody = new URLSearchParams(body);
      const name = parsedBody.get('name');
      const email = parsedBody.get('email');
      const phone = parsedBody.get('phone');
      const checkin = parsedBody.get('checkin');
      const checkout = parsedBody.get('checkout');
      const roomtype = parsedBody.get('roomtype');

      //console.log(name, email, phone, checkin, checkout, roomtype)

      let content = `
      <html lang="es">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="styles.css" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        rel="stylesheet"
      />
      <title>Hotel - Error</title>
      </head>
      <body>
      <a href="/">
        <button >Regresar al home</button>
      </a>
      <script>
        alert("No se pudo reservar")
      </script>
      </body>
      </html>
        `
      
      db.query(query, [name, email, phone, checkin, checkout, roomtype], (err, results) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            //return res.end(JSON.stringify(err));
            return res.end(content);
        }
        content = `
        <html lang="es">
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="styles.css" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
            rel="stylesheet"
          />
          <title>Hotel - Error</title>
          </head>
          <body>
              <a href="/">
                <button >Regresar al home</button>
              </a>
            <script>
              alert("Su reserva ha sido creada con éxito");
            </script>
          </body>
        </html>
        `
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
    });

      


    })

  }else if(filePath == "./public/habitaciones" && req.method === 'GET'){    // Ver habitaciones
    res.writeHead(500);
  }else{
    res.writeHead(404, { "Content-Type": "text/html" });
    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code == "ENOENT") {
          fs.readFile("./public/404.html", (error, content) => {
    
            res.end(content, "utf-8");
      
          });
        } else {
      
          res.end(`Error interno del servidor: ${error.code} ..\n`);
          res.end();
        
        }
      } else {
        //res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      }
    });
  }


});

// Hacer que el servidor escuche en el puerto especificado
server.listen(port, hostname, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});
