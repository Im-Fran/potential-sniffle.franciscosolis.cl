import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, AlertTriangle, Edit3, Trash2, Filter } from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatearFechaChile } from '../../lib/time';
import type { Bloqueo, Profesional, Sucursal } from '../../types/domain';

interface BloqueoExtendido extends Bloqueo {
  id: string;
  tipo: 'FERIADO' | 'PAUSA' | 'MANTENIMIENTO' | 'PERSONAL' | 'OTRO';
  profesionalNombre?: string;
  sucursalNombre: string;
  recurrente: boolean;
  creadoPor: string;
  fechaCreacion: string;
}

export function AdminBloqueos() {
  const [bloqueos, setBloqueos] = useState<BloqueoExtendido[]>([]);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroSucursal, setFiltroSucursal] = useState('');
  const [filtroProfesional, setFiltroProfesional] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [bloqueoSeleccionado, setBloqueoSeleccionado] = useState<BloqueoExtendido | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Datos mock
      const sucursalesMock: Sucursal[] = [
        {
          id: 'suc-1',
          nombre: 'Providencia',
          direccion: 'Av. Providencia 1234',
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
        },
        {
          id: 'suc-2',
          nombre: 'Maipú',
          direccion: 'Av. Américo Vespucio 456',
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
        },
      ];

      const profesionalesMock: Profesional[] = [
        {
          id: 'prof-1',
          nombre: 'Dra. Ana Pérez',
          especialidades: ['Odontología General', 'Endodoncia'],
          sucursalIds: ['suc-1', 'suc-2'],
          turnos: [],
        },
        {
          id: 'prof-2',
          nombre: 'Dr. Luis Soto',
          especialidades: ['Odontología General'],
          sucursalIds: ['suc-1'],
          turnos: [],
        },
      ];

      const bloqueosMock: BloqueoExtendido[] = [
        {
          id: 'bloq-1',
          fecha: '2025-01-01',
          desde: '00:00',
          hasta: '23:59',
          motivo: 'Año Nuevo',
          sucursalId: 'suc-1',
          sucursalNombre: 'Providencia',
          tipo: 'FERIADO',
          recurrente: true,
          creadoPor: 'Sistema',
          fechaCreacion: '2024-12-01T10:00:00Z',
        },
        {
          id: 'bloq-2',
          fecha: '2025-01-01',
          desde: '00:00',
          hasta: '23:59',
          motivo: 'Año Nuevo',
          sucursalId: 'suc-2',
          sucursalNombre: 'Maipú',
          tipo: 'FERIADO',
          recurrente: true,
          creadoPor: 'Sistema',
          fechaCreacion: '2024-12-01T10:00:00Z',
        },
        {
          id: 'bloq-3',
          fecha: '2025-10-05',
          desde: '13:00',
          hasta: '14:30',
          motivo: 'Colación diaria',
          sucursalId: 'suc-1',
          sucursalNombre: 'Providencia',
          tipo: 'PAUSA',
          recurrente: true,
          creadoPor: 'Admin',
          fechaCreacion: '2024-01-15T09:00:00Z',
        },
        {
          id: 'bloq-4',
          fecha: '2025-10-10',
          desde: '15:00',
          hasta: '17:00',
          motivo: 'Capacitación en nuevos equipos',
          profesionalId: 'prof-1',
          profesionalNombre: 'Dra. Ana Pérez',
          sucursalId: 'suc-1',
          sucursalNombre: 'Providencia',
          tipo: 'PERSONAL',
          recurrente: false,
          creadoPor: 'María González',
          fechaCreacion: '2025-10-01T14:20:00Z',
        },
        {
          id: 'bloq-5',
          fecha: '2025-10-15',
          desde: '08:00',
          hasta: '10:00',
          motivo: 'Mantenimiento de equipos',
          sucursalId: 'suc-2',
          sucursalNombre: 'Maipú',
          tipo: 'MANTENIMIENTO',
          recurrente: false,
          creadoPor: 'Admin',
          fechaCreacion: '2025-09-30T16:45:00Z',
        },
      ];

      setSucursales(sucursalesMock);
      setProfesionales(profesionalesMock);
      setBloqueos(bloqueosMock);

    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarBloqueos = () => {
    let bloqueosFiltrados = bloqueos;

    if (filtroTipo) {
      bloqueosFiltrados = bloqueosFiltrados.filter(bloq => bloq.tipo === filtroTipo);
    }

    if (filtroSucursal) {
      bloqueosFiltrados = bloqueosFiltrados.filter(bloq => bloq.sucursalId === filtroSucursal);
    }

    if (filtroProfesional) {
      bloqueosFiltrados = bloqueosFiltrados.filter(bloq =>
        bloq.profesionalId === filtroProfesional || filtroProfesional === 'sin-profesional' && !bloq.profesionalId
      );
    }

    // Ordenar por fecha (próximos primero)
    return bloqueosFiltrados.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  };

  const handleEditarBloqueo = (bloqueo: BloqueoExtendido) => {
    setBloqueoSeleccionado(bloqueo);
    setMostrarModal(true);
  };

  const handleEliminarBloqueo = (bloqueoId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este bloqueo?')) {
      setBloqueos(prev => prev.filter(bloq => bloq.id !== bloqueoId));
    }
  };

  const getTipoColor = (tipo: BloqueoExtendido['tipo']) => {
    const colores = {
      FERIADO: 'bg-red-100 text-red-800',
      PAUSA: 'bg-yellow-100 text-yellow-800',
      MANTENIMIENTO: 'bg-purple-100 text-purple-800',
      PERSONAL: 'bg-blue-100 text-blue-800',
      OTRO: 'bg-gray-100 text-gray-800',
    };
    return colores[tipo];
  };

  const getTipoTexto = (tipo: BloqueoExtendido['tipo']) => {
    const textos = {
      FERIADO: 'Feriado',
      PAUSA: 'Pausa',
      MANTENIMIENTO: 'Mantenimiento',
      PERSONAL: 'Personal',
      OTRO: 'Otro',
    };
    return textos[tipo];
  };

  const esBloqueoProximo = (fecha: string) => {
    return new Date(fecha) >= new Date();
  };

  const bloqueosFiltrados = filtrarBloqueos();
  const bloqueosProximos = bloqueos.filter(bloq => esBloqueoProximo(bloq.fecha));
  const bloqueosPorTipo = bloqueos.reduce((acc, bloq) => {
    acc[bloq.tipo] = (acc[bloq.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Bloqueos y Feriados</h1>
              <p className="text-slate-600">Gestiona pausas, feriados y mantenimientos</p>
            </div>

            <button
              onClick={() => {
                setBloqueoSeleccionado(null);
                setMostrarModal(true);
              }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Bloqueo</span>
            </button>
          </div>

          {/* Filtros */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="FERIADO">Feriados</option>
              <option value="PAUSA">Pausas</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
              <option value="PERSONAL">Personal</option>
              <option value="OTRO">Otros</option>
            </select>

            <select
              value={filtroSucursal}
              onChange={(e) => setFiltroSucursal(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las sucursales</option>
              {sucursales.map(sucursal => (
                <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</option>
              ))}
            </select>

            <select
              value={filtroProfesional}
              onChange={(e) => setFiltroProfesional(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los profesionales</option>
              <option value="sin-profesional">Bloqueos generales</option>
              {profesionales.map(profesional => (
                <option key={profesional.id} value={profesional.id}>{profesional.nombre}</option>
              ))}
            </select>

            <div className="text-sm text-slate-600 flex items-center">
              <span>{bloqueosFiltrados.length} de {bloqueos.length} bloqueos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-slate-600">Cargando bloqueos...</p>
          </div>
        ) : (
          <>
            {/* Resumen por tipos */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {Object.entries(bloqueosPorTipo).map(([tipo, cantidad]) => (
                <div key={tipo} className="bg-white rounded-lg shadow-sm border p-4 text-center">
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    getTipoColor(tipo as BloqueoExtendido['tipo']).replace('text-', 'bg-').replace('800', '100')
                  }`}>
                    <span className="text-xs font-bold">{cantidad}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-700">
                    {getTipoTexto(tipo as BloqueoExtendido['tipo'])}
                  </p>
                </div>
              ))}
            </div>

            {/* Lista de bloqueos */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Bloqueos Programados ({bloqueosProximos.length} próximos)
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <Filter className="w-4 h-4" />
                    <span>Filtros activos: {[filtroTipo, filtroSucursal, filtroProfesional].filter(Boolean).length}</span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-200">
                {bloqueosFiltrados.map((bloqueo) => {
                  const esFuturo = esBloqueoProximo(bloqueo.fecha);

                  return (
                    <div key={bloqueo.id} className={`p-6 hover:bg-slate-50 transition-colors ${
                      !esFuturo ? 'opacity-75' : ''
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTipoColor(bloqueo.tipo)}`}>
                              {getTipoTexto(bloqueo.tipo)}
                            </span>
                            {bloqueo.recurrente && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                Recurrente
                              </span>
                            )}
                            {!esFuturo && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                Pasado
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-medium text-slate-900 mb-2">
                            {bloqueo.motivo || 'Sin motivo especificado'}
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <div>
                                <span className="text-slate-600">Fecha:</span>
                                <div className="font-medium text-slate-900">
                                  {formatearFechaChile(bloqueo.fecha)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-slate-500" />
                              <div>
                                <span className="text-slate-600">Horario:</span>
                                <div className="font-medium text-slate-900">
                                  {bloqueo.desde} - {bloqueo.hasta}
                                </div>
                              </div>
                            </div>

                            <div>
                              <span className="text-slate-600">Sucursal:</span>
                              <div className="font-medium text-slate-900">{bloqueo.sucursalNombre}</div>
                            </div>

                            <div>
                              <span className="text-slate-600">Ámbito:</span>
                              <div className="font-medium text-slate-900">
                                {bloqueo.profesionalNombre || 'Toda la sucursal'}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center space-x-4 text-xs text-slate-500">
                            <span>Creado por: <strong>{bloqueo.creadoPor}</strong></span>
                            <span>Fecha: {new Date(bloqueo.fechaCreacion).toLocaleDateString('es-CL')}</span>
                          </div>
                        </div>

                        <div className="ml-6 flex items-center space-x-2">
                          <button
                            onClick={() => handleEditarBloqueo(bloqueo)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Editar bloqueo"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleEliminarBloqueo(bloqueo.id)}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Eliminar bloqueo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {bloqueosFiltrados.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No se encontraron bloqueos
            </h3>
            <p className="text-slate-600 mb-6">
              {filtroTipo || filtroSucursal || filtroProfesional
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Aún no hay bloqueos programados en el sistema'
              }
            </p>
            <button
              onClick={() => {
                setBloqueoSeleccionado(null);
                setMostrarModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Crear Primer Bloqueo
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
                {bloqueoSeleccionado ? 'Editar Bloqueo' : 'Nuevo Bloqueo'}
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
                Formulario de bloqueo en desarrollo. Esta funcionalidad permite programar:
              </p>
              <ul className="text-sm text-slate-700 list-disc list-inside space-y-1 mb-4">
                <li>Feriados nacionales y locales</li>
                <li>Pausas para colación o descansos</li>
                <li>Mantenimiento de equipos</li>
                <li>Ausencias del personal</li>
                <li>Bloqueos recurrentes (diarios, semanales)</li>
              </ul>

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
