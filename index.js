// Importar el módulo http
const http = require("http");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");
require("dotenv").config();

const conexion = mysql.createConnection({
  host: "localhost",
  user: "user",
  password: "password",
  database: "progra4",
});

conexion.connect((error) => {
  if (error) console.log("Problemas de conexion con mysql");
});

// Definir el puerto en el que el servidor escuchará
const port = process.env.PORT;
const hostname = "0.0.0.0";

// Crear el servidor
const server = http.createServer((req, res) => {
  const filePath =
    req.url === "/" ? "./public/index.html" : `./public${req.url}`;
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

 
  if (req.url == "/contact.html") {
    res.writeHead(200, { "Content-Type": contentType });
    res.end(
      `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Formulario de Registro en Hotel</title>
      </head>
      <body>
          <h2 style="text-align: center;">Formulario de Registro en Hotel</h2>
          <form action="/registrarme" method="post" style="max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; background-color: #f9f9f9;">
              <label for="name" style="display: block; margin-bottom: 10px;">
                  Nombre:
                  <input type="text" id="name" name="name" required style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </label>
              
              <label for="email" style="display: block; margin-bottom: 10px;">
                  Correo Electrónico:
                  <input type="email" id="email" name="email" required style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </label>
              
              <label for="phone" style="display: block; margin-bottom: 10px;">
                  Teléfono:
                  <input type="tel" id="phone" name="phone" required style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </label>
              
              <label for="checkin" style="display: block; margin-bottom: 10px;">
                  Fecha de Check-In:
                  <input type="date" id="checkin" name="checkin" required style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </label>
              
              <label for="checkout" style="display: block; margin-bottom: 10px;">
                  Fecha de Check-Out:
                  <input type="date" id="checkout" name="checkout" required style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </label>
              
              <label for="roomtype" style="display: block; margin-bottom: 10px;">
                  Tipo de Habitación:
                  <select id="roomtype" name="roomtype" required style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px;">
                      <option value="single">Individual</option>
                      <option value="double">Doble</option>
                      <option value="suite">Suite</option>
                  </select>
              </label>
              
              <label for="requests" style="display: block; margin-bottom: 10px;">
                  Peticiones Especiales:
                  <textarea id="requests" name="requests" rows="4" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
              </label>
              
              <button type="submit" style="display: block; width: 100%; padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                  Registrarse
              </button>
          </form>
      </body>
      </html>`,"utf-8"
    );
  }

  if (req.url == "/registrarme") {
    getRequestBody(req, (body) => {
      const { name, email, phone, checkin, checkout, roomtype, requests } = body;
      const query = "INSERT IN TO reservas (name,email,phone,checkin,checkout,roomtype,requests) values (?,?,?,?,?,?,?)";
      conexion.query(query, [name, email, phone,checkin, checkout, roomtype, requests ], (err, result) => {
        if (err) {
            res.statusCode = 500;
            return res.end(JSON.stringify(err));
        }
        res.statusCode = 201;
        res.end(JSON.stringify({ id: result.insertId, name, email, age }));
    });


      res.writeHead(200, { "Content-Type": contentType });
      res.end("name", "utf-8");
    });
    /*
    try {
      getRequestBody(req,(body) =>{
        console.log(body)
        const {name, email, phone, checkin, checkout, roomtype, requests} = body;

      })
      conexion.query("")
    } catch (error) {
      
    }

    console.log("entrando en el metodo de guardado")
    */
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code == "ENOENT") {
        fs.readFile("./public/404.html", (error, content) => {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(content, "utf-8");
        });
      } else {
        res.writeHead(500);
        res.end(`Error interno del servidor: ${error.code} ..\n`);
        res.end();
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

// Función para obtener el cuerpo de la solicitud
const getRequestBody = (req, callback) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    callback(JSON.parse(body));
  });
};
// Hacer que el servidor escuche en el puerto especificado
server.listen(port, hostname, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});
