const express = require('express');
const incidenciasRoutes = require('./routes/incidencias');

const app = express();
const PORT = 3000;

// Middleware obligatorio para parsear cuerpos de peticiones JSON
app.use(express.json());

// Montaje de rutas
app.use('/', incidenciasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});