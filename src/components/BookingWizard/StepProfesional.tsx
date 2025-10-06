import { useProfesionales } from '../../hooks/useApi';
import { ProfesionalCard } from '../ProfesionalCard';
import { LoadingSpinner } from '../LoadingSpinner';
import { AlertCircle } from 'lucide-react';
import type { ReservaStep, Profesional } from '../../types/domain';

interface StepProfesionalProps {
  reservaData: ReservaStep;
  updateReservaData: (data: Partial<ReservaStep>) => void;
  nextStep: () => void;
}

export function StepProfesional({ reservaData, updateReservaData, nextStep }: StepProfesionalProps) {
  const { data: profesionales, isLoading, error } = useProfesionales({
    sucursalId: reservaData.sucursal?.id,
    especialidad: reservaData.servicio?.especialidad
  });

  const handleProfesionalSelect = (profesional: Profesional) => {
    updateReservaData({
      profesional,
      // Limpiar selecciones posteriores si cambia el profesional
      fecha: undefined,
      hora: undefined,
    });
    nextStep();
  };

  const handleCualquierProfesional = () => {
    if (profesionales && profesionales.length > 0) {
      // Seleccionar el primer profesional disponible
      handleProfesionalSelect(profesionales[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-slate-600">Cargando profesionales disponibles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Error al cargar profesionales
        </h3>
        <p className="text-slate-600 mb-4">
          No pudimos cargar la información de nuestros profesionales. Por favor, intenta nuevamente.
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

  if (!profesionales || profesionales.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          No hay profesionales disponibles
        </h3>
        <p className="text-slate-600">
          No encontramos profesionales disponibles para el servicio seleccionado en esta sucursal.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Elige tu profesional
        </h2>
        <p className="text-slate-600">
          Selecciona el dentista que prefieres o deja que asignemos uno automáticamente.
        </p>

        <div className="mt-3 text-sm text-slate-500 space-y-1">
          {reservaData.sucursal && (
            <p>Sucursal: <span className="font-medium">{reservaData.sucursal.nombre}</span></p>
          )}
          {reservaData.servicio && (
            <p>Servicio: <span className="font-medium">{reservaData.servicio.nombre}</span></p>
          )}
        </div>
      </div>

      {/* Opción "Cualquier profesional" */}
      <div className="mb-6">
        <div
          onClick={handleCualquierProfesional}
          className="cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <div className="text-2xl mb-2">🎯</div>
          <h3 className="font-semibold text-slate-900 mb-1">
            Cualquier profesional disponible
          </h3>
          <p className="text-sm text-slate-600">
            Te asignaremos automáticamente al primer profesional con disponibilidad
          </p>
        </div>
      </div>

      {/* Lista de profesionales */}
      <div>
        <h3 className="text-lg font-medium text-slate-900 mb-4">
          O elige un profesional específico:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profesionales.map((profesional) => (
            <ProfesionalCard
              key={profesional.id}
              profesional={profesional}
              sucursal={reservaData.sucursal!}
              isSelected={reservaData.profesional?.id === profesional.id}
              onSelect={() => handleProfesionalSelect(profesional)}
            />
          ))}
        </div>
      </div>

      {reservaData.profesional && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-green-800">
              Profesional seleccionado: {reservaData.profesional.nombre}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
