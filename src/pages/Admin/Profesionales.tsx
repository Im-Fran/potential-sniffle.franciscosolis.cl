import { useState, useEffect } from 'react';
import { Plus, Edit3, Search, User, MapPin, Star, Clock } from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import type { Profesional, Sucursal } from '../../types/domain';

interface ProfesionalExtendido extends Profesional {
  email?: string;
  telefono?: string;
  activo: boolean;
  fechaIngreso: string;
  totalCitas: number;
  calificacionPromedio: number;
}

export function AdminProfesionales() {
  const [profesionales, setProfesionales] = useState<ProfesionalExtendido[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroSucursal, setFiltroSucursal] = useState('');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState<ProfesionalExtendido | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Datos mock expandidos
      const profesionalesMock: ProfesionalExtendido[] = [
        {
          id: 'prof-1',
          nombre: 'Dra. Ana Pérez González',
          email: 'ana.perez@clinica.cl',
          telefono: '+56 9 1111 2222',
          especialidades: ['Odontología General', 'Endodoncia'],
          sucursalIds: ['suc-1', 'suc-2'],
          turnos: [
            { diaSemana: 1, desde: '09:00', hasta: '13:00', sucursalId: 'suc-1' },
            { diaSemana: 1, desde: '14:30', hasta: '18:00', sucursalId: 'suc-1' },
            { diaSemana: 2, desde: '09:00', hasta: '13:00', sucursalId: 'suc-1' },
            { diaSemana: 2, desde: '14:30', hasta: '18:00', sucursalId: 'suc-1' },
            { diaSemana: 4, desde: '09:00', hasta: '13:00', sucursalId: 'suc-2' },
            { diaSemana: 5, desde: '09:00', hasta: '13:00', sucursalId: 'suc-2' },
          ],
          activo: true,
          fechaIngreso: '2023-01-15',
          totalCitas: 342,
          calificacionPromedio: 4.8,
        },
        {
          id: 'prof-2',
          nombre: 'Dr. Luis Soto Ramírez',
          email: 'luis.soto@clinica.cl',
          telefono: '+56 9 3333 4444',
          especialidades: ['Odontología General', 'Cirugía Oral'],
          sucursalIds: ['suc-1'],
          turnos: [
            { diaSemana: 2, desde: '10:00', hasta: '13:00', sucursalId: 'suc-1' },
            { diaSemana: 2, desde: '15:00', hasta: '19:00', sucursalId: 'suc-1' },
            { diaSemana: 3, desde: '10:00', hasta: '13:00', sucursalId: 'suc-1' },
            { diaSemana: 4, desde: '10:00', hasta: '13:00', sucursalId: 'suc-1' },
            { diaSemana: 5, desde: '10:00', hasta: '13:00', sucursalId: 'suc-1' },
            { diaSemana: 6, desde: '10:00', hasta: '13:00', sucursalId: 'suc-1' },
          ],
          activo: true,
          fechaIngreso: '2022-08-20',
          totalCitas: 298,
          calificacionPromedio: 4.6,
        },
        {
          id: 'prof-3',
          nombre: 'Dra. Carmen Silva Díaz',
          email: 'carmen.silva@clinica.cl',
          telefono: '+56 9 5555 6666',
          especialidades: ['Ortodoncia', 'Odontopediatría'],
          sucursalIds: ['suc-2'],
          turnos: [
            { diaSemana: 1, desde: '14:00', hasta: '18:00', sucursalId: 'suc-2' },
            { diaSemana: 3, desde: '14:00', hasta: '18:00', sucursalId: 'suc-2' },
            { diaSemana: 5, desde: '14:00', hasta: '18:00', sucursalId: 'suc-2' },
          ],
          activo: false,
          fechaIngreso: '2024-03-10',
          totalCitas: 87,
          calificacionPromedio: 4.9,
        },
      ];

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

      setProfesionales(profesionalesMock);
      setSucursales(sucursalesMock);

    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarProfesionales = () => {
    let profesionalesFiltrados = profesionales;

    if (busqueda) {
      profesionalesFiltrados = profesionalesFiltrados.filter(prof =>
        prof.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        prof.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
        prof.especialidades.some(esp => esp.toLowerCase().includes(busqueda.toLowerCase()))
      );
    }

    if (filtroSucursal) {
      profesionalesFiltrados = profesionalesFiltrados.filter(prof =>
        prof.sucursalIds.includes(filtroSucursal)
      );
    }

    if (filtroEspecialidad) {
      profesionalesFiltrados = profesionalesFiltrados.filter(prof =>
        prof.especialidades.includes(filtroEspecialidad)
      );
    }

    return profesionalesFiltrados;
  };

  const especialidadesUnicas = Array.from(
    new Set(profesionales.flatMap(prof => prof.especialidades))
  );

  const handleEditarProfesional = (profesional: ProfesionalExtendido) => {
    setProfesionalSeleccionado(profesional);
    setMostrarModal(true);
  };

  const handleToggleActivo = (profesionalId: string) => {
    setProfesionales(prev => prev.map(prof =>
      prof.id === profesionalId
        ? { ...prof, activo: !prof.activo }
        : prof
    ));
  };

  const getSucursalNombre = (sucursalId: string) => {
    return sucursales.find(suc => suc.id === sucursalId)?.nombre || 'Desconocida';
  };

  const formatearHorarios = (profesional: ProfesionalExtendido) => {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const horariosPorSucursal = profesional.turnos.reduce((acc, turno) => {
      const sucursal = getSucursalNombre(turno.sucursalId);
      if (!acc[sucursal]) acc[sucursal] = [];
      acc[sucursal].push(`${dias[turno.diaSemana]}: ${turno.desde}-${turno.hasta}`);
      return acc;
    }, {} as Record<string, string[]>);

    return Object.entries(horariosPorSucursal);
  };

  const profesionalesFiltrados = filtrarProfesionales();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Gestión de Profesionales</h1>
              <p className="text-slate-600">Administra profesionales, horarios y especialidades</p>
            </div>

            <button
              onClick={() => {
                setProfesionalSeleccionado(null);
                setMostrarModal(true);
              }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Profesional</span>
            </button>
          </div>

          {/* Filtros */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar profesional..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

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
              <span>{profesionalesFiltrados.length} de {profesionales.length} profesionales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-slate-600">Cargando profesionales...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profesionalesFiltrados.map((profesional) => (
              <div key={profesional.id} className="bg-white rounded-lg shadow-sm border p-6">
                {/* Header de la tarjeta */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{profesional.nombre}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          profesional.activo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {profesional.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditarProfesional(profesional)}
                      className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleActivo(profesional.id)}
                      className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded"
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Especialidades */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Especialidades</h4>
                  <div className="flex flex-wrap gap-1">
                    {profesional.especialidades.map((especialidad, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {especialidad}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Información de contacto */}
                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500">Email:</span>
                    <span className="text-slate-700">{profesional.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500">Teléfono:</span>
                    <span className="text-slate-700">{profesional.telefono}</span>
                  </div>
                </div>

                {/* Sucursales */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Sucursales</h4>
                  <div className="space-y-1">
                    {profesional.sucursalIds.map(sucursalId => (
                      <div key={sucursalId} className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-600">{getSucursalNombre(sucursalId)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Horarios */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Horarios</h4>
                  <div className="space-y-1">
                    {formatearHorarios(profesional).map(([sucursal, horarios]) => (
                      <div key={sucursal} className="text-xs">
                        <div className="font-medium text-slate-600">{sucursal}:</div>
                        <div className="text-slate-500 ml-2">
                          {horarios.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="border-t border-slate-200 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-slate-900">{profesional.totalCitas}</div>
                      <div className="text-xs text-slate-500">Citas Total</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-lg font-semibold text-slate-900">{profesional.calificacionPromedio}</span>
                      </div>
                      <div className="text-xs text-slate-500">Calificación</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {profesionalesFiltrados.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No se encontraron profesionales
            </h3>
            <p className="text-slate-600 mb-6">
              {busqueda || filtroSucursal || filtroEspecialidad
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Aún no hay profesionales registrados en el sistema'
              }
            </p>
            {(!busqueda && !filtroSucursal && !filtroEspecialidad) && (
              <button
                onClick={() => {
                  setProfesionalSeleccionado(null);
                  setMostrarModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Agregar Primer Profesional
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal de edición (placeholder) */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                {profesionalSeleccionado ? 'Editar Profesional' : 'Nuevo Profesional'}
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
                Formulario de profesional en desarrollo. Por ahora, esta funcionalidad se simula con los datos mock.
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
