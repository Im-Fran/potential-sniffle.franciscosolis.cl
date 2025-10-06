import { User, Clock, MapPin, Check, Star } from 'lucide-react';
import type { Profesional, Sucursal } from '../types/domain';

interface ProfesionalCardProps {
  profesional: Profesional;
  sucursal: Sucursal;
  isSelected: boolean;
  onSelect: () => void;
}

export function ProfesionalCard({ profesional, sucursal, isSelected, onSelect }: ProfesionalCardProps) {
  const getTurnosEnSucursal = () => {
    return profesional.turnos.filter(turno => turno.sucursalId === sucursal.id);
  };

  const formatearDiaSemana = (dia: number) => {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return dias[dia === 0 ? 0 : dia];
  };

  const formatearTurnos = () => {
    const turnos = getTurnosEnSucursal();
    if (turnos.length === 0) return 'No disponible en esta sucursal';

    // Agrupar turnos por días consecutivos con mismo horario
    const diasHorarios = turnos.reduce((acc, turno) => {
      const key = `${turno.desde}-${turno.hasta}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(turno.diaSemana);
      return acc;
    }, {} as Record<string, number[]>);

    return Object.entries(diasHorarios).map(([horario, dias]) => {
      const [desde, hasta] = horario.split('-');
      const diasFormateados = dias
        .sort()
        .map(formatearDiaSemana)
        .join(', ');

      return `${diasFormateados}: ${desde}-${hasta}`;
    }).join(' • ');
  };

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
        <div className="flex items-center space-x-3 flex-1">
          {/* Avatar placeholder */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 truncate">
              {profesional.nombre}
            </h3>
            <div className="flex items-center mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-slate-600 ml-1">
                Profesional certificado
              </span>
            </div>
          </div>
        </div>

        {isSelected && (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center ml-4">
            <Check className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Especialidades */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-slate-700 mb-2">Especialidades:</h4>
        <div className="flex flex-wrap gap-2">
          {profesional.especialidades.map((especialidad, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
            >
              {especialidad}
            </span>
          ))}
        </div>
      </div>

      {/* Horarios en esta sucursal */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <h4 className="text-sm font-medium text-slate-700">
            Horarios en {sucursal.nombre}:
          </h4>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {formatearTurnos()}
        </p>
      </div>

      {/* Otras sucursales */}
      {profesional.sucursalIds.length > 1 && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-slate-500" />
            <h4 className="text-sm font-medium text-slate-700">
              También atiende en:
            </h4>
          </div>
          <p className="text-xs text-slate-600">
            {profesional.sucursalIds.length - 1} sucursal{profesional.sucursalIds.length > 2 ? 'es' : ''} adicional{profesional.sucursalIds.length > 2 ? 'es' : ''}
          </p>
        </div>
      )}

      {/* Próxima disponibilidad (placeholder) */}
      <div className="mt-4 pt-3 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Próxima disponibilidad:</span>
          <span className="text-green-600 font-medium">Hoy disponible</span>
        </div>
      </div>

      {/* Indicador de selección */}
      {isSelected && (
        <div className="absolute inset-0 rounded-lg ring-2 ring-blue-500 ring-opacity-50 pointer-events-none" />
      )}
    </div>
  );
}
