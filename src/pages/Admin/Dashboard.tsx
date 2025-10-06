import { useState, useEffect } from 'react';
import { Calendar, Users, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

// Tipos para métricas del dashboard
interface DashboardMetrics {
  citasHoy: number;
  citasSemana: number;
  citasMes: number;
  pacientesNuevos: number;
  utilizacionPromedio: number;
  noShows: number;
}

interface CitaReciente {
  id: string;
  paciente: string;
  servicio: string;
  profesional: string;
  hora: string;
  estado: 'PROGRAMADA' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA';
}

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    citasHoy: 0,
    citasSemana: 0,
    citasMes: 0,
    pacientesNuevos: 0,
    utilizacionPromedio: 0,
    noShows: 0,
  });

  const [citasRecientes, setCitasRecientes] = useState<CitaReciente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de métricas
    const cargarDatos = async () => {
      setIsLoading(true);

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Datos simulados
      setMetrics({
        citasHoy: 24,
        citasSemana: 156,
        citasMes: 642,
        pacientesNuevos: 18,
        utilizacionPromedio: 78,
        noShows: 5,
      });

      setCitasRecientes([
        {
          id: '1',
          paciente: 'María González',
          servicio: 'Limpieza',
          profesional: 'Dra. Ana Pérez',
          hora: '09:00',
          estado: 'CONFIRMADA'
        },
        {
          id: '2',
          paciente: 'Carlos Silva',
          servicio: 'Control',
          profesional: 'Dr. Luis Soto',
          hora: '09:30',
          estado: 'PROGRAMADA'
        },
        {
          id: '3',
          paciente: 'Ana Martínez',
          servicio: 'Endodoncia',
          profesional: 'Dra. Ana Pérez',
          hora: '10:00',
          estado: 'ATENDIDA'
        },
      ]);

      setIsLoading(false);
    };

    cargarDatos();
  }, []);

  const getEstadoColor = (estado: CitaReciente['estado']) => {
    const colores = {
      PROGRAMADA: 'bg-blue-100 text-blue-800',
      CONFIRMADA: 'bg-green-100 text-green-800',
      ATENDIDA: 'bg-purple-100 text-purple-800',
      CANCELADA: 'bg-red-100 text-red-800',
    };
    return colores[estado];
  };

  const getEstadoTexto = (estado: CitaReciente['estado']) => {
    const textos = {
      PROGRAMADA: 'Programada',
      CONFIRMADA: 'Confirmada',
      ATENDIDA: 'Atendida',
      CANCELADA: 'Cancelada',
    };
    return textos[estado];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600">Resumen de actividad y métricas principales</p>
            </div>
            <div className="text-sm text-slate-500">
              Última actualización: {new Date().toLocaleTimeString('es-CL')}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Citas hoy</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.citasHoy}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Esta semana</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.citasSemana}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Utilización</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.utilizacionPromedio}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">No-shows</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.noShows}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Citas de hoy */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Citas de hoy</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {citasRecientes.map((cita) => (
                  <div key={cita.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {cita.paciente.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{cita.paciente}</p>
                        <p className="text-sm text-slate-600">{cita.servicio} • {cita.profesional}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-slate-900">{cita.hora}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(cita.estado)}`}>
                        {getEstadoTexto(cita.estado)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen semanal */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Resumen semanal</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600">Citas programadas</span>
                    <span className="text-sm font-medium text-slate-900">{metrics.citasSemana}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600">Pacientes nuevos</span>
                    <span className="text-sm font-medium text-slate-900">{metrics.pacientesNuevos}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600">Tasa de ocupación</span>
                    <span className="text-sm font-medium text-slate-900">{metrics.utilizacionPromedio}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${metrics.utilizacionPromedio}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Ingresos estimados</span>
                  <span className="font-semibold text-slate-900">$2.450.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Acciones rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors">
              <Calendar className="w-4 h-4" />
              <span>Nueva cita</span>
            </button>

            <button className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors">
              <Users className="w-4 h-4" />
              <span>Ver agenda</span>
            </button>

            <button className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-purple-700 transition-colors">
              <TrendingUp className="w-4 h-4" />
              <span>Reportes</span>
            </button>

            <button className="flex items-center justify-center space-x-2 bg-slate-600 text-white px-4 py-3 rounded-md hover:bg-slate-700 transition-colors">
              <CheckCircle className="w-4 h-4" />
              <span>Configuración</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
