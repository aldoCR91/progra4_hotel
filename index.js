// Importar el módulo http
const http = require('http');
require('dotenv').config()

// Definir el puerto en el que el servidor escuchará
const port = process.env.PORT

// Crear el servidor
const server = http.createServer((req, res) => {
  // Establecer el encabezado de respuesta
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  
  // Enviar la respuesta
  res.end('Hola, Mundo!\n');
});

// Hacer que el servidor escuche en el puerto especificado
server.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});
