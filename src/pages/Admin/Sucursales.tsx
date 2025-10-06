import { useState, useEffect } from 'react';
import { Plus, Edit3, MapPin, Clock, Phone, Users, Calendar } from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import type { Sucursal } from '../../types/domain';

interface SucursalExtendida extends Sucursal {
  profesionalesCount: number;
  citasMes: number;
  utilizacionPorcentaje: number;
  activa: boolean;
}

export function AdminSucursales() {
  const [sucursales, setSucursales] = useState<SucursalExtendida[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<SucursalExtendida | null>(null);

  useEffect(() => {
    cargarSucursales();
  }, []);

  const cargarSucursales = async () => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Datos mock expandidos
      const sucursalesMock: SucursalExtendida[] = [
        {
          id: 'suc-1',
          nombre: 'Providencia',
          direccion: 'Av. Providencia 1234, Providencia, Santiago',
          telefono: '+56 2 2234 5678',
          horarioAtencion: {
            lunes: { abre: '08:00', cierra: '19:00' },
            martes: { abre: '08:00', cierra: '19:00' },
            miercoles: { abre: '08:00', cierra: '19:00' },
            jueves: { abre: '08:00', cierra: '19:00' },
            viernes: { abre: '08:00', cierra: '19:00' },
            sabado: { abre: '09:00', cierra: '14:00' },
            domingo: null,
          },
          profesionalesCount: 3,
          citasMes: 245,
          utilizacionPorcentaje: 78,
          activa: true,
        },
        {
          id: 'suc-2',
          nombre: 'Maipú',
          direccion: 'Av. Américo Vespucio 456, Maipú, Santiago',
          telefono: '+56 2 2876 5432',
          horarioAtencion: {
            lunes: { abre: '08:30', cierra: '18:30' },
            martes: { abre: '08:30', cierra: '18:30' },
            miercoles: { abre: '08:30', cierra: '18:30' },
            jueves: { abre: '08:30', cierra: '18:30' },
            viernes: { abre: '08:30', cierra: '18:30' },
            sabado: { abre: '09:00', cierra: '13:00' },
            domingo: null,
          },
          profesionalesCount: 2,
          citasMes: 167,
          utilizacionPorcentaje: 65,
          activa: true,
        },
      ];

      setSucursales(sucursalesMock);

    } catch (error) {
      console.error('Error al cargar sucursales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatearHorario = (horario: { abre: string; cierra: string } | null) => {
    if (!horario) return 'Cerrado';
    return `${horario.abre} - ${horario.cierra}`;
  };

  const obtenerEstadoHoy = (sucursal: SucursalExtendida) => {
    const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'] as const;
    const hoy = new Date().getDay();
    const diaHoy = dias[hoy];
    const horarioHoy = sucursal.horarioAtencion[diaHoy];

    if (!horarioHoy) return { estado: 'cerrado', texto: 'Cerrado hoy' };

    const ahora = new Date();
    const horaActual = ahora.getHours() * 60 + ahora.getMinutes();
    const [abreH, abreM] = horarioHoy.abre.split(':').map(Number);
    const [cierraH, cierraM] = horarioHoy.cierra.split(':').map(Number);
    const horaAbre = abreH * 60 + abreM;
    const horaCierra = cierraH * 60 + cierraM;

    if (horaActual < horaAbre) {
      return { estado: 'cerrado', texto: `Abre a las ${horarioHoy.abre}` };
    } else if (horaActual > horaCierra) {
      return { estado: 'cerrado', texto: 'Cerrado' };
    } else {
      return { estado: 'abierto', texto: `Abierto hasta ${horarioHoy.cierra}` };
    }
  };

  const handleEditarSucursal = (sucursal: SucursalExtendida) => {
    setSucursalSeleccionada(sucursal);
    setMostrarModal(true);
  };

  const getUtilizacionColor = (porcentaje: number) => {
    if (porcentaje >= 80) return 'text-green-600';
    if (porcentaje >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Gestión de Sucursales</h1>
              <p className="text-slate-600">Administra ubicaciones y horarios de atención</p>
            </div>

            <button
              onClick={() => {
                setSucursalSeleccionada(null);
                setMostrarModal(true);
              }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Sucursal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-slate-600">Cargando sucursales...</p>
          </div>
        ) : (
          <>
            {/* Resumen general */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-slate-900">{sucursales.length}</p>
                    <p className="text-sm text-slate-600">Sucursales Activas</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-slate-900">
                      {sucursales.reduce((acc, suc) => acc + suc.profesionalesCount, 0)}
                    </p>
                    <p className="text-sm text-slate-600">Profesionales Total</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-slate-900">
                      {sucursales.reduce((acc, suc) => acc + suc.citasMes, 0)}
                    </p>
                    <p className="text-sm text-slate-600">Citas este Mes</p>
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
                      {Math.round(sucursales.reduce((acc, suc) => acc + suc.utilizacionPorcentaje, 0) / sucursales.length)}%
                    </p>
                    <p className="text-sm text-slate-600">Utilización Promedio</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de sucursales */}
            <div className="space-y-6">
              {sucursales.map((sucursal) => {
                const estadoHoy = obtenerEstadoHoy(sucursal);

                return (
                  <div key={sucursal.id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-white" />
                        </div>

                        <div>
                          <h2 className="text-xl font-semibold text-slate-900 mb-1">
                            Sucursal {sucursal.nombre}
                          </h2>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              sucursal.activa 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {sucursal.activa ? 'Activa' : 'Inactiva'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              estadoHoy.estado === 'abierto' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {estadoHoy.texto}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-slate-600">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{sucursal.direccion}</span>
                            </div>
                            {sucursal.telefono && (
                              <div className="flex items-center space-x-1">
                                <Phone className="w-4 h-4" />
                                <span>{sucursal.telefono}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleEditarSucursal(sucursal)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Horarios de atención */}
                      <div>
                        <h3 className="text-lg font-medium text-slate-900 mb-4">Horarios de Atención</h3>
                        <div className="bg-slate-50 rounded-lg p-4">
                          <div className="space-y-2">
                            {Object.entries(sucursal.horarioAtencion).map(([dia, horario]) => (
                              <div key={dia} className="flex justify-between items-center text-sm">
                                <span className="capitalize font-medium text-slate-700">
                                  {dia}:
                                </span>
                                <span className={`${horario ? 'text-slate-900' : 'text-red-600'}`}>
                                  {formatearHorario(horario)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Estadísticas */}
                      <div>
                        <h3 className="text-lg font-medium text-slate-900 mb-4">Estadísticas del Mes</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Users className="w-5 h-5 text-blue-600" />
                              <span className="text-sm font-medium text-slate-700">Profesionales</span>
                            </div>
                            <span className="text-lg font-semibold text-slate-900">
                              {sucursal.profesionalesCount}
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Calendar className="w-5 h-5 text-green-600" />
                              <span className="text-sm font-medium text-slate-700">Citas Atendidas</span>
                            </div>
                            <span className="text-lg font-semibold text-slate-900">
                              {sucursal.citasMes}
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Clock className="w-5 h-5 text-purple-600" />
                              <span className="text-sm font-medium text-slate-700">Utilización</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-lg font-semibold ${getUtilizacionColor(sucursal.utilizacionPorcentaje)}`}>
                                {sucursal.utilizacionPorcentaje}%
                              </span>
                              <div className="w-16 bg-slate-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    sucursal.utilizacionPorcentaje >= 80 ? 'bg-green-500' :
                                    sucursal.utilizacionPorcentaje >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${sucursal.utilizacionPorcentaje}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {sucursales.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No hay sucursales registradas
            </h3>
            <p className="text-slate-600 mb-6">
              Comienza agregando la primera sucursal de la clínica
            </p>
            <button
              onClick={() => {
                setSucursalSeleccionada(null);
                setMostrarModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Agregar Primera Sucursal
            </button>
          </div>
        )}
      </div>

      {/* Modal de edición (placeholder) */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                {sucursalSeleccionada ? 'Editar Sucursal' : 'Nueva Sucursal'}
              </h2>
              <button
                onClick={() => setMostrarModal(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-600">
                Formulario de sucursal en desarrollo. Por ahora, esta funcionalidad se simula con los datos mock.
              </p>
              <div className="mt-4">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
