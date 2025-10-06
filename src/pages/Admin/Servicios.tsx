import { useState, useEffect } from 'react';
import { Plus, Edit3, Clock, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import type { Servicio } from '../../types/domain';

interface ServicioExtendido extends Servicio {
  precio: number;
  citasMes: number;
  ingresosMes: number;
  tiempoPromedio: number;
  activo: boolean;
  descripcion: string;
  requiereEspecialista: boolean;
}

export function AdminServicios() {
  const [servicios, setServicios] = useState<ServicioExtendido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioExtendido | null>(null);

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Datos mock expandidos
      const serviciosMock: ServicioExtendido[] = [
        {
          id: 'serv-1',
          nombre: 'Control',
          especialidad: 'Odontología General',
          duracionMinutos: 15,
          precio: 25000,
          citasMes: 156,
          ingresosMes: 3900000,
          tiempoPromedio: 12,
          activo: true,
          descripcion: 'Evaluación dental general de rutina',
          requiereEspecialista: false,
        },
        {
          id: 'serv-2',
          nombre: 'Limpieza/Profilaxis',
          especialidad: 'Odontología General',
          duracionMinutos: 30,
          bufferPosteriorMin: 5,
          precio: 45000,
          citasMes: 89,
          ingresosMes: 4005000,
          tiempoPromedio: 32,
          activo: true,
          descripcion: 'Limpieza profunda y eliminación de sarro',
          requiereEspecialista: false,
        },
        {
          id: 'serv-3',
          nombre: 'Urgencia',
          especialidad: 'Odontología General',
          duracionMinutos: 30,
          precio: 35000,
          citasMes: 67,
          ingresosMes: 2345000,
          tiempoPromedio: 28,
          activo: true,
          descripcion: 'Atención inmediata para dolor o molestias',
          requiereEspecialista: false,
        },
        {
          id: 'serv-4',
          nombre: 'Endodoncia',
          especialidad: 'Endodoncia',
          duracionMinutos: 60,
          bufferPosteriorMin: 10,
          precio: 180000,
          citasMes: 23,
          ingresosMes: 4140000,
          tiempoPromedio: 65,
          activo: true,
          descripcion: 'Tratamiento de conducto para salvar el diente',
          requiereEspecialista: true,
        },
        {
          id: 'serv-5',
          nombre: 'Ortodoncia Consulta',
          especialidad: 'Ortodoncia',
          duracionMinutos: 45,
          precio: 65000,
          citasMes: 34,
          ingresosMes: 2210000,
          tiempoPromedio: 48,
          activo: true,
          descripcion: 'Evaluación para tratamiento de ortodoncia',
          requiereEspecialista: true,
        },
        {
          id: 'serv-6',
          nombre: 'Blanqueamiento',
          especialidad: 'Estética Dental',
          duracionMinutos: 90,
          bufferPosteriorMin: 15,
          precio: 120000,
          citasMes: 12,
          ingresosMes: 1440000,
          tiempoPromedio: 85,
          activo: false,
          descripcion: 'Blanqueamiento dental profesional',
          requiereEspecialista: false,
        },
      ];

      setServicios(serviciosMock);

    } catch (error) {
      console.error('Error al cargar servicios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarServicios = () => {
    let serviciosFiltrados = servicios;

    if (busqueda) {
      serviciosFiltrados = serviciosFiltrados.filter(serv =>
        serv.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        serv.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        serv.especialidad?.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (filtroEspecialidad) {
      serviciosFiltrados = serviciosFiltrados.filter(serv =>
        serv.especialidad === filtroEspecialidad
      );
    }

    return serviciosFiltrados.sort((a, b) => b.citasMes - a.citasMes);
  };

  const especialidadesUnicas = Array.from(
    new Set(servicios.map(serv => serv.especialidad).filter(Boolean))
  );

  const handleEditarServicio = (servicio: ServicioExtendido) => {
    setServicioSeleccionado(servicio);
    setMostrarModal(true);
  };

  const handleToggleActivo = (servicioId: string) => {
    setServicios(prev => prev.map(serv =>
      serv.id === servicioId
        ? { ...serv, activo: !serv.activo }
        : serv
    ));
  };

  const formatearPeso = (valor: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const serviciosFiltrados = filtrarServicios();
  const totalIngresosMes = servicios.reduce((acc, serv) => acc + serv.ingresosMes, 0);
  const totalCitasMes = servicios.reduce((acc, serv) => acc + serv.citasMes, 0);
  const serviciosActivos = servicios.filter(serv => serv.activo).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Gestión de Servicios</h1>
              <p className="text-slate-600">Administra servicios, precios y configuraciones</p>
            </div>

            <button
              onClick={() => {
                setServicioSeleccionado(null);
                setMostrarModal(true);
              }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Servicio</span>
            </button>
          </div>

          {/* Filtros */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filtroEspecialidad}
              onChange={(e) => setFiltroEspecialidad(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las especialidades</option>
              {especialidadesUnicas.map(especialidad => (
                <option key={especialidad} value={especialidad}>{especialidad}</option>
              ))}
            </select>

            <div className="text-sm text-slate-600 flex items-center">
              <span>{serviciosFiltrados.length} de {servicios.length} servicios</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-slate-600">Cargando servicios...</p>
          </div>
        ) : (
          <>
            {/* Resumen general */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-slate-900">{serviciosActivos}</p>
                    <p className="text-sm text-slate-600">Servicios Activos</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-slate-900">{totalCitasMes}</p>
                    <p className="text-sm text-slate-600">Citas este Mes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-slate-900">{formatearPeso(totalIngresosMes)}</p>
                    <p className="text-sm text-slate-600">Ingresos Mes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-slate-900">
                      {Math.round(servicios.reduce((acc, serv) => acc + serv.tiempoPromedio, 0) / servicios.length)}
                    </p>
                    <p className="text-sm text-slate-600">Min Promedio</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de servicios */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Lista de Servicios</h2>
              </div>

              <div className="divide-y divide-slate-200">
                {serviciosFiltrados.map((servicio) => (
                  <div key={servicio.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {servicio.nombre}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            servicio.activo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {servicio.activo ? 'Activo' : 'Inactivo'}
                          </span>
                          {servicio.requiereEspecialista && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                              Especialista
                            </span>
                          )}
                        </div>

                        <p className="text-slate-600 text-sm mb-3">{servicio.descripcion}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <div>
                              <span className="text-slate-600">Duración:</span>
                              <div className="font-medium text-slate-900">{servicio.duracionMinutos} min</div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-slate-500" />
                            <div>
                              <span className="text-slate-600">Precio:</span>
                              <div className="font-medium text-slate-900">{formatearPeso(servicio.precio)}</div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-slate-500" />
                            <div>
                              <span className="text-slate-600">Citas/Mes:</span>
                              <div className="font-medium text-slate-900">{servicio.citasMes}</div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4 text-slate-500" />
                            <div>
                              <span className="text-slate-600">Ingresos/Mes:</span>
                              <div className="font-medium text-slate-900">{formatearPeso(servicio.ingresosMes)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Especialidad y buffers */}
                        <div className="mt-3 flex items-center space-x-4 text-xs text-slate-500">
                          <span><strong>Especialidad:</strong> {servicio.especialidad}</span>
                          {servicio.bufferPrevioMin && (
                            <span><strong>Buffer previo:</strong> {servicio.bufferPrevioMin} min</span>
                          )}
                          {servicio.bufferPosteriorMin && (
                            <span><strong>Buffer posterior:</strong> {servicio.bufferPosteriorMin} min</span>
                          )}
                        </div>
                      </div>

                      <div className="ml-6 flex items-center space-x-2">
                        <button
                          onClick={() => handleEditarServicio(servicio)}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Editar servicio"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleActivo(servicio.id)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            servicio.activo
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {servicio.activo ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {serviciosFiltrados.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No se encontraron servicios
            </h3>
            <p className="text-slate-600 mb-6">
              {busqueda || filtroEspecialidad
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando los servicios que ofrece la clínica'
              }
            </p>
            {(!busqueda && !filtroEspecialidad) && (
              <button
                onClick={() => {
                  setServicioSeleccionado(null);
                  setMostrarModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Agregar Primer Servicio
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal de edición (placeholder) */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                {servicioSeleccionado ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h2>
              <button
                onClick={() => setMostrarModal(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-4">
                Formulario de servicio en desarrollo. Por ahora, esta funcionalidad se simula con los datos mock.
              </p>

              {servicioSeleccionado && (
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-slate-900 mb-2">Servicio seleccionado:</h3>
                  <div className="text-sm text-slate-700 space-y-1">
                    <p><strong>Nombre:</strong> {servicioSeleccionado.nombre}</p>
                    <p><strong>Especialidad:</strong> {servicioSeleccionado.especialidad}</p>
                    <p><strong>Duración:</strong> {servicioSeleccionado.duracionMinutos} minutos</p>
                    <p><strong>Precio:</strong> {formatearPeso(servicioSeleccionado.precio)}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="px-4 py-2 text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setMostrarModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
