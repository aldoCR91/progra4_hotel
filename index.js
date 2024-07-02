// Importar el módulo http
const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Definir el puerto en el que el servidor escuchará
const port = process.env.PORT
const hostname = '0.0.0.0';

// Crear el servidor
const server = http.createServer((req, res) => {
  if(req.url === '/'){
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, content) => {
      if(err){
        res.statusCode = 500;
        res.setHeader('Content-Type','text/plain');
        res.end('Error interno del servidor');
      }else{
        res.statusCode = 200;
        res.setHeader('Content-Type','text/html');
        res.end(content);
      }
    })
  }else{
    res.statusCode = 404;
    res.setHeader('Content-Type','text/plain');
    res.end('Pagina no encotrada');
  }
  // Establecer el encabezado de respuesta
  //res.writeHead(200, { 'Content-Type': 'text/plain' });
  
  // Enviar la respuesta
  //res.end('Hola, Mundo!\n');
});

// Hacer que el servidor escuche en el puerto especificado
server.listen(port, hostname, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});
