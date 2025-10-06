import { Clock, Check } from 'lucide-react';
import type { Servicio } from '../types/domain';

interface ServicioCardProps {
  servicio: Servicio;
  isSelected: boolean;
  onSelect: () => void;
}

export function ServicioCard({ servicio, isSelected, onSelect }: ServicioCardProps) {
  const getServicioIcon = (nombre: string) => {
    // Iconos específicos basados en el nombre del servicio
    if (nombre.toLowerCase().includes('control')) return '🔍';
    if (nombre.toLowerCase().includes('limpieza') || nombre.toLowerCase().includes('profilaxis')) return '✨';
    if (nombre.toLowerCase().includes('urgencia')) return '🚨';
    if (nombre.toLowerCase().includes('endodoncia')) return '🦷';
    if (nombre.toLowerCase().includes('ortodoncia')) return '⚙️';
    return '🏥';
  };

  const getDescripcionServicio = (nombre: string) => {
    const descripciones: Record<string, string> = {
      'Control': 'Evaluación general del estado de tu salud dental',
      'Limpieza/Profilaxis': 'Limpieza profunda y eliminación de sarro',
      'Urgencia': 'Atención inmediata para dolor o molestias',
      'Endodoncia': 'Tratamiento de conducto para salvar tu diente',
      'Ortodoncia Consulta': 'Evaluación para tratamiento de ortodoncia'
    };
    return descripciones[nombre] || 'Atención odontológica especializada';
  };

  return (
    <div
      onClick={onSelect}
      className={`
        relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-slate-200 bg-white hover:border-slate-300'
        }
      `}
    >
      {/* Header con icono */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getServicioIcon(servicio.nombre)}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 text-lg">
              {servicio.nombre}
            </h3>
            {servicio.especialidad && (
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                {servicio.especialidad}
              </span>
            )}
          </div>
        </div>

        {isSelected && (
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Descripción */}
      <p className="text-sm text-slate-600 mb-4">
        {getDescripcionServicio(servicio.nombre)}
      </p>

      {/* Duración y buffers */}
      <div className="space-y-2">
        <div className="flex items-center text-sm text-slate-700">
          <Clock className="w-4 h-4 mr-2 text-slate-500" />
          <span>Duración: {servicio.duracionMinutos} minutos</span>
        </div>

        {(servicio.bufferPrevioMin || servicio.bufferPosteriorMin) && (
          <div className="text-xs text-slate-500">
            {servicio.bufferPrevioMin && (
              <span>Buffer previo: {servicio.bufferPrevioMin} min</span>
            )}
            {servicio.bufferPrevioMin && servicio.bufferPosteriorMin && (
              <span className="mx-1">•</span>
            )}
            {servicio.bufferPosteriorMin && (
              <span>Buffer posterior: {servicio.bufferPosteriorMin} min</span>
            )}
          </div>
        )}
      </div>

      {/* Indicador de selección */}
      {isSelected && (
        <div className="absolute inset-0 rounded-lg ring-2 ring-blue-500 ring-opacity-50 pointer-events-none" />
      )}
    </div>
  );
}
