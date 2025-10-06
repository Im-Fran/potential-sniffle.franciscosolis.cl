import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Calendar, Clock, User, MapPin, RefreshCw, AlertTriangle } from 'lucide-react';
import { useDisponibilidad } from '../../hooks/useApi';
import { TimeSlotGrid } from '../../components/TimeSlotGrid';
import { DatePicker } from '../../components/DatePicker';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatearFechaChile, obtenerFechaHoyChile, puedeModificarCita } from '@/lib/time.ts';

interface CitaOriginal {
  id: string;
  codigo: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  servicio: string;
  profesional: string;
  profesionalId: string;
  sucursal: string;
  sucursalId: string;
  servicioId: string;
  direccion: string;
  duracionMinutos: number;
  estado: 'PROGRAMADA' | 'CONFIRMADA';
}

export function ReprogramarCita() {
  const navigate = useNavigate();
  const { citaId } = useParams<{ citaId: string }>();
  const [citaOriginal, setCitaOriginal] = useState<CitaOriginal | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isReprogramming, setIsReprogramming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'fecha' | 'hora' | 'confirmacion'>('fecha');

  // Hook para obtener disponibilidad
  const { data: slots, isLoading: loadingSlots, refetch: refetchSlots } = useDisponibilidad(
    citaOriginal?.profesionalId || '',
    fechaSeleccionada,
    citaOriginal?.servicioId || '',
    step === 'hora' && !!citaOriginal && !!fechaSeleccionada
  );

  useEffect(() => {
    cargarCitaOriginal();
  }, [citaId]);

  const cargarCitaOriginal = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Datos mock de la cita original
      const citaMock: CitaOriginal = {
        id: citaId || 'cita-123',
        codigo: 'DEN-2025-001234',
        fecha: '2025-10-12',
        horaInicio: '14:30',
        horaFin: '15:00',
        servicio: 'Control y Limpieza',
        profesional: 'Dra. Ana Pérez',
        profesionalId: 'prof-1',
        sucursal: 'Clínica Providencia',
        sucursalId: 'suc-1',
        servicioId: 'serv-1',
        direccion: 'Av. Providencia 1234',
        duracionMinutos: 30,
        estado: 'PROGRAMADA',
      };

      setCitaOriginal(citaMock);

      // Verificar si la cita puede ser reprogramada
      if (!puedeModificarCita(citaMock.fecha, citaMock.horaInicio)) {
        setError('Esta cita no puede ser reprogramada. Debe hacerlo con al menos 24 horas de anticipación.');
      }

    } catch (error) {
      console.error('Error al cargar cita:', error);
      setError('No se pudo cargar la información de la cita');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFechaSelect = (fecha: string) => {
    setFechaSeleccionada(fecha);
    setHoraSeleccionada('');
    if (fecha) {
      setStep('hora');
    }
  };

  const handleHoraSelect = (hora: string) => {
    setHoraSeleccionada(hora);
    setStep('confirmacion');
  };

  const confirmarReprogramacion = async () => {
    if (!citaOriginal || !fechaSeleccionada || !horaSeleccionada) return;

    setIsReprogramming(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Aquí iría la lógica real de reprogramación
      console.log('Reprogramando cita:', {
        citaId: citaOriginal.id,
        nuevaFecha: fechaSeleccionada,
        nuevaHora: horaSeleccionada,
      });

      // Simular éxito y redirigir
      navigate('/paciente/citas', {
        replace: true,
        state: {
          mensaje: 'Cita reprogramada exitosamente',
          tipo: 'exito'
        }
      });

    } catch (error) {
      console.error('Error al reprogramar cita:', error);
      setError('No se pudo reprogramar la cita. Inténtalo nuevamente.');
    } finally {
      setIsReprogramming(false);
    }
  };

  const volverAtras = () => {
    switch (step) {
      case 'hora':
        setStep('fecha');
        setHoraSeleccionada('');
        break;
      case 'confirmacion':
        setStep('hora');
        break;
      default:
        navigate(-1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Cargando información de la cita...</p>
        </div>
      </div>
    );
  }

  if (error || !citaOriginal) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border p-8 max-w-md w-full text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Error al cargar la cita
          </h2>
          <p className="text-slate-600 mb-6">
            {error || 'No se encontró la cita especificada'}
          </p>
          <button
            onClick={() => navigate('/paciente/citas')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Volver a mis citas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={volverAtras}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Reprogramar Cita</h1>
                <p className="text-slate-600">Código: {citaOriginal.codigo}</p>
              </div>
            </div>

            {/* Indicador de pasos */}
            <div className="hidden md:flex items-center space-x-4 text-sm">
              {[
                { key: 'fecha', label: 'Fecha', icon: Calendar },
                { key: 'hora', label: 'Horario', icon: Clock },
                { key: 'confirmacion', label: 'Confirmar', icon: RefreshCw },
              ].map(({ key, label, icon: Icon }, index) => (
                <div key={key} className={`flex items-center space-x-2 ${
                  step === key ? 'text-blue-600' : 
                  ['fecha', 'hora', 'confirmacion'].indexOf(step) > index ? 'text-green-600' : 'text-slate-400'
                }`}>
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información de la cita actual */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Cita Actual</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-slate-500" />
                <div>
                  <div className="text-sm text-slate-600">Fecha</div>
                  <div className="font-medium text-slate-900">
                    {formatearFechaChile(citaOriginal.fecha)}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-slate-500" />
                <div>
                  <div className="text-sm text-slate-600">Horario</div>
                  <div className="font-medium text-slate-900">
                    {citaOriginal.horaInicio} - {citaOriginal.horaFin}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-slate-500" />
                <div>
                  <div className="text-sm text-slate-600">Profesional</div>
                  <div className="font-medium text-slate-900">{citaOriginal.profesional}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-slate-500" />
                <div>
                  <div className="text-sm text-slate-600">Sucursal</div>
                  <div className="font-medium text-slate-900">{citaOriginal.sucursal}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-blue-50">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 mt-0.5">ℹ️</div>
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Información importante:</p>
                <ul className="text-blue-800 space-y-1">
                  <li>• La reprogramación debe realizarse con al menos 24 horas de anticipación</li>
                  <li>• El nuevo horario debe ser con el mismo profesional</li>
                  <li>• Recibirás una confirmación por email y SMS</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido del paso actual */}
        {step === 'fecha' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Selecciona Nueva Fecha
              </h2>
              <p className="text-slate-600">
                Elige una fecha disponible para reprogramar tu cita
              </p>
            </div>
            <div className="p-6">
              <DatePicker
                selectedDate={fechaSeleccionada}
                onDateSelect={handleFechaSelect}
                minDate={obtenerFechaHoyChile()}
                maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
            </div>
          </div>
        )}

        {step === 'hora' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Selecciona Nuevo Horario
                  </h2>
                  <p className="text-slate-600">
                    Fecha: {formatearFechaChile(fechaSeleccionada)}
                  </p>
                </div>
                <button
                  onClick={() => refetchSlots()}
                  disabled={loadingSlots}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingSlots ? 'animate-spin' : ''}`} />
                  <span>Actualizar</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              {loadingSlots ? (
                <div className="text-center py-8">
                  <LoadingSpinner />
                  <p className="mt-2 text-slate-600">Cargando horarios disponibles...</p>
                </div>
              ) : (
                <TimeSlotGrid
                  slots={slots || []}
                  onHoraSelect={handleHoraSelect}
                  selectedHora={horaSeleccionada}
                  duracionServicio={citaOriginal?.duracionMinutos || 30}
                />
              )}
            </div>
          </div>
        )}

        {step === 'confirmacion' && (
          <div className="space-y-6">
            {/* Resumen del cambio */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">
                  Confirmar Reprogramación
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cita anterior */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-medium text-red-900 mb-3">Cita Actual</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-red-700">Fecha:</span>
                        <span className="font-medium text-red-900">
                          {formatearFechaChile(citaOriginal.fecha)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-700">Horario:</span>
                        <span className="font-medium text-red-900">
                          {citaOriginal.horaInicio} - {citaOriginal.horaFin}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nueva cita */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-900 mb-3">Nueva Cita</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Fecha:</span>
                        <span className="font-medium text-green-900">
                          {formatearFechaChile(fechaSeleccionada)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Horario:</span>
                        <span className="font-medium text-green-900">
                          {horaSeleccionada} - {
                            (() => {
                              const [horas, minutos] = horaSeleccionada.split(':').map(Number);
                              const totalMinutos = horas * 60 + minutos + citaOriginal.duracionMinutos;
                              const nuevasHoras = Math.floor(totalMinutos / 60);
                              const nuevosMinutos = totalMinutos % 60;
                              return `${nuevasHoras.toString().padStart(2, '0')}:${nuevosMinutos.toString().padStart(2, '0')}`;
                            })()
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-yellow-600 mt-0.5">⚠️</div>
                    <div className="text-sm">
                      <p className="font-medium text-yellow-900 mb-1">Importante:</p>
                      <p className="text-yellow-800">
                        Al confirmar, se cancelará automáticamente tu cita actual y se creará
                        la nueva cita. Recibirás confirmaciones por email y SMS.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep('hora')}
                disabled={isReprogramming}
                className="flex-1 px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cambiar Horario
              </button>
              <button
                onClick={confirmarReprogramacion}
                disabled={isReprogramming}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isReprogramming ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Reprogramando...</span>
                  </>
                ) : (
                  <span>Confirmar Reprogramación</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
