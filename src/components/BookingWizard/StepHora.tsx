import { useDisponibilidad } from '../../hooks/useApi';
import { TimeSlotGrid } from '../TimeSlotGrid';
import { LoadingSpinner } from '../LoadingSpinner';
import { AlertCircle, Clock } from 'lucide-react';
import { formatearFechaChile } from '../../lib/time';
import type { ReservaStep } from '../../types/domain';

interface StepHoraProps {
  reservaData: ReservaStep;
  updateReservaData: (data: Partial<ReservaStep>) => void;
  nextStep: () => void;
}

export function StepHora({ reservaData, updateReservaData, nextStep }: StepHoraProps) {
  const { data: slots, isLoading, error } = useDisponibilidad(
    reservaData.profesional?.id || '',
    reservaData.fecha || '',
    reservaData.servicio?.id || '',
    !!(reservaData.profesional && reservaData.fecha && reservaData.servicio)
  );

  const handleHoraSelect = (horaInicio: string) => {
    updateReservaData({
      hora: horaInicio,
    });
    nextStep();
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-slate-600">Cargando horarios disponibles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Error al cargar horarios
        </h3>
        <p className="text-slate-600 mb-4">
          No pudimos cargar los horarios disponibles. Por favor, intenta nuevamente.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const slotsDisponibles = slots?.filter(slot => slot.disponible) || [];
  const slotsOcupados = slots?.filter(slot => !slot.disponible) || [];

  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          No hay horarios configurados
        </h3>
        <p className="text-slate-600">
          El profesional no tiene horarios configurados para esta fecha.
        </p>
      </div>
    );
  }

  if (slotsDisponibles.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          No hay horas disponibles
        </h3>
        <p className="text-slate-600 mb-6">
          No encontramos horarios disponibles para esta combinación.
          Prueba otra fecha u otro profesional.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => updateReservaData({ fecha: undefined })}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Cambiar fecha
          </button>

          <button
            onClick={() => updateReservaData({ profesional: undefined, fecha: undefined })}
            className="ml-3 bg-slate-200 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-300 transition-colors"
          >
            Cambiar profesional
          </button>
        </div>

        {/* Mostrar lista de espera option */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">¿Aún quieres esta fecha?</h4>
          <p className="text-sm text-blue-700 mb-3">
            Únete a nuestra lista de espera y te notificaremos si se libera un horario.
          </p>
          <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
            Unirse a lista de espera
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Selecciona tu horario
        </h2>
        <p className="text-slate-600">
          Elige la hora que más te convenga para tu cita dental.
        </p>

        <div className="mt-3 text-sm text-slate-500 space-y-1">
          {reservaData.sucursal && (
            <p>Sucursal: <span className="font-medium">{reservaData.sucursal.nombre}</span></p>
          )}
          {reservaData.servicio && (
            <p>Servicio: <span className="font-medium">{reservaData.servicio.nombre}</span> ({reservaData.servicio.duracionMinutos} min)</p>
          )}
          {reservaData.profesional && (
            <p>Profesional: <span className="font-medium">{reservaData.profesional.nombre}</span></p>
          )}
          {reservaData.fecha && (
            <p>Fecha: <span className="font-medium">{formatearFechaChile(reservaData.fecha)}</span></p>
          )}
        </div>
      </div>

      {/* Grid de horarios */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">
          Horarios disponibles ({slotsDisponibles.length}):
        </h3>

        <TimeSlotGrid
          slots={slotsDisponibles}
          selectedHora={reservaData.hora}
          onHoraSelect={handleHoraSelect}
          duracionServicio={reservaData.servicio?.duracionMinutos || 30}
        />
      </div>

      {/* Horarios ocupados (para referencia) */}
      {slotsOcupados.length > 0 && (
        <div className="mt-8">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-900">
              Ver horarios no disponibles ({slotsOcupados.length})
            </summary>
            <div className="mt-3">
              <TimeSlotGrid
                slots={slotsOcupados}
                selectedHora={undefined}
                onHoraSelect={() => {}} // No seleccionable
                duracionServicio={reservaData.servicio?.duracionMinutos || 30}
                readOnly
              />
            </div>
          </details>
        </div>
      )}

      {reservaData.hora && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-green-800">
              Hora seleccionada: {reservaData.hora}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
