// Almacenamiento en memoria según requerimiento
const incidencias = [];
let nextId = 1;

// POST /incidencias
const registrarIncidencia = (req, res) => {
  const { empleado, area, descripcion, prioridad } = req.body;

  // Validación 1: Verificar existencia de todos los campos obligatorios
  if (!empleado || !area || !descripcion || !prioridad) {
    return res.status(400).json({
      error: 'Todos los campos son obligatorios (empleado, area, descripcion, prioridad)'
    });
  }

  // Validación 2: Verificar tipos de datos string
  if (
    typeof empleado !== 'string' ||
    typeof area !== 'string' ||
    typeof descripcion !== 'string' ||
    typeof prioridad !== 'string'
  ) {
    return res.status(400).json({
      error: 'Los campos deben contener texto válido'
    });
  }

  // Sanitización de espacios vacíos
  const empleadoLimpio = empleado.trim();
  const areaLimpia = area.trim();
  const descripcionLimpia = descripcion.trim();
  const prioridadLimpia = prioridad.trim().toLowerCase();

  // Validación 3: No permitir cadenas vacías tras eliminar espacios
  if (
    empleadoLimpio === '' ||
    areaLimpia === '' ||
    descripcionLimpia === '' ||
    prioridadLimpia === ''
  ) {
    return res.status(400).json({
      error: 'No se permiten campos con cadenas vacías'
    });
  }

  // Validación 4: Prioridad permitida ("Alta", "Media", "Baja")
  let prioridadNormalizada = '';
  if (prioridadLimpia === 'alta') {
    prioridadNormalizada = 'Alta';
  } else if (prioridadLimpia === 'media') {
    prioridadNormalizada = 'Media';
  } else if (prioridadLimpia === 'baja') {
    prioridadNormalizada = 'Baja';
  } else {
    return res.status(400).json({
      error: 'Prioridad inválida. Debe ser: Alta, Media o Baja'
    });
  }

  // Creación del nuevo registro en memoria
  const nuevaIncidencia = {
    id: nextId++,
    empleado: empleadoLimpio,
    area: areaLimpia,
    descripcion: descripcionLimpia,
    prioridad: prioridadNormalizada,
    estado: 'Pendiente'
  };

  incidencias.push(nuevaIncidencia);

  return res.status(201).json({
    mensaje: 'Incidencia registrada correctamente'
  });
};

// GET /incidencias
const listarIncidencias = (req, res) => {
  return res.status(200).json(incidencias);
};

module.exports = {
  registrarIncidencia,
  listarIncidencias
};