import { useServicios } from '../../hooks/useApi';
import { ServicioCard } from '../ServicioCard';
import { LoadingSpinner } from '../LoadingSpinner';
import { AlertCircle } from 'lucide-react';
import type { ReservaStep, Servicio } from '../../types/domain';

interface StepServicioProps {
  reservaData: ReservaStep;
  updateReservaData: (data: Partial<ReservaStep>) => void;
  nextStep: () => void;
}

export function StepServicio({ reservaData, updateReservaData, nextStep }: StepServicioProps) {
  const { data: servicios, isLoading, error } = useServicios({
    sucursalId: reservaData.sucursal?.id
  });

  const handleServicioSelect = (servicio: Servicio) => {
    updateReservaData({
      servicio,
      // Limpiar selecciones posteriores si cambia el servicio
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
        <p className="mt-4 text-slate-600">Cargando servicios disponibles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Error al cargar servicios
        </h3>
        <p className="text-slate-600 mb-4">
          No pudimos cargar la información de nuestros servicios. Por favor, intenta nuevamente.
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

  if (!servicios || servicios.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          No hay servicios disponibles
        </h3>
        <p className="text-slate-600">
          No encontramos servicios disponibles en la sucursal seleccionada.
        </p>
      </div>
    );
  }

  // Agrupar servicios por especialidad
  const serviciosPorEspecialidad = servicios.reduce((grupos, servicio) => {
    const especialidad = servicio.especialidad || 'General';
    if (!grupos[especialidad]) {
      grupos[especialidad] = [];
    }
    grupos[especialidad].push(servicio);
    return grupos;
  }, {} as Record<string, Servicio[]>);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          ¿Qué tipo de atención necesitas?
        </h2>
        <p className="text-slate-600">
          Selecciona el servicio que mejor describa tu necesidad dental.
        </p>

        {reservaData.sucursal && (
          <div className="mt-3 text-sm text-slate-500">
            Servicios disponibles en <span className="font-medium">{reservaData.sucursal.nombre}</span>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {Object.entries(serviciosPorEspecialidad).map(([especialidad, serviciosGrupo]) => (
          <div key={especialidad}>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              {especialidad}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviciosGrupo.map((servicio) => (
                <ServicioCard
                  key={servicio.id}
                  servicio={servicio}
                  isSelected={reservaData.servicio?.id === servicio.id}
                  onSelect={() => handleServicioSelect(servicio)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {reservaData.servicio && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-green-800">
              Servicio seleccionado: {reservaData.servicio.nombre}
              <span className="text-green-600">
                ({reservaData.servicio.duracionMinutos} min)
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
