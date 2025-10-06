import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Filter, Search, Clock, User, MapPin, Edit3, X, Check } from 'lucide-react';
import { format, addDays, subDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatearFechaChile, obtenerFechaHoyChile } from '../../lib/time';
import { CrearCitaAdmin } from '../Admin/CrearCitaAdmin';

type VistaAgenda = 'dia' | 'semana';

interface CitaAgenda {
  id: string;
  codigo: string;
  paciente: {
    nombre: string;
    telefono?: string;
    rut: string;
  };
  servicio: string;
  profesional: string;
  sucursal: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: 'PROGRAMADA' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA' | 'NO_SHOW';
  duracion: number;
  notas?: string;
}

export function AdminAgenda() {
  const [vista, setVista] = useState<VistaAgenda>('dia');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(obtenerFechaHoyChile());
  const [filtros, setFiltros] = useState({
    sucursal: '',
    profesional: '',
    estado: '',
    busqueda: '',
  });
  const [citas, setCitas] = useState<CitaAgenda[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mostrarCrearCita, setMostrarCrearCita] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<CitaAgenda | null>(null);
  const [mostrarDetallesCita, setMostrarDetallesCita] = useState(false);

  // Datos mock para profesionales y sucursales
  const sucursales = [
    { id: 'suc-1', nombre: 'Providencia' },
    { id: 'suc-2', nombre: 'Maipú' },
  ];

  const profesionales = [
    { id: 'prof-1', nombre: 'Dra. Ana Pérez' },
    { id: 'prof-2', nombre: 'Dr. Luis Soto' },
  ];

  const estados = [
    { value: 'PROGRAMADA', label: 'Programada' },
    { value: 'CONFIRMADA', label: 'Confirmada' },
    { value: 'ATENDIDA', label: 'Atendida' },
    { value: 'CANCELADA', label: 'Cancelada' },
    { value: 'NO_SHOW', label: 'No Show' },
  ];

  useEffect(() => {
    cargarCitas();
  }, [fechaSeleccionada, filtros]);

  const cargarCitas = async () => {
    setIsLoading(true);

    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 500));

    // Datos mock expandidos
    const citasMock: CitaAgenda[] = [
      {
        id: '1',
        codigo: '2501011001',
        paciente: {
          nombre: 'María González',
          telefono: '+56 9 1234 5678',
          rut: '12.345.678-9'
        },
        servicio: 'Limpieza',
        profesional: 'Dra. Ana Pérez',
        sucursal: 'Providencia',
        fecha: fechaSeleccionada,
        horaInicio: '09:00',
        horaFin: '09:30',
        estado: 'CONFIRMADA',
        duracion: 30,
        notas: 'Primera consulta'
      },
      {
        id: '2',
        codigo: '2501011002',
        paciente: {
          nombre: 'Carlos Silva',
          telefono: '+56 9 8765 4321',
          rut: '23.456.789-0'
        },
        servicio: 'Control',
        profesional: 'Dr. Luis Soto',
        sucursal: 'Providencia',
        fecha: fechaSeleccionada,
        horaInicio: '09:30',
        horaFin: '09:45',
        estado: 'PROGRAMADA',
        duracion: 15,
      },
      {
        id: '3',
        codigo: '2501011003',
        paciente: {
          nombre: 'Ana Martínez',
          rut: '34.567.890-1'
        },
        servicio: 'Endodoncia',
        profesional: 'Dra. Ana Pérez',
        sucursal: 'Providencia',
        fecha: fechaSeleccionada,
        horaInicio: '10:00',
        horaFin: '11:00',
        estado: 'ATENDIDA',
        duracion: 60,
        notas: 'Tratamiento de conducto finalizado'
      },
      {
        id: '4',
        codigo: '2501011004',
        paciente: {
          nombre: 'Pedro Rodríguez',
          telefono: '+56 9 5555 1234',
          rut: '45.678.901-2'
        },
        servicio: 'Urgencia',
        profesional: 'Dr. Luis Soto',
        sucursal: 'Maipú',
        fecha: fechaSeleccionada,
        horaInicio: '14:00',
        horaFin: '14:30',
        estado: 'NO_SHOW',
        duracion: 30,
      },
    ];

    // Aplicar filtros
    let citasFiltradas = citasMock;

    if (filtros.sucursal) {
      citasFiltradas = citasFiltradas.filter(cita =>
        cita.sucursal.toLowerCase().includes(filtros.sucursal.toLowerCase())
      );
    }

    if (filtros.profesional) {
      citasFiltradas = citasFiltradas.filter(cita =>
        cita.profesional.toLowerCase().includes(filtros.profesional.toLowerCase())
      );
    }

    if (filtros.estado) {
      citasFiltradas = citasFiltradas.filter(cita => cita.estado === filtros.estado);
    }

    if (filtros.busqueda) {
      citasFiltradas = citasFiltradas.filter(cita =>
        cita.paciente.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        cita.paciente.rut.includes(filtros.busqueda) ||
        cita.codigo.includes(filtros.busqueda)
      );
    }

    setCitas(citasFiltradas);
    setIsLoading(false);
  };

  const cambiarFecha = (direccion: 'anterior' | 'siguiente') => {
    if (vista === 'dia') {
      setFechaSeleccionada(
        direccion === 'anterior'
          ? format(subDays(new Date(fechaSeleccionada), 1), 'yyyy-MM-dd')
          : format(addDays(new Date(fechaSeleccionada), 1), 'yyyy-MM-dd')
      );
    } else {
      // Para vista semanal
      const fechaActual = new Date(fechaSeleccionada);
      const nuevaFecha = direccion === 'anterior'
        ? subWeeks(fechaActual, 1)
        : addWeeks(fechaActual, 1);
      setFechaSeleccionada(format(nuevaFecha, 'yyyy-MM-dd'));
    }
  };

  const getEstadoColor = (estado: CitaAgenda['estado']) => {
    const colores = {
      PROGRAMADA: 'bg-blue-500',
      CONFIRMADA: 'bg-green-500',
      ATENDIDA: 'bg-purple-500',
      CANCELADA: 'bg-red-500',
      NO_SHOW: 'bg-gray-500',
    };
    return colores[estado];
  };

  const getEstadoTexto = (estado: CitaAgenda['estado']) => {
    const textos = {
      PROGRAMADA: 'Programada',
      CONFIRMADA: 'Confirmada',
      ATENDIDA: 'Atendida',
      CANCELADA: 'Cancelada',
      NO_SHOW: 'No asistió',
    };
    return textos[estado];
  };

  const generarHorarios = () => {
    const horarios = [];
    for (let i = 8; i <= 19; i++) {
      horarios.push(`${i.toString().padStart(2, '0')}:00`);
      horarios.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return horarios;
  };

  const citasPorHorario = (hora: string) => {
    return citas.filter(cita => cita.horaInicio <= hora && cita.horaFin > hora);
  };

  const handleCitaClick = (cita: CitaAgenda) => {
    setCitaSeleccionada(cita);
    setMostrarDetallesCita(true);
  };

  const handleCambiarEstado = async (citaId: string, nuevoEstado: CitaAgenda['estado']) => {
    setCitas(citas.map(cita =>
      cita.id === citaId ? { ...cita, estado: nuevoEstado } : cita
    ));
    setMostrarDetallesCita(false);
  };

  const handleNuevaCitaExitosa = (nuevaCita: any) => {
    cargarCitas(); // Recargar la lista de citas
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Agenda</h1>
              <p className="text-slate-600">Gestión de citas y horarios</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Selector de vista */}
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setVista('dia')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    vista === 'dia' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Día
                </button>
                <button
                  onClick={() => setVista('semana')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    vista === 'semana' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semana
                </button>
              </div>

              <button
                onClick={() => setMostrarCrearCita(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva cita</span>
              </button>
            </div>
          </div>

          {/* Navegación de fecha y filtros */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => cambiarFecha('anterior')}
                className="p-2 hover:bg-slate-100 rounded-md transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-900">
                  {vista === 'dia'
                    ? formatearFechaChile(fechaSeleccionada)
                    : `Semana del ${formatearFechaChile(format(startOfWeek(new Date(fechaSeleccionada), { weekStartsOn: 1 }), 'yyyy-MM-dd'))}`
                  }
                </span>
              </div>

              <button
                onClick={() => cambiarFecha('siguiente')}
                className="p-2 hover:bg-slate-100 rounded-md transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setFechaSeleccionada(obtenerFechaHoyChile())}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                Hoy
              </button>
            </div>

            {/* Filtros y búsqueda */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar paciente, RUT o código..."
                  value={filtros.busqueda}
                  onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                  className="pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={filtros.sucursal}
                onChange={(e) => setFiltros({...filtros, sucursal: e.target.value})}
                className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las sucursales</option>
                {sucursales.map(sucursal => (
                  <option key={sucursal.id} value={sucursal.nombre}>{sucursal.nombre}</option>
                ))}
              </select>

              <select
                value={filtros.profesional}
                onChange={(e) => setFiltros({...filtros, profesional: e.target.value})}
                className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los profesionales</option>
                {profesionales.map(profesional => (
                  <option key={profesional.id} value={profesional.nombre}>{profesional.nombre}</option>
                ))}
              </select>

              <select
                value={filtros.estado}
                onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                {estados.map(estado => (
                  <option key={estado.value} value={estado.value}>{estado.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Cargando agenda...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Vista de día */}
            {vista === 'dia' && (
              <div className="divide-y divide-slate-200">
                {generarHorarios().map((hora) => {
                  const citasEnHora = citasPorHorario(hora);

                  return (
                    <div key={hora} className="flex">
                      {/* Columna de hora */}
                      <div className="w-20 flex-shrink-0 p-4 text-sm text-slate-500 font-medium border-r border-slate-100">
                        {hora}
                      </div>

                      {/* Columna de citas */}
                      <div className="flex-1 min-h-[60px] p-4">
                        {citasEnHora.length > 0 ? (
                          <div className="space-y-2">
                            {citasEnHora.map((cita) => (
                              <div
                                key={cita.id}
                                onClick={() => handleCitaClick(cita)}
                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors border-l-4"
                                style={{ borderLeftColor: getEstadoColor(cita.estado).replace('bg-', '#').replace('500', '') }}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className={`w-3 h-3 rounded-full ${getEstadoColor(cita.estado)}`} />
                                  <div>
                                    <p className="font-medium text-slate-900">{cita.paciente.nombre}</p>
                                    <p className="text-sm text-slate-600">
                                      {cita.servicio} • {cita.profesional} • {cita.sucursal}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      RUT: {cita.paciente.rut} • Código: {cita.codigo}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-4 text-sm text-slate-500">
                                  <span>{cita.horaInicio} - {cita.horaFin}</span>
                                  <span className="px-2 py-1 bg-white rounded text-xs font-medium">
                                    {getEstadoTexto(cita.estado)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-slate-400">
                            <span className="text-sm">Sin citas programadas</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Vista de semana */}
            {vista === 'semana' && (
              <div className="p-6">
                <div className="text-center text-slate-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Vista semanal en desarrollo</p>
                  <p className="text-sm mt-2">Próximamente podrás ver la agenda semanal completa</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Resumen del día */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{citas.length}</p>
                <p className="text-sm text-slate-600">Citas del día</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {citas.filter(c => c.estado === 'CONFIRMADA').length}
                </p>
                <p className="text-sm text-slate-600">Confirmadas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3">
              <Check className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {citas.filter(c => c.estado === 'ATENDIDA').length}
                </p>
                <p className="text-sm text-slate-600">Atendidas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3">
              <X className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {citas.filter(c => c.estado === 'NO_SHOW' || c.estado === 'CANCELADA').length}
                </p>
                <p className="text-sm text-slate-600">Ausencias</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear cita */}
      <CrearCitaAdmin
        isOpen={mostrarCrearCita}
        onClose={() => setMostrarCrearCita(false)}
        onSuccess={handleNuevaCitaExitosa}
      />

      {/* Modal de detalles de cita */}
      {mostrarDetallesCita && citaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                Detalles de la Cita
              </h2>
              <button
                onClick={() => setMostrarDetallesCita(false)}
                className="p-2 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Código de cita</label>
                  <p className="font-mono text-lg font-semibold text-slate-900">{citaSeleccionada.codigo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Estado</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-3 h-3 rounded-full ${getEstadoColor(citaSeleccionada.estado)}`} />
                    <span className="font-medium">{getEstadoTexto(citaSeleccionada.estado)}</span>
                  </div>
                </div>
              </div>

              {/* Información del paciente */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-3">Información del Paciente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-600">Nombre:</span>
                    <span className="ml-2 font-medium">{citaSeleccionada.paciente.nombre}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">RUT:</span>
                    <span className="ml-2 font-medium">{citaSeleccionada.paciente.rut}</span>
                  </div>
                  {citaSeleccionada.paciente.telefono && (
                    <div>
                      <span className="text-slate-600">Teléfono:</span>
                      <span className="ml-2 font-medium">{citaSeleccionada.paciente.telefono}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Detalles de la cita */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-3">Detalles de la Cita</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-600">Fecha:</span>
                    <span className="ml-2 font-medium">{formatearFechaChile(citaSeleccionada.fecha)}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Horario:</span>
                    <span className="ml-2 font-medium">{citaSeleccionada.horaInicio} - {citaSeleccionada.horaFin}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Servicio:</span>
                    <span className="ml-2 font-medium">{citaSeleccionada.servicio}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Profesional:</span>
                    <span className="ml-2 font-medium">{citaSeleccionada.profesional}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Sucursal:</span>
                    <span className="ml-2 font-medium">{citaSeleccionada.sucursal}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Duración:</span>
                    <span className="ml-2 font-medium">{citaSeleccionada.duracion} minutos</span>
                  </div>
                </div>

                {citaSeleccionada.notas && (
                  <div className="mt-3">
                    <span className="text-slate-600">Notas:</span>
                    <p className="mt-1 text-sm text-slate-700 bg-white rounded p-2">{citaSeleccionada.notas}</p>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap gap-2">
                {citaSeleccionada.estado === 'PROGRAMADA' && (
                  <button
                    onClick={() => handleCambiarEstado(citaSeleccionada.id, 'CONFIRMADA')}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Confirmar
                  </button>
                )}

                {(citaSeleccionada.estado === 'PROGRAMADA' || citaSeleccionada.estado === 'CONFIRMADA') && (
                  <>
                    <button
                      onClick={() => handleCambiarEstado(citaSeleccionada.id, 'ATENDIDA')}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                    >
                      Marcar Atendida
                    </button>
                    <button
                      onClick={() => handleCambiarEstado(citaSeleccionada.id, 'NO_SHOW')}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                    >
                      No Show
                    </button>
                    <button
                      onClick={() => handleCambiarEstado(citaSeleccionada.id, 'CANCELADA')}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  </>
                )}

                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                  <Edit3 className="w-3 h-3 inline mr-1" />
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
