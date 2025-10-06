import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Check, Calendar, Clock, MapPin, User, FileText, Download, ExternalLink } from 'lucide-react';
import { useGestionReserva, useSucursal, useProfesional, useServicios } from '@/hooks/useApi.ts';
import { LoadingSpinner } from '../LoadingSpinner';
import { formatearFechaChile } from '@/lib/time.ts';
import { descargarArchivoICS, generarEnlaceGoogleCalendar } from '@/lib/ics.ts';
import type { ReservaStep, EstadoCita } from '@/types/domain.ts';

interface StepResumenProps {
  reservaData: ReservaStep;
  updateReservaData: (data: Partial<ReservaStep>) => void;
}

export function StepResumen({ reservaData }: StepResumenProps) {
  const navigate = useNavigate();
  const [citaConfirmada, setCitaConfirmada] = useState<any>(null);
  const { confirmarReserva, isLoading, error } = useGestionReserva();

  // Queries para obtener datos completos
  const { data: sucursal } = useSucursal(reservaData.sucursal?.id || '');
  const { data: profesional } = useProfesional(reservaData.profesional?.id || '');
  const { data: servicios } = useServicios();

  const servicio = servicios?.find(s => s.id === reservaData.servicio?.id);

  const handleConfirmarCita = async () => {
    if (!reservaData.sucursal || !reservaData.servicio || !reservaData.profesional ||
        !reservaData.fecha || !reservaData.hora || !reservaData.paciente) {
      return;
    }

    try {
      const nuevaCita = await confirmarReserva({
        sucursalId: reservaData.sucursal.id,
        profesionalId: reservaData.profesional.id,
        servicioId: reservaData.servicio.id,
        fecha: reservaData.fecha,
        horaInicio: reservaData.hora,
        horaFin: servicio ?
          (() => {
            const [horas, minutos] = reservaData.hora.split(':').map(Number);
            const totalMinutos = horas * 60 + minutos + servicio.duracionMinutos;
            const nuevasHoras = Math.floor(totalMinutos / 60);
            const nuevosMinutos = totalMinutos % 60;
            return `${nuevasHoras.toString().padStart(2, '0')}:${nuevosMinutos.toString().padStart(2, '0')}`;
          })()
          : reservaData.hora,
        estado: 'PROGRAMADA' as EstadoCita,
        paciente: reservaData.paciente,
        creadaPor: 'PACIENTE' as const,
      });

      setCitaConfirmada(nuevaCita);
    } catch (error) {
      console.error('Error al confirmar cita:', error);
    }
  };

  const handleDescargarICS = () => {
    if (citaConfirmada && sucursal && profesional && servicio) {
      descargarArchivoICS(citaConfirmada, sucursal, profesional, servicio);
    }
  };

  const handleAgregarAGoogle = () => {
    if (citaConfirmada && sucursal && profesional && servicio) {
      const url = generarEnlaceGoogleCalendar(citaConfirmada, sucursal, profesional, servicio);
      window.open(url, '_blank');
    }
  };

  // Si la cita ya fue confirmada, mostrar pantalla de éxito
  if (citaConfirmada) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          ¡Cita confirmada!
        </h2>

        <p className="text-lg text-slate-600 mb-8">
          Tu cita ha sido agendada exitosamente. Te hemos enviado la confirmación por email y SMS.
        </p>

        {/* Información de la cita */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
          <h3 className="font-semibold text-green-900 mb-4">Detalles de tu cita:</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-green-600" />
              <span>{formatearFechaChile(citaConfirmada.fecha)} a las {citaConfirmada.horaInicio}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-green-600" />
              <span>{sucursal?.nombre}</span>
            </div>
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-green-600" />
              <span>{profesional?.nombre}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FileText className="w-4 h-4 text-green-600" />
              <span>{servicio?.nombre}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-green-300">
            <div className="flex items-center justify-between">
              <span className="font-medium text-green-900">Código de cita:</span>
              <span className="font-mono text-lg font-bold text-green-700">
                {citaConfirmada.codigo}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleDescargarICS}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Descargar .ics</span>
            </button>

            <button
              onClick={handleAgregarAGoogle}
              className="flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Agregar a Google Calendar</span>
            </button>
          </div>

          <button
            onClick={() => navigate(`/cita/${citaConfirmada.codigo}`)}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Gestionar mi cita
          </button>
        </div>

        {/* Instrucciones */}
        <div className="mt-8 text-left max-w-2xl mx-auto">
          <h4 className="font-medium text-slate-900 mb-3">Instrucciones importantes:</h4>
          <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
            <li>Llega 10 minutos antes de tu cita para el proceso de check-in</li>
            <li>Trae tu cédula de identidad y documentos de previsión</li>
            <li>Si necesitas cancelar o reprogramar, hazlo con al menos 24 horas de anticipación</li>
            <li>Puedes gestionar tu cita usando el código: <strong>{citaConfirmada.codigo}</strong></li>
          </ul>
        </div>
      </div>
    );
  }

  // Validar que todos los datos estén completos
  if (!reservaData.sucursal || !reservaData.servicio || !reservaData.profesional ||
      !reservaData.fecha || !reservaData.hora || !reservaData.paciente) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Información incompleta. Por favor, complete todos los pasos anteriores.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Resumen de tu cita
        </h2>
        <p className="text-slate-600">
          Revisa todos los detalles antes de confirmar tu cita dental.
        </p>
      </div>

      <div className="space-y-6">
        {/* Información de la cita */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Detalles de la cita
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-900">{reservaData.sucursal.nombre}</p>
                <p className="text-sm text-slate-600">{reservaData.sucursal.direccion}</p>
                {reservaData.sucursal.telefono && (
                  <p className="text-sm text-slate-600">{reservaData.sucursal.telefono}</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-900">
                  {formatearFechaChile(reservaData.fecha)} a las {reservaData.hora}
                </p>
                <p className="text-sm text-slate-600">
                  Duración: {reservaData.servicio.duracionMinutos} minutos
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-900">{reservaData.profesional.nombre}</p>
                <p className="text-sm text-slate-600">
                  {reservaData.profesional.especialidades.join(', ')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-900">{reservaData.servicio.nombre}</p>
                <p className="text-sm text-slate-600">{reservaData.servicio.especialidad}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información del paciente */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Datos del paciente
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Nombre completo</p>
              <p className="font-medium text-slate-900">{reservaData.paciente.nombre}</p>
            </div>

            <div>
              <p className="text-sm text-slate-600">RUT</p>
              <p className="font-medium text-slate-900">{reservaData.paciente.rut}</p>
            </div>

            <div>
              <p className="text-sm text-slate-600">Teléfono</p>
              <p className="font-medium text-slate-900">{reservaData.paciente.telefono}</p>
            </div>

            <div>
              <p className="text-sm text-slate-600">Email</p>
              <p className="font-medium text-slate-900">{reservaData.paciente.email}</p>
            </div>

            <div>
              <p className="text-sm text-slate-600">Previsión</p>
              <p className="font-medium text-slate-900">{reservaData.paciente.prevision}</p>
            </div>

            {reservaData.paciente.notas && (
              <div className="md:col-span-2">
                <p className="text-sm text-slate-600">Notas</p>
                <p className="font-medium text-slate-900">{reservaData.paciente.notas}</p>
              </div>
            )}
          </div>
        </div>

        {/* Política de cancelación */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-3">
            Política de cancelación
          </h3>
          <p className="text-sm text-amber-800">
            Puedes modificar o cancelar tu cita hasta 24 horas antes del horario agendado.
            Pasado ese plazo, se reportará como no presentación. Para cambios de último minuto,
            contacta directamente a la sucursal.
          </p>
        </div>

        {/* Error si existe */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              Error al confirmar la cita. Por favor, intenta nuevamente.
            </p>
          </div>
        )}

        {/* Botón de confirmación */}
        <div className="flex justify-center pt-6">
          <button
            onClick={handleConfirmarCita}
            disabled={isLoading}
            className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-3"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Confirmando cita...</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Confirmar cita</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
