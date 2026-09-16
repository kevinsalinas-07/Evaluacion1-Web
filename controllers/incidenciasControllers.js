
// Almacenamiento en memoria.
const incidencias = [];
let nextId = 1;

// POST /incidencias
const registrarIncidencia = (req, res) => {
  const { empleado, area, descripcion, prioridad } = req.body;
  const { obtenerClasificacionPrioridad } = require('../utils/helpers');

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

// GET /incidencias/:id
const buscarIncidenciaPorId = (req, res) => {
  const idBuscado = parseInt(req.params.id, 10);

  if (isNaN(idBuscado)) {
    return res.status(400).json({ error: 'El ID proporcionado debe ser un número entero' });
  }

  const incidenciaEncontrada = incidencias.find((item) => item.id === idBuscado);

  if (!incidenciaEncontrada) {
    return res.status(404).json({
      mensaje: 'Incidencia no encontrada'
    });
  }

  return res.status(200).json(incidenciaEncontrada);
};

// PUT /incidencias/:id/estado
const cambiarEstadoIncidencia = (req, res) => {
  const idBuscado = parseInt(req.params.id, 10);
  const { estado } = req.body;

  if (isNaN(idBuscado)) {
    return res.status(400).json({ error: 'El ID proporcionado debe ser un número entero' });
  }

  if (!estado || typeof estado !== 'string') {
    return res.status(400).json({ error: 'El campo estado es requerido y debe ser texto' });
  }

  const incidencia = incidencias.find((item) => item.id === idBuscado);

  if (!incidencia) {
    return res.status(404).json({
      mensaje: 'Incidencia no encontrada'
    });
  }

  const estadoLimpio = estado.trim().toLowerCase();
  let estadoValido = '';

  //  Uso de switch para validar y asignar el estado
  switch (estadoLimpio) {
    case 'pendiente':
      estadoValido = 'Pendiente';
      break;
    case 'en proceso':
      estadoValido = 'En Proceso';
      break;
    case 'resuelta':
      estadoValido = 'Resuelta';
      break;
    case 'cancelada':
      estadoValido = 'Cancelada';
      break;
    default:
      return res.status(400).json({
        error: 'Estado inválido. Solo se permite: Pendiente, En Proceso, Resuelta o Cancelada'
      });
  }

  incidencia.estado = estadoValido;

  return res.status(200).json({
    mensaje: 'Estado de la incidencia actualizado correctamente',
    incidencia
  });
};

// DELETE /incidencias/:id
const eliminarIncidencia = (req, res) => {
  const idBuscado = parseInt(req.params.id, 10);

  if (isNaN(idBuscado)) {
    return res.status(400).json({ error: 'El ID proporcionado debe ser un número entero' });
  }

  // REQUISITO OBLIGATORIO: Uso de findIndex y splice
  const indice = incidencias.findIndex((item) => item.id === idBuscado);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: 'Incidencia no encontrada'
    });
  }

  incidencias.splice(indice, 1);

  return res.status(200).json({
    mensaje: 'Incidencia eliminada correctamente'
  });
};


// GET /estadisticas
const obtenerEstadisticas = (req, res) => {

//    Se utiliza el método reduce() para procesar el acumulador en una sola pasada.
  
  const estadisticas = incidencias.reduce(
    (acc, incidencia) => {
      acc.totalIncidencias += 1;

      switch (incidencia.estado) {
        case 'Pendiente':
          acc.pendientes += 1;
          break;
        case 'En Proceso':
          acc.enProceso += 1;
          break;
        case 'Resuelta':
          acc.resueltas += 1;
          break;
        case 'Cancelada':
          acc.canceladas += 1;
          break;
      }

      return acc;
    },
    {
      totalIncidencias: 0,
      pendientes: 0,
      enProceso: 0,
      resueltas: 0,
      canceladas: 0
    }
  );

  return res.status(200).json(estadisticas);
};