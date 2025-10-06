import { useState } from 'react';
import { DatePicker } from '../DatePicker';
import { LoadingSpinner } from '../LoadingSpinner';
import { Calendar, ArrowRight } from 'lucide-react';
import { obtenerFechaHoyChile, formatearFechaChile, obtenerProximosDiasLaborables } from '../../lib/time';
import type { ReservaStep } from '../../types/domain';

interface StepFechaProps {
  reservaData: ReservaStep;
  updateReservaData: (data: Partial<ReservaStep>) => void;
  nextStep: () => void;
}

export function StepFecha({ reservaData, updateReservaData, nextStep }: StepFechaProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFechaSelect = (fecha: string) => {
    updateReservaData({
      fecha,
      // Limpiar selección de hora si cambia la fecha
      hora: undefined,
    });
    nextStep();
  };

  const handleProximaDisponibilidad = async () => {
    setIsLoading(true);

    try {
      // Simular búsqueda de próxima disponibilidad
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Por ahora seleccionar el primer día laboral
      const diasLaborales = obtenerProximosDiasLaborables(10);
      const proximaFecha = diasLaborales[0];

      handleFechaSelect(proximaFecha);
    } catch (error) {
      console.error('Error al buscar próxima disponibilidad:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          ¿Cuándo quieres tu cita?
        </h2>
        <p className="text-slate-600">
          Selecciona la fecha que más te convenga para tu atención dental.
        </p>

        <div className="mt-3 text-sm text-slate-500 space-y-1">
          {reservaData.sucursal && (
            <p>Sucursal: <span className="font-medium">{reservaData.sucursal.nombre}</span></p>
          )}
          {reservaData.servicio && (
            <p>Servicio: <span className="font-medium">{reservaData.servicio.nombre}</span></p>
          )}
          {reservaData.profesional && (
            <p>Profesional: <span className="font-medium">{reservaData.profesional.nombre}</span></p>
          )}
        </div>
      </div>

      {/* Opciones rápidas */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Opciones rápidas:</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Próxima disponibilidad */}
          <button
            onClick={handleProximaDisponibilidad}
            disabled={isLoading}
            className="flex items-center justify-between p-4 border-2 border-blue-200 bg-blue-50 rounded-lg hover:border-blue-300 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="text-left">
                <h4 className="font-medium text-slate-900">Próxima disponibilidad</h4>
                <p className="text-sm text-slate-600">Te mostramos la fecha más cercana</p>
              </div>
            </div>
          </button>

          {/* Hoy */}
          <button
            onClick={() => handleFechaSelect(obtenerFechaHoyChile())}
            className="flex items-center justify-between p-4 border-2 border-green-200 bg-green-50 rounded-lg hover:border-green-300 hover:bg-green-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-slate-900">Hoy</h4>
                <p className="text-sm text-slate-600">{formatearFechaChile(obtenerFechaHoyChile())}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Calendar picker */}
      <div>
        <h3 className="text-lg font-medium text-slate-900 mb-4">O selecciona una fecha específica:</h3>

        <DatePicker
          selectedDate={reservaData.fecha}
          onDateSelect={handleFechaSelect}
          minDate={obtenerFechaHoyChile()}
          profesional={reservaData.profesional}
          sucursal={reservaData.sucursal}
        />
      </div>

      {reservaData.fecha && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-green-800">
              Fecha seleccionada: {formatearFechaChile(reservaData.fecha)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
