import { useSucursales } from '../../hooks/useApi';
import { SucursalCard } from '../SucursalCard';
import { LoadingSpinner } from '../LoadingSpinner';
import { AlertCircle } from 'lucide-react';
import type { ReservaStep, Sucursal } from '../../types/domain';

interface StepSucursalProps {
  reservaData: ReservaStep;
  updateReservaData: (data: Partial<ReservaStep>) => void;
  nextStep: () => void;
}

export function StepSucursal({ reservaData, updateReservaData, nextStep }: StepSucursalProps) {
  const { data: sucursales, isLoading, error } = useSucursales();

  const handleSucursalSelect = (sucursal: Sucursal) => {
    updateReservaData({
      sucursal,
      // Limpiar selecciones posteriores si cambia la sucursal
      profesional: undefined,
      fecha: undefined,
      hora: undefined,
    });
    nextStep();
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-slate-600">Cargando sucursales...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Error al cargar sucursales
        </h3>
        <p className="text-slate-600 mb-4">
          No pudimos cargar la información de nuestras sucursales. Por favor, intenta nuevamente.
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

  if (!sucursales || sucursales.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          No hay sucursales disponibles
        </h3>
        <p className="text-slate-600">
          Actualmente no tenemos sucursales disponibles para reservas.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Selecciona una sucursal
        </h2>
        <p className="text-slate-600">
          Elige la ubicación más conveniente para tu cita dental.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sucursales.map((sucursal) => (
          <SucursalCard
            key={sucursal.id}
            sucursal={sucursal}
            isSelected={reservaData.sucursal?.id === sucursal.id}
            onSelect={() => handleSucursalSelect(sucursal)}
          />
        ))}
      </div>

      {reservaData.sucursal && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-green-800">
              Sucursal seleccionada: {reservaData.sucursal.nombre}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
