import { useState } from 'react';
import { useParams } from 'react-router';
import { Search, Calendar, MapPin, User, Clock, Phone, Mail, Edit3, X, Download } from 'lucide-react';
import { useCitaPorCodigo, useCancelarCita, useSucursal, useProfesional, useServicios } from '../hooks/useApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatearFechaChile, puedeModificarCita } from '../lib/time';
import { descargarArchivoICS } from '../lib/ics';
import type { Cita } from '../types/domain';

export function BookingLookup() {
  const { codigo: codigoParam } = useParams();
  const [codigoBusqueda, setCodigoBusqueda] = useState(codigoParam || '');
  const [mostrarFormulario, setMostrarFormulario] = useState(!codigoParam);

  const { data: cita, isLoading, error, refetch } = useCitaPorCodigo(codigoBusqueda);
  const cancelarCita = useCancelarCita();

  // Queries para datos relacionados
  const { data: sucursal } = useSucursal(cita?.sucursalId || '');
  const { data: profesional } = useProfesional(cita?.profesionalId || '');
  const { data: servicios } = useServicios();

  const servicio = servicios?.find(s => s.id === cita?.servicioId);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (codigoBusqueda.trim()) {
      setMostrarFormulario(false);
      refetch();
    }
  };

  const handleCancelarCita = async () => {
    if (!cita) return;

    if (!puedeModificarCita(cita.fecha, cita.horaInicio)) {
      alert('No puedes cancelar esta cita. Ya pasaron las 24 horas de anticipación requeridas.');
      return;
    }

    if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      try {
        await cancelarCita.mutateAsync(cita.id);
        refetch();
      } catch (error) {
        alert('Error al cancelar la cita. Intenta nuevamente.');
      }
    }
  };

  const handleDescargarICS = () => {
    if (cita && sucursal && profesional && servicio) {
      descargarArchivoICS(cita, sucursal, profesional, servicio);
    }
  };

  const getEstadoColor = (estado: Cita['estado']) => {
    const colores = {
      PROGRAMADA: 'bg-blue-100 text-blue-800',
      CONFIRMADA: 'bg-green-100 text-green-800',
      ATENDIDA: 'bg-purple-100 text-purple-800',
      REPROGRAMADA: 'bg-yellow-100 text-yellow-800',
      CANCELADA: 'bg-red-100 text-red-800',
      NO_SHOW: 'bg-gray-100 text-gray-800',
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoTexto = (estado: Cita['estado']) => {
    const textos = {
      PROGRAMADA: 'Programada',
      CONFIRMADA: 'Confirmada',
      ATENDIDA: 'Atendida',
      REPROGRAMADA: 'Reprogramada',
      CANCELADA: 'Cancelada',
      NO_SHOW: 'No asistió',
    };
    return textos[estado] || estado;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Buscar mi cita
          </h1>
          <p className="text-slate-600">
            Ingresa tu código de cita para ver los detalles y gestionar tu reserva.
          </p>
        </div>

        {/* Formulario de búsqueda */}
        {(mostrarFormulario || !cita) && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <form onSubmit={handleBuscar} className="space-y-4">
              <div>
                <label htmlFor="codigo" className="block text-sm font-medium text-slate-700 mb-2">
                  Código de cita
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    id="codigo"
                    value={codigoBusqueda}
                    onChange={(e) => {
                      // Permitir solo letras, números y guiones, convertir a mayúsculas
                      const valor = e.target.value.toUpperCase().replace(/[^A-Z0-9\-]/g, '');
                      setCodigoBusqueda(valor);
                    }}
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg"
                    placeholder="Ej: DEN-2025-001001"
                    maxLength={15}
                  />
                  <button
                    type="submit"
                    disabled={!codigoBusqueda.trim() || isLoading}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    <span>Buscar</span>
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-500">
                El código de cita te fue enviado por email y SMS al confirmar tu reserva.
                Formato: DEN-2025-XXXXXX
              </p>
            </form>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3">
              <X className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="font-medium text-red-900">Cita no encontrada</h3>
                <p className="text-red-700 text-sm mt-1">
                  No encontramos una cita con el código ingresado. Verifica que esté correcto.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Información de la cita */}
        {cita && sucursal && profesional && servicio && (
          <div className="space-y-6">
            {/* Estado y acciones */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(cita.estado)}`}>
                  {getEstadoTexto(cita.estado)}
                </span>
                <span className="text-sm text-slate-500">
                  Código: <span className="font-mono font-medium">{cita.codigo}</span>
                </span>
              </div>

              {cita.estado === 'PROGRAMADA' && (
                <div className="flex space-x-3">
                  <button
                    onClick={handleDescargarICS}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar .ics</span>
                  </button>

                  {puedeModificarCita(cita.fecha, cita.horaInicio) && (
                    <>
                      <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm">
                        <Edit3 className="w-4 h-4" />
                        <span>Reprogramar</span>
                      </button>

                      <button
                        onClick={handleCancelarCita}
                        disabled={cancelarCita.isPending}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                      >
                        {cancelarCita.isPending ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        <span>Cancelar</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Detalles de la cita */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Detalles de tu cita
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fecha y hora */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Fecha y hora</h3>
                    <p className="text-slate-600">{formatearFechaChile(cita.fecha)}</p>
                    <p className="text-slate-600">{cita.horaInicio} - {cita.horaFin}</p>
                  </div>
                </div>

                {/* Sucursal */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Sucursal</h3>
                    <p className="text-slate-600">{sucursal.nombre}</p>
                    <p className="text-slate-500 text-sm">{sucursal.direccion}</p>
                    {sucursal.telefono && (
                      <p className="text-slate-500 text-sm">{sucursal.telefono}</p>
                    )}
                  </div>
                </div>

                {/* Profesional */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Profesional</h3>
                    <p className="text-slate-600">{profesional.nombre}</p>
                    <p className="text-slate-500 text-sm">
                      {profesional.especialidades.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Servicio */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Servicio</h3>
                    <p className="text-slate-600">{servicio.nombre}</p>
                    <p className="text-slate-500 text-sm">
                      Duración: {servicio.duracionMinutos} minutos
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información del paciente */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Información del paciente
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-slate-900">Datos personales</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><span className="text-slate-500">Nombre:</span> {cita.paciente.nombre}</p>
                    <p><span className="text-slate-500">RUT:</span> {cita.paciente.rut}</p>
                    <p><span className="text-slate-500">Previsión:</span> {cita.paciente.prevision}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-slate-900">Contacto</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    {cita.paciente.telefono && (
                      <p className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <span>{cita.paciente.telefono}</span>
                      </p>
                    )}
                    {cita.paciente.email && (
                      <p className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span>{cita.paciente.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {cita.paciente.notas && (
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-slate-900">Notas</h3>
                    <p className="mt-2 text-sm text-slate-600">{cita.paciente.notas}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Instrucciones */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-medium text-blue-900 mb-3">
                Instrucciones para tu cita
              </h3>
              <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                <li>Llega 10 minutos antes de tu cita</li>
                <li>Trae tu cédula de identidad</li>
                <li>Si tienes previsión, trae los documentos correspondientes</li>
                <li>Para cancelar o reprogramar, hazlo con al menos 24 horas de anticipación</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
