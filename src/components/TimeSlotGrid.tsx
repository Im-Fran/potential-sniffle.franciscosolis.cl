import { Clock, X } from 'lucide-react';
import type { DisponibilidadSlot } from '../types/domain';

interface TimeSlotGridProps {
  slots: DisponibilidadSlot[];
  selectedHora?: string;
  onHoraSelect: (horaInicio: string, horaFin: string) => void;
  duracionServicio: number;
  readOnly?: boolean;
}

export function TimeSlotGrid({
  slots,
  selectedHora,
  onHoraSelect,
  duracionServicio,
  readOnly = false
}: TimeSlotGridProps) {

  const getMotivoTexto = (motivo?: DisponibilidadSlot['motivoNoDisponible']) => {
    switch (motivo) {
      case 'OCUPADO': return 'Ocupado';
      case 'FUERA_TURNO': return 'Fuera de turno';
      case 'BLOQUEO': return 'Bloqueado';
      case 'FUERA_HORARIO': return 'Horario pasado';
      case 'BUFFER': return 'Buffer requerido';
      default: return 'No disponible';
    }
  };

  const getSlotStyles = (slot: DisponibilidadSlot, isSelected: boolean) => {
    if (readOnly || !slot.disponible) {
      return {
        button: `
          cursor-not-allowed opacity-60
          ${slot.disponible 
            ? 'bg-slate-100 border-slate-200 text-slate-600' 
            : 'bg-red-50 border-red-200 text-red-600'
          }
        `,
        text: slot.disponible ? 'text-slate-600' : 'text-red-600'
      };
    }

    if (isSelected) {
      return {
        button: 'bg-blue-600 border-blue-600 text-white shadow-md ring-2 ring-blue-100',
        text: 'text-white'
      };
    }

    return {
      button: 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700',
      text: 'text-slate-700'
    };
  };

  // Agrupar slots por períodos (mañana, tarde)
  const agruparSlotsPorPeriodo = (slots: DisponibilidadSlot[]) => {
    const grupos: Record<string, DisponibilidadSlot[]> = {
      mañana: [],
      tarde: []
    };

    slots.forEach(slot => {
      const hora = parseInt(slot.horaInicio.split(':')[0]);
      if (hora < 14) {
        grupos.mañana.push(slot);
      } else {
        grupos.tarde.push(slot);
      }
    });

    return grupos;
  };

  const gruposSlots = agruparSlotsPorPeriodo(slots);

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No hay horarios para mostrar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(gruposSlots).map(([periodo, slotsGrupo]) => {
        if (slotsGrupo.length === 0) return null;

        return (
          <div key={periodo}>
            <h4 className="text-sm font-medium text-slate-700 mb-3 capitalize flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {periodo} ({slotsGrupo.length} horarios)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {slotsGrupo.map((slot, index) => {
                const isSelected = selectedHora === slot.horaInicio;
                const styles = getSlotStyles(slot, isSelected);

                return (
                  <button
                    key={`${slot.horaInicio}-${index}`}
                    onClick={() => {
                      if (!readOnly && slot.disponible) {
                        onHoraSelect(slot.horaInicio, slot.horaFin);
                      }
                    }}
                    disabled={readOnly || !slot.disponible}
                    className={`
                      relative p-3 border-2 rounded-lg transition-all duration-200 text-sm font-medium
                      ${styles.button}
                    `}
                    title={slot.disponible ? `Disponible ${slot.horaInicio}` : getMotivoTexto(slot.motivoNoDisponible)}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className={`text-base ${styles.text}`}>
                        {slot.horaInicio}
                      </span>

                      {slot.disponible ? (
                        <span className={`text-xs opacity-75 ${styles.text}`}>
                          {duracionServicio}min
                        </span>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <X className="w-3 h-3" />
                          <span className="text-xs">
                            {getMotivoTexto(slot.motivoNoDisponible)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Indicador de selección */}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Leyenda */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap gap-4 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white border-2 border-slate-200 rounded" />
            <span>Disponible</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded" />
            <span>Seleccionado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-50 border-2 border-red-200 rounded" />
            <span>No disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
}
