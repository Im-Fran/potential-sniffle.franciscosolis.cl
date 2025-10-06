import { MapPin, Clock, Phone, Check } from 'lucide-react';
import type { Sucursal } from '../types/domain';

interface SucursalCardProps {
  sucursal: Sucursal;
  isSelected: boolean;
  onSelect: () => void;
}

export function SucursalCard({ sucursal, isSelected, onSelect }: SucursalCardProps) {
  const formatHorario = (horario: { abre: string; cierra: string } | null) => {
    if (!horario) return 'Cerrado';
    return `${horario.abre} - ${horario.cierra}`;
  };

  const obtenerHorarioHoy = () => {
    const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'] as const;
    const hoy = new Date().getDay();
    const diaHoy = dias[hoy];
    return sucursal.horarioAtencion[diaHoy];
  };

  const horarioHoy = obtenerHorarioHoy();
  const estaAbierto = horarioHoy !== null;

  return (
    <div
      onClick={onSelect}
      className={`
        relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-md
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-slate-200 bg-white hover:border-slate-300'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-slate-900 mb-1">
            {sucursal.nombre}
          </h3>
          <div className="flex items-center text-slate-600 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{sucursal.direccion}</span>
          </div>
        </div>

        {isSelected && (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center ml-4">
            <Check className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Información de contacto */}
      {sucursal.telefono && (
        <div className="flex items-center text-slate-600 text-sm mb-4">
          <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{sucursal.telefono}</span>
        </div>
      )}

      {/* Estado actual */}
      <div className="flex items-center mb-4">
        <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${estaAbierto ? 'text-green-600' : 'text-red-600'}`}>
            {estaAbierto ? 'Abierto hoy' : 'Cerrado hoy'}
          </span>
          {horarioHoy && (
            <span className="text-sm text-slate-600">
              {formatHorario(horarioHoy)}
            </span>
          )}
        </div>
      </div>

      {/* Horarios de la semana */}
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-slate-700 mb-2">Horarios de atención:</h4>
        <div className="grid grid-cols-2 gap-1 text-xs text-slate-600">
          {Object.entries(sucursal.horarioAtencion).map(([dia, horario]) => (
            <div key={dia} className="flex justify-between">
              <span className="capitalize">{dia.slice(0, 3)}:</span>
              <span>{formatHorario(horario)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Indicador de selección */}
      {isSelected && (
        <div className="absolute inset-0 rounded-lg ring-2 ring-blue-500 ring-opacity-50 pointer-events-none" />
      )}
    </div>
  );
}
