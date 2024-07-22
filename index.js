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
      
      db.query(query, [name, email, phone, checkin, checkout, roomtype], (err, results) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(err));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Reserva creada con éxito', results }));
    });

      


    })
  }else if(false){
    console.log("")
  }else{
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
  }


});

// Hacer que el servidor escuche en el puerto especificado
server.listen(port, hostname, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});
