
// Normaliza y clasifica la prioridad de una incidencia usando exclusivamente switch. 
 
function obtenerClasificacionPrioridad(prioridad) { 
    if (typeof prioridad !== 'string') { 
      return null; 
    } 
  
    const prioridadLimpia = prioridad.trim().toLowerCase(); 
  
    switch (prioridadLimpia) { 
      case 'alta': 
        return 'Crítica'; 
      case 'media': 
        return 'Importante'; 
      case 'baja': 
        return 'Normal'; 
      default: 
        return null; 
    } 
  } 
  
  module.exports = { 
    obtenerClasificacionPrioridad 
  };