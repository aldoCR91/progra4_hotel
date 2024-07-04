// Importar el módulo http
const http = require("http");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

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

// Hacer que el servidor escuche en el puerto especificado
server.listen(port, hostname, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});
