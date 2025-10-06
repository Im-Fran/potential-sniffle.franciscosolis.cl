import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Calendar, Clock, MapPin, User, Phone, Mail, Edit3, Plus, Search, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { formatearFechaChile } from '../../lib/time';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface CitaPaciente {
  id: string;
  codigo: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  servicio: string;
  profesional: string;
  sucursal: string;
  direccion: string;
  estado: 'PROGRAMADA' | 'CONFIRMADA' | 'ATENDIDA' | 'REPROGRAMADA' | 'CANCELADA' | 'NO_SHOW';
  notas?: string;
  puedeReprogramar: boolean;
  puedeCancelar: boolean;
  createdAt: string;
}

interface PacienteData {
  id: string;
  rut: string;
  nombre: string;
  email: string;
  telefono?: string;
  fechaNacimiento?: string;
  prevision?: string;
  loginTime: string;
}

export function DashboardPaciente() {
  const navigate = useNavigate();
  const location = useLocation();
  const [paciente, setPaciente] = useState<PacienteData | null>(null);
  const [citas, setCitas] = useState<CitaPaciente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<'todas' | 'futuras' | 'pasadas'>('futuras');
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'info'; texto: string } | null>(null);

  useEffect(() => {
    // Mostrar mensaje si viene del login/registro
    if (location.state?.mensaje) {
      setMensaje({ tipo: 'success', texto: location.state.mensaje });
      setTimeout(() => setMensaje(null), 5000);
    }

    cargarDatosPaciente();
  }, [location.state]);

  const cargarDatosPaciente = async () => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Datos mock del paciente logueado
      const pacienteMock: PacienteData = {
        id: 'pac-123',
        rut: '12.345.678-9',
        nombre: 'Juan Pérez González',
        email: 'juan.perez@ejemplo.com',
        telefono: '+56 9 8765 4321',
        fechaNacimiento: '1985-03-15',
        prevision: 'Fonasa',
        loginTime: new Date().toISOString(),
      };

      // Datos mock de citas del paciente
      const citasMock: CitaPaciente[] = [
        {
          id: 'cita-001',
          codigo: 'DEN-2025-001234',
          fecha: '2025-10-12',
          horaInicio: '14:30',
          horaFin: '15:00',
          servicio: 'Control y Limpieza',
          profesional: 'Dra. Ana Pérez',
          sucursal: 'Clínica Providencia',
          direccion: 'Av. Providencia 1234',
          estado: 'PROGRAMADA',
          puedeReprogramar: true,
          puedeCancelar: true,
          createdAt: '2025-10-01T10:30:00Z',
        },
        {
          id: 'cita-002',
          codigo: 'DEN-2025-001235',
          fecha: '2025-11-15',
          horaInicio: '10:00',
          horaFin: '10:30',
          servicio: 'Control',
          profesional: 'Dr. Luis Soto',
          sucursal: 'Clínica Maipú',
          direccion: 'Av. Américo Vespucio 456',
          estado: 'CONFIRMADA',
          puedeReprogramar: true,
          puedeCancelar: true,
          createdAt: '2025-10-02T15:20:00Z',
        },
        {
          id: 'cita-003',
          codigo: 'DEN-2025-001230',
          fecha: '2025-09-20',
          horaInicio: '16:00',
          horaFin: '17:00',
          servicio: 'Endodoncia',
          profesional: 'Dra. Ana Pérez',
          sucursal: 'Clínica Providencia',
          direccion: 'Av. Providencia 1234',
          estado: 'ATENDIDA',
          notas: 'Tratamiento completado exitosamente',
          puedeReprogramar: false,
          puedeCancelar: false,
          createdAt: '2025-09-10T09:15:00Z',
        },
        {
          id: 'cita-004',
          codigo: 'DEN-2025-001228',
          fecha: '2025-08-10',
          horaInicio: '11:30',
          horaFin: '12:00',
          servicio: 'Limpieza',
          profesional: 'Dr. Luis Soto',
          sucursal: 'Clínica Maipú',
          direccion: 'Av. Américo Vespucio 456',
          estado: 'ATENDIDA',
          puedeReprogramar: false,
          puedeCancelar: false,
          createdAt: '2025-08-01T14:45:00Z',
        },
        {
          id: 'cita-005',
          codigo: 'DEN-2025-001220',
          fecha: '2025-07-25',
          horaInicio: '09:00',
          horaFin: '09:30',
          servicio: 'Control',
          profesional: 'Dra. Ana Pérez',
          sucursal: 'Clínica Providencia',
          direccion: 'Av. Providencia 1234',
          estado: 'CANCELADA',
          notas: 'Cancelada por el paciente',
          puedeReprogramar: false,
          puedeCancelar: false,
          createdAt: '2025-07-15T11:20:00Z',
        },
      ];

      setPaciente(pacienteMock);
      setCitas(citasMock);

    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarCitas = () => {
    let citasFiltradas = citas;

    // Filtrar por estado
    const hoy = new Date().toISOString().split('T')[0];
    switch (filtroEstado) {
      case 'futuras':
        citasFiltradas = citasFiltradas.filter(cita =>
          cita.fecha >= hoy && ['PROGRAMADA', 'CONFIRMADA'].includes(cita.estado)
        );
        break;
      case 'pasadas':
        citasFiltradas = citasFiltradas.filter(cita =>
          cita.fecha < hoy || ['ATENDIDA', 'CANCELADA', 'NO_SHOW'].includes(cita.estado)
        );
        break;
    }

    // Filtrar por búsqueda
    if (busqueda) {
      citasFiltradas = citasFiltradas.filter(cita =>
        cita.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        cita.servicio.toLowerCase().includes(busqueda.toLowerCase()) ||
        cita.profesional.toLowerCase().includes(busqueda.toLowerCase()) ||
        cita.sucursal.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Ordenar por fecha (futuras: próximas primero, pasadas: recientes primero)
    return citasFiltradas.sort((a, b) => {
      if (filtroEstado === 'futuras') {
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      } else {
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      }
    });
  };

  const handleReprogramar = (citaId: string) => {
    navigate(`/paciente/reprogramar/${citaId}`);
  };

  const handleCancelar = async (citaId: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) return;

    try {
      // Aquí iría la lógica real de cancelación
      setCitas(prev => prev.map(cita =>
        cita.id === citaId
          ? { ...cita, estado: 'CANCELADA' as const, puedeReprogramar: false, puedeCancelar: false }
          : cita
      ));

      setMensaje({ tipo: 'success', texto: 'Cita cancelada exitosamente' });
      setTimeout(() => setMensaje(null), 5000);

    } catch (error) {
      console.error('Error al cancelar cita:', error);
    }
  };

  const handleLogout = () => {
    // Aquí iría la lógica real de logout
    navigate('/paciente/login');
  };

  const getEstadoColor = (estado: CitaPaciente['estado']) => {
    const colores = {
      PROGRAMADA: 'bg-blue-100 text-blue-800',
      CONFIRMADA: 'bg-green-100 text-green-800',
      ATENDIDA: 'bg-emerald-100 text-emerald-800',
      REPROGRAMADA: 'bg-yellow-100 text-yellow-800',
      CANCELADA: 'bg-red-100 text-red-800',
      NO_SHOW: 'bg-gray-100 text-gray-800',
    };
    return colores[estado];
  };

  const getEstadoTexto = (estado: CitaPaciente['estado']) => {
    const textos = {
      PROGRAMADA: 'Programada',
      CONFIRMADA: 'Confirmada',
      ATENDIDA: 'Atendida',
      REPROGRAMADA: 'Reprogramada',
      CANCELADA: 'Cancelada',
      NO_SHOW: 'No Asistió',
    };
    return textos[estado];
  };

  const citasFiltradas = filtrarCitas();
  const citasFuturas = citas.filter(c => c.fecha >= new Date().toISOString().split('T')[0] && ['PROGRAMADA', 'CONFIRMADA'].includes(c.estado));
  const citasPasadas = citas.filter(c => c.fecha < new Date().toISOString().split('T')[0] || ['ATENDIDA', 'CANCELADA', 'NO_SHOW'].includes(c.estado));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Cargando tu información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Bienvenido, {paciente?.nombre}
              </h1>
              <p className="text-slate-600">
                RUT: {paciente?.rut} • Gestiona tus citas médicas
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/reservar')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Cita</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>

          {/* Mensaje de notificación */}
          {mensaje && (
            <div className={`mt-4 p-4 rounded-lg ${
              mensaje.tipo === 'success' ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex items-center space-x-2">
                <CheckCircle className={`w-5 h-5 ${
                  mensaje.tipo === 'success' ? 'text-green-600' : 'text-blue-600'
                }`} />
                <span className={`text-sm font-medium ${
                  mensaje.tipo === 'success' ? 'text-green-800' : 'text-blue-800'
                }`}>
                  {mensaje.texto}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Información del paciente */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Mi Perfil</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-slate-500" />
                  <div>
                    <div className="text-sm text-slate-600">Nombre</div>
                    <div className="font-medium text-slate-900">{paciente?.nombre}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-slate-500" />
                  <div>
                    <div className="text-sm text-slate-600">Email</div>
                    <div className="font-medium text-slate-900">{paciente?.email}</div>
                  </div>
                </div>

                {paciente?.telefono && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-slate-500" />
                    <div>
                      <div className="text-sm text-slate-600">Teléfono</div>
                      <div className="font-medium text-slate-900">{paciente.telefono}</div>
                    </div>
                  </div>
                )}

                {paciente?.prevision && (
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-slate-500" />
                    <div>
                      <div className="text-sm text-slate-600">Previsión</div>
                      <div className="font-medium text-slate-900">{paciente.prevision}</div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate('/paciente/perfil')}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Editar Perfil</span>
                </button>
              </div>
            </div>

            {/* Resumen de citas */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Resumen</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Citas Próximas</span>
                  <span className="font-semibold text-blue-600">{citasFuturas.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Citas Pasadas</span>
                  <span className="font-semibold text-slate-600">{citasPasadas.length}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="font-medium text-slate-700">Total Citas</span>
                  <span className="font-bold text-slate-900">{citas.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content - Lista de citas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-lg font-semibold text-slate-900">Mis Citas</h2>

                  {/* Filtros y búsqueda */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar citas..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <select
                      value={filtroEstado}
                      onChange={(e) => setFiltroEstado(e.target.value as any)}
                      className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="todas">Todas las citas</option>
                      <option value="futuras">Citas próximas</option>
                      <option value="pasadas">Historial</option>
                    </select>
                  </div>
                </div>

                {/* Navegación de tabs */}
                <div className="mt-4 flex space-x-6">
                  {[
                    { key: 'todas', label: 'Todas', count: citas.length },
                    { key: 'futuras', label: 'Próximas', count: citasFuturas.length },
                    { key: 'pasadas', label: 'Historial', count: citasPasadas.length },
                  ].map(({ key, label, count }) => (
                    <button
                      key={key}
                      onClick={() => setFiltroEstado(key as any)}
                      className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                        filtroEstado === key
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {label} ({count})
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-slate-200">
                {citasFiltradas.length === 0 ? (
                  <div className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      No tienes citas {filtroEstado === 'futuras' ? 'próximas' : filtroEstado === 'pasadas' ? 'pasadas' : ''}
                    </h3>
                    <p className="text-slate-600 mb-6">
                      {filtroEstado === 'futuras' ?
                        'Agenda tu primera cita para recibir atención médica' :
                        busqueda ? 'No se encontraron citas que coincidan con tu búsqueda' :
                        'Aún no tienes un historial de citas'
                      }
                    </p>
                    {filtroEstado === 'futuras' && (
                      <button
                        onClick={() => navigate('/reservar')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Agendar Primera Cita
                      </button>
                    )}
                  </div>
                ) : (
                  citasFiltradas.map((cita) => (
                    <div key={cita.id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(cita.estado)}`}>
                              {getEstadoTexto(cita.estado)}
                            </span>
                            <span className="text-xs text-slate-500">#{cita.codigo}</span>
                          </div>

                          <h3 className="text-lg font-medium text-slate-900 mb-2">
                            {cita.servicio}
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <div>
                                <span className="text-slate-600">Fecha:</span>
                                <div className="font-medium text-slate-900">
                                  {formatearFechaChile(cita.fecha)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-slate-500" />
                              <div>
                                <span className="text-slate-600">Horario:</span>
                                <div className="font-medium text-slate-900">
                                  {cita.horaInicio} - {cita.horaFin}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-slate-500" />
                              <div>
                                <span className="text-slate-600">Profesional:</span>
                                <div className="font-medium text-slate-900">{cita.profesional}</div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-slate-500" />
                              <div>
                                <span className="text-slate-600">Sucursal:</span>
                                <div className="font-medium text-slate-900">{cita.sucursal}</div>
                              </div>
                            </div>
                          </div>

                          {cita.notas && (
                            <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                              <p className="text-sm text-slate-700">
                                <strong>Notas:</strong> {cita.notas}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Acciones */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          {cita.puedeReprogramar && (
                            <button
                              onClick={() => handleReprogramar(cita.id)}
                              className="px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                            >
                              Reprogramar
                            </button>
                          )}

                          {cita.puedeCancelar && (
                            <button
                              onClick={() => handleCancelar(cita.id)}
                              className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                            >
                              Cancelar
                            </button>
                          )}

                          <button
                            onClick={() => navigate(`/cita/${cita.codigo}`)}
                            className="px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                          >
                            Ver Detalle
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
