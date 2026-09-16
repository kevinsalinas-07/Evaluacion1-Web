// Normaliza y clasifica la prioridad de una incidencia usando exclusivamente switch
function obtenerClasificacionPrioridad(prioridad) { 
    if (typeof prioridad !== 'string') { 
      return 'Desconocida'; 
    } 
  
    const prioridadLimpia = prioridad.trim().toLowerCase(); 
  
    switch (prioridadLimpia) { 
      case 'alta': 
        return 'Critica'; 
      case 'media': 
        return 'Importante'; 
      case 'baja': 
        return 'Normal'; 
      default: 
        return 'Desconocida'; 
    } 
  } 
  
  module.exports = { 
    obtenerClasificacionPrioridad 
  };