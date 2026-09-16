const { esTextoValido, normalizarTexto } = require('../utils/helpers');

// Arreglo para almacenar incidencias en memoria
const incidencias = [];
let contadorId = 1;

// 1. Registrar incidencias (POST /incidencias)
const registrarIncidencia = (req, res) => {
    const { empleado, area, descripcion, prioridad } = req.body;

    // Validación 1: Verificar que los campos no estén vacíos
    if (!esTextoValido(empleado) || !esTextoValido(area) || !esTextoValido(descripcion) || !esTextoValido(prioridad)) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    // Validación 2: Normalizar y validar prioridad usando if / else if (Requisito técnico obligatorio)
    const prioridadLimpia = normalizarTexto(prioridad);
    let prioridadNormalizada = '';

    if (prioridadLimpia === 'alta') {
        prioridadNormalizada = 'Alta';
    } else if (prioridadLimpia === 'media') {
        prioridadNormalizada = 'Media';
    } else if (prioridadLimpia === 'baja') {
        prioridadNormalizada = 'Baja';
    } else {
        return res.status(400).json({ mensaje: 'La prioridad solo puede ser: Alta, Media o Baja' });
    }

    const nuevaIncidencia = {
        id: contadorId++,
        empleado: empleado.trim(),
        area: area.trim(),
        descripcion: descripcion.trim(),
        prioridad: prioridadNormalizada,
        estado: 'Pendiente' // Estado por defecto según el caso de negocio
    };

    incidencias.push(nuevaIncidencia);
    return res.status(201).json({ mensaje: "Incidencia registrada correctamente" });
};

// 2. Listar incidencias (GET /incidencias)
const listarIncidencias = (req, res) => {
    return res.status(200).json(incidencias);
};

// 3. Buscar incidencias por ID (GET /incidencias/:id)
const buscarIncidencias = (req, res) => {
    const id = parseInt(req.params.id, 10);

    const incidencia = incidencias.find(item => item.id === id);

    if (incidencia) {
        return res.status(200).json(incidencia);
    } else {
        return res.status(404).json({ mensaje: "Incidencia no encontrada" });
    }
};

// 4. Cambiar estado de incidencia (PUT /incidencias/:id/estado)
const cambiarEstadoIncidencia = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { estado } = req.body;

    if (!esTextoValido(estado)) {
        return res.status(400).json({ mensaje: "El campo estado es obligatorio" });
    }

    const incidencia = incidencias.find(item => item.id === id);

    if (!incidencia) {
        return res.status(404).json({ mensaje: "Incidencia no encontrada" });
    }

    let estadoValido = "";
    const estadoFormateado = normalizarTexto(estado);

    // Requisito obligatorio: Uso exclusivo de switch
    switch (estadoFormateado) {
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
                mensaje: "Estado no válido. Los estados válidos son: Pendiente, En Proceso, Resuelta, Cancelada"
            });
    }

    incidencia.estado = estadoValido;
    return res.status(200).json({ mensaje: "Estado actualizado correctamente", incidencia });
};

// 5. Eliminar incidencia (DELETE /incidencias/:id)
const eliminarIncidencia = (req, res) => {
    const id = parseInt(req.params.id, 10);

    // Requisito obligatorio: findIndex y splice
    const index = incidencias.findIndex(item => item.id === id);
    
    if (index !== -1) {
        incidencias.splice(index, 1);
        return res.status(200).json({ mensaje: "Incidencia eliminada correctamente" });
    } else {
        return res.status(404).json({ mensaje: "Incidencia no encontrada" });
    }
};

// 6. Endpoint de estadísticas (GET /estadisticas)
const obtenerEstadisticas = (req, res) => {
    // Requisito obligatorio: Sin variables manuales sueltas, usando métodos funcionales de array
    const estadisticas = {
        totalIncidencias: incidencias.length,
        pendientes: incidencias.filter(i => i.estado === "Pendiente").length,
        enProceso: incidencias.filter(i => i.estado === "En Proceso").length,
        resueltas: incidencias.filter(i => i.estado === "Resuelta").length,
        canceladas: incidencias.filter(i => i.estado === "Cancelada").length
    };

    return res.status(200).json(estadisticas);
};

// 7. Clasificación automática (GET /incidencias/:id/clasificacion)
const obtenerClasificacion = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const incidencia = incidencias.find(item => item.id === id);

    if (!incidencia) {
        return res.status(404).json({ mensaje: "Incidencia no encontrada" });
    }
    
    let clasificacion = "";

    // Requisito obligatorio: Uso exclusivo de switch
    switch (incidencia.prioridad) {
        case 'Alta':
            clasificacion = "Critica";
            break;
        case 'Media':
            clasificacion = "Importante";
            break;
        case 'Baja':
            clasificacion = "Normal";
            break;
        default:
            clasificacion = "Desconocida";
            break;
    }

    return res.status(200).json({
        id: incidencia.id,
        clasificacion: clasificacion
    });
};

module.exports = {
    registrarIncidencia,
    listarIncidencias,
    buscarIncidencias,
    cambiarEstadoIncidencia,
    eliminarIncidencia,
    obtenerEstadisticas,
    obtenerClasificacion
};