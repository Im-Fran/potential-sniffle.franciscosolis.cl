import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Clock, Download, RefreshCw } from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatearFechaChile } from '../../lib/time';
import type { ReporteEstadisticas } from '../../types/domain';

interface FiltrosReporte {
  fechaInicio: string;
  fechaFin: string;
  sucursal: string;
  profesional: string;
  servicio: string;
}

export function AdminReportes() {
  const [filtros, setFiltros] = useState<FiltrosReporte>({
    fechaInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Hace 30 días
    fechaFin: new Date().toISOString().split('T')[0], // Hoy
    sucursal: '',
    profesional: '',
    servicio: '',
  });

  const [estadisticas, setEstadisticas] = useState<ReporteEstadisticas | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vistaActiva, setVistaActiva] = useState<'resumen' | 'citas' | 'ingresos' | 'utilizacion' | 'pacientes'>('resumen');

  // Datos mock para filtros
  const sucursales = [
    { id: 'suc-1', nombre: 'Providencia' },
    { id: 'suc-2', nombre: 'Maipú' },
  ];

  const profesionales = [
    { id: 'prof-1', nombre: 'Dra. Ana Pérez' },
    { id: 'prof-2', nombre: 'Dr. Luis Soto' },
  ];

  const servicios = [
    { id: 'serv-1', nombre: 'Control' },
    { id: 'serv-2', nombre: 'Limpieza' },
    { id: 'serv-3', nombre: 'Endodoncia' },
    { id: 'serv-4', nombre: 'Urgencia' },
  ];

  useEffect(() => {
    cargarEstadisticas();
  }, [filtros]);

  const cargarEstadisticas = async () => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Datos mock de estadísticas completas
      const estadisticasMock: ReporteEstadisticas = {
        periodo: {
          fechaInicio: filtros.fechaInicio,
          fechaFin: filtros.fechaFin,
        },
        resumenGeneral: {
          totalCitas: 347,
          citasAtendidas: 312,
          citasCanceladas: 28,
          citasNoShow: 7,
          tasaOcupacion: 89.2,
          ingresosTotales: 15480000,
          pacientesNuevos: 45,
          pacientesRecurrentes: 89,
        },
        citasPorDia: [
          { fecha: '2025-09-05', total: 28, atendidas: 25, canceladas: 2, noShow: 1 },
          { fecha: '2025-09-06', total: 32, atendidas: 30, canceladas: 1, noShow: 1 },
          { fecha: '2025-09-07', total: 26, atendidas: 24, canceladas: 2, noShow: 0 },
          { fecha: '2025-09-08', total: 30, atendidas: 28, canceladas: 2, noShow: 0 },
          { fecha: '2025-09-09', total: 35, atendidas: 33, canceladas: 1, noShow: 1 },
          { fecha: '2025-09-10', total: 22, atendidas: 20, canceladas: 1, noShow: 1 },
          { fecha: '2025-09-11', total: 18, atendidas: 16, canceladas: 2, noShow: 0 },
        ],
        serviciosMasPopulares: [
          { nombre: 'Control', cantidad: 89, porcentaje: 25.6, ingresos: 3560000 },
          { nombre: 'Limpieza', cantidad: 76, porcentaje: 21.9, ingresos: 4560000 },
          { nombre: 'Endodoncia', cantidad: 45, porcentaje: 13.0, ingresos: 4050000 },
          { nombre: 'Urgencia', cantidad: 38, porcentaje: 10.9, ingresos: 1520000 },
          { nombre: 'Ortodoncia', cantidad: 34, porcentaje: 9.8, ingresos: 1360000 },
        ],
        profesionalRanking: [
          { nombre: 'Dra. Ana Pérez', citasAtendidas: 142, ingresos: 6840000, satisfaccion: 4.8 },
          { nombre: 'Dr. Luis Soto', citasAtendidas: 98, ingresos: 4720000, satisfaccion: 4.6 },
          { nombre: 'Dra. Carmen Silva', citasAtendidas: 72, ingresos: 3920000, satisfaccion: 4.9 },
        ],
        horariosPico: [
          { hora: '09:00', cantidad: 45 },
          { hora: '10:00', cantidad: 52 },
          { hora: '11:00', cantidad: 38 },
          { hora: '14:00', cantidad: 41 },
          { hora: '15:00', cantidad: 48 },
          { hora: '16:00', cantidad: 43 },
          { hora: '17:00', cantidad: 29 },
        ],
        ingresosPorMes: [
          { mes: 'Julio', ingresos: 14200000 },
          { mes: 'Agosto', ingresos: 16800000 },
          { mes: 'Septiembre', ingresos: 15480000 },
          { mes: 'Octubre', ingresos: 12300000 },
        ],
      };

      setEstadisticas(estadisticasMock);

    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltroChange = (campo: keyof FiltrosReporte, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const exportarReporte = (formato: 'pdf' | 'excel') => {
    // Simular exportación
    const nombreArchivo = `reporte-${filtros.fechaInicio}-${filtros.fechaFin}.${formato === 'excel' ? 'xlsx' : 'pdf'}`;
    console.log(`Exportando reporte como ${formato}: ${nombreArchivo}`);
    // Aquí iría la lógica real de exportación
  };

  const formatearPesos = (valor: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Cargando reportes...</p>
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
              <h1 className="text-2xl font-bold text-slate-900">Reportes y Analytics</h1>
              <p className="text-slate-600">
                Período: {formatearFechaChile(filtros.fechaInicio)} - {formatearFechaChile(filtros.fechaFin)}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => cargarEstadisticas()}
                disabled={isLoading}
                className="flex items-center space-x-2 px-3 py-2 text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>

              <button
                onClick={() => exportarReporte('excel')}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Excel</span>
              </button>

              <button
                onClick={() => exportarReporte('pdf')}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="date"
              value={filtros.fechaFin}
              onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={filtros.sucursal}
              onChange={(e) => handleFiltroChange('sucursal', e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las sucursales</option>
              {sucursales.map(sucursal => (
                <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</option>
              ))}
            </select>

            <select
              value={filtros.profesional}
              onChange={(e) => handleFiltroChange('profesional', e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los profesionales</option>
              {profesionales.map(profesional => (
                <option key={profesional.id} value={profesional.id}>{profesional.nombre}</option>
              ))}
            </select>

            <select
              value={filtros.servicio}
              onChange={(e) => handleFiltroChange('servicio', e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los servicios</option>
              {servicios.map(servicio => (
                <option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navegación de vistas */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { key: 'resumen', label: 'Resumen General', icon: BarChart3 },
              { key: 'citas', label: 'Análisis de Citas', icon: Calendar },
              { key: 'ingresos', label: 'Ingresos', icon: DollarSign },
              { key: 'utilizacion', label: 'Utilización', icon: Clock },
              { key: 'pacientes', label: 'Pacientes', icon: Users },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setVistaActiva(key as any)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  vistaActiva === key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Vista Resumen General */}
        {vistaActiva === 'resumen' && estadisticas && (
          <div className="space-y-8">
            {/* KPIs principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Citas</p>
                    <p className="text-2xl font-bold text-slate-900">{estadisticas.resumenGeneral.totalCitas}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-green-600 font-medium">
                    +12.5% vs mes anterior
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Tasa de Ocupación</p>
                    <p className="text-2xl font-bold text-slate-900">{estadisticas.resumenGeneral.tasaOcupacion}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-green-600 font-medium">
                    +3.2% vs mes anterior
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatearPesos(estadisticas.resumenGeneral.ingresosTotales)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-green-600 font-medium">
                    +8.7% vs mes anterior
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Pacientes Nuevos</p>
                    <p className="text-2xl font-bold text-slate-900">{estadisticas.resumenGeneral.pacientesNuevos}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-green-600 font-medium">
                    +15.3% vs mes anterior
                  </span>
                </div>
              </div>
            </div>

            {/* Servicios más populares */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Servicios Más Solicitados</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {estadisticas.serviciosMasPopulares.map((servicio, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-slate-900">{servicio.nombre}</span>
                          <span className="text-sm text-slate-600">{servicio.cantidad} citas</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${servicio.porcentaje}%` }}
                          />
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-sm font-medium text-slate-900">
                          {formatearPesos(servicio.ingresos)}
                        </div>
                        <div className="text-xs text-slate-500">{servicio.porcentaje}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ranking de profesionales */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Ranking de Profesionales</h3>
              </div>
              <div className="divide-y divide-slate-200">
                {estadisticas.profesionalRanking.map((profesional, index) => (
                  <div key={index} className="p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{profesional.nombre}</h4>
                        <p className="text-sm text-slate-600">
                          {profesional.citasAtendidas} citas atendidas • ⭐ {profesional.satisfaccion}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">
                        {formatearPesos(profesional.ingresos)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Vista de Citas */}
        {vistaActiva === 'citas' && estadisticas && (
          <div className="space-y-8">
            {/* Estadísticas de citas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="text-2xl font-bold text-green-600">{estadisticas.resumenGeneral.citasAtendidas}</div>
                <div className="text-sm text-slate-600 mt-1">Citas Atendidas</div>
                <div className="text-xs text-green-600 mt-2">
                  {((estadisticas.resumenGeneral.citasAtendidas / estadisticas.resumenGeneral.totalCitas) * 100).toFixed(1)}%
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="text-2xl font-bold text-yellow-600">{estadisticas.resumenGeneral.citasCanceladas}</div>
                <div className="text-sm text-slate-600 mt-1">Citas Canceladas</div>
                <div className="text-xs text-yellow-600 mt-2">
                  {((estadisticas.resumenGeneral.citasCanceladas / estadisticas.resumenGeneral.totalCitas) * 100).toFixed(1)}%
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="text-2xl font-bold text-red-600">{estadisticas.resumenGeneral.citasNoShow}</div>
                <div className="text-sm text-slate-600 mt-1">No Show</div>
                <div className="text-xs text-red-600 mt-2">
                  {((estadisticas.resumenGeneral.citasNoShow / estadisticas.resumenGeneral.totalCitas) * 100).toFixed(1)}%
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">{estadisticas.resumenGeneral.totalCitas}</div>
                <div className="text-sm text-slate-600 mt-1">Total Citas</div>
                <div className="text-xs text-blue-600 mt-2">100%</div>
              </div>
            </div>

            {/* Gráfico de citas por día */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Citas por Día</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {estadisticas.citasPorDia.map((dia, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="w-20 text-sm font-medium text-slate-700">
                        {formatearFechaChile(dia.fecha)}
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="flex space-x-1">
                          <div
                            className="bg-green-500 h-6 rounded"
                            style={{ width: `${(dia.atendidas / dia.total) * 100}%` }}
                            title={`${dia.atendidas} atendidas`}
                          />
                          <div
                            className="bg-yellow-500 h-6 rounded"
                            style={{ width: `${(dia.canceladas / dia.total) * 100}%` }}
                            title={`${dia.canceladas} canceladas`}
                          />
                          <div
                            className="bg-red-500 h-6 rounded"
                            style={{ width: `${(dia.noShow / dia.total) * 100}%` }}
                            title={`${dia.noShow} no show`}
                          />
                        </div>
                      </div>
                      <div className="w-12 text-right text-sm font-bold text-slate-900">
                        {dia.total}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-center space-x-6 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Atendidas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Canceladas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>No Show</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vista de Ingresos */}
        {vistaActiva === 'ingresos' && estadisticas && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Evolución de Ingresos</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {estadisticas.ingresosPorMes.map((mes, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="font-medium text-slate-700">{mes.mes}</div>
                      <div className="flex-1 mx-4">
                        <div
                          className="bg-emerald-500 h-8 rounded flex items-center justify-end pr-2"
                          style={{ width: `${(mes.ingresos / Math.max(...estadisticas.ingresosPorMes.map(m => m.ingresos))) * 100}%` }}
                        >
                          <span className="text-white text-xs font-medium">
                            {formatearPesos(mes.ingresos)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vista de Utilización */}
        {vistaActiva === 'utilizacion' && estadisticas && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Horarios Pico</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {estadisticas.horariosPico.map((horario, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="w-16 font-medium text-slate-700">{horario.hora}</div>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-slate-200 rounded-full h-4">
                          <div
                            className="bg-blue-600 h-4 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${(horario.cantidad / Math.max(...estadisticas.horariosPico.map(h => h.cantidad))) * 100}%` }}
                          >
                            <span className="text-white text-xs font-medium">{horario.cantidad}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vista de Pacientes */}
        {vistaActiva === 'pacientes' && estadisticas && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Distribución de Pacientes</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Pacientes Nuevos</span>
                    <span className="font-semibold text-slate-900">{estadisticas.resumenGeneral.pacientesNuevos}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Pacientes Recurrentes</span>
                    <span className="font-semibold text-slate-900">{estadisticas.resumenGeneral.pacientesRecurrentes}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                    <span className="font-medium text-slate-700">Total Pacientes</span>
                    <span className="font-bold text-slate-900">
                      {estadisticas.resumenGeneral.pacientesNuevos + estadisticas.resumenGeneral.pacientesRecurrentes}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Retención de Pacientes</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {((estadisticas.resumenGeneral.pacientesRecurrentes /
                      (estadisticas.resumenGeneral.pacientesNuevos + estadisticas.resumenGeneral.pacientesRecurrentes)) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-slate-600">Tasa de Retención</div>
                  <div className="mt-4 w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full"
                      style={{
                        width: `${(estadisticas.resumenGeneral.pacientesRecurrentes / 
                          (estadisticas.resumenGeneral.pacientesNuevos + estadisticas.resumenGeneral.pacientesRecurrentes)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
