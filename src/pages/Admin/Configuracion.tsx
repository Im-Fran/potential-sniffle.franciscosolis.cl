import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Settings, Save, RefreshCw, Bell, Clock, Calendar, Palette, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import type { ConfiguracionSistema } from '../../types/domain';

const configuracionSchema = z.object({
  general: z.object({
    nombreClinica: z.string().min(1, 'Nombre de clínica es requerido'),
    colorPrimario: z.string().min(1, 'Color primario es requerido'),
    colorSecundario: z.string().min(1, 'Color secundario es requerido'),
    idioma: z.string().min(1, 'Idioma es requerido'),
    zonaHoraria: z.string().min(1, 'Zona horaria es requerida'),
  }),
  reservas: z.object({
    anticipacionMinima: z.number().min(1, 'Mínimo 1 hora').max(168, 'Máximo 7 días'),
    anticipacionMaxima: z.number().min(1, 'Mínimo 1 día').max(365, 'Máximo 1 año'),
    permitirReprogramacion: z.boolean(),
    horasLimiteReprogramacion: z.number().min(1, 'Mínimo 1 hora').max(168, 'Máximo 7 días'),
    permitirCancelacion: z.boolean(),
    horasLimiteCancelacion: z.number().min(1, 'Mínimo 1 hora').max(168, 'Máximo 7 días'),
    requierePagoAnticipado: z.boolean(),
    overbookingPermitido: z.boolean(),
    porcentajeOverbooking: z.number().min(0, 'Mínimo 0%').max(50, 'Máximo 50%'),
  }),
  notificaciones: z.object({
    emailConfirmacion: z.boolean(),
    smsConfirmacion: z.boolean(),
    recordatorioEmail: z.boolean(),
    recordatorioSMS: z.boolean(),
    horasAnteriorRecordatorio: z.number().min(1, 'Mínimo 1 hora').max(168, 'Máximo 7 días'),
    emailCancelacion: z.boolean(),
    smsCancelacion: z.boolean(),
  }),
  horarios: z.object({
    horaAperturaDefault: z.string().min(1, 'Hora de apertura es requerida'),
    horaCierreDefault: z.string().min(1, 'Hora de cierre es requerida'),
    duracionSlotDefault: z.number().min(5, 'Mínimo 5 minutos').max(120, 'Máximo 2 horas'),
    tiempoBufferDefault: z.number().min(0, 'Mínimo 0 minutos').max(60, 'Máximo 60 minutos'),
    diasLaboralesDefault: z.array(z.number()).min(1, 'Selecciona al menos un día'),
  }),
});

type ConfiguracionFormData = z.infer<typeof configuracionSchema>;

export function AdminConfiguracion() {
  const [vistaActiva, setVistaActiva] = useState<'general' | 'reservas' | 'notificaciones' | 'horarios'>('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset
  } = useForm<ConfiguracionFormData>({
    resolver: zodResolver(configuracionSchema),
    defaultValues: {
      general: {
        nombreClinica: 'Clínica Dental',
        colorPrimario: '#2563eb',
        colorSecundario: '#10b981',
        idioma: 'es-CL',
        zonaHoraria: 'America/Santiago',
      },
      reservas: {
        anticipacionMinima: 2,
        anticipacionMaxima: 90,
        permitirReprogramacion: true,
        horasLimiteReprogramacion: 24,
        permitirCancelacion: true,
        horasLimiteCancelacion: 24,
        requierePagoAnticipado: false,
        overbookingPermitido: false,
        porcentajeOverbooking: 0,
      },
      notificaciones: {
        emailConfirmacion: true,
        smsConfirmacion: true,
        recordatorioEmail: true,
        recordatorioSMS: false,
        horasAnteriorRecordatorio: 24,
        emailCancelacion: true,
        smsCancelacion: false,
      },
      horarios: {
        horaAperturaDefault: '08:00',
        horaCierreDefault: '19:00',
        duracionSlotDefault: 15,
        tiempoBufferDefault: 5,
        diasLaboralesDefault: [1, 2, 3, 4, 5], // Lunes a viernes
      },
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    setIsLoading(true);

    try {
      // Simular carga de configuración
      await new Promise(resolve => setTimeout(resolve, 1000));

      // En una implementación real, aquí se cargarían los datos desde la API
      // const config = await apiClient.getConfiguracion();
      // reset(config);

      setIsLoading(false);
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      setMensaje({ tipo: 'error', texto: 'Error al cargar la configuración' });
      setIsLoading(false);
    }
  };

  const guardarConfiguracion = async (data: ConfiguracionFormData) => {
    setIsSaving(true);
    setMensaje(null);

    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Guardando configuración:', data);

      // En una implementación real:
      // await apiClient.actualizarConfiguracion(data);

      setMensaje({ tipo: 'success', texto: 'Configuración guardada exitosamente' });

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje(null), 3000);

    } catch (error) {
      console.error('Error al guardar configuración:', error);
      setMensaje({ tipo: 'error', texto: 'Error al guardar la configuración' });
    } finally {
      setIsSaving(false);
    }
  };

  const navegaciones = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'reservas', label: 'Reservas', icon: Calendar },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'horarios', label: 'Horarios', icon: Clock },
  ];

  const diasSemana = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 0, label: 'Domingo' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Configuración del Sistema</h1>
              <p className="text-slate-600">Ajusta las configuraciones globales de la clínica</p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={cargarConfiguracion}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Recargar</span>
              </button>
            </div>
          </div>

          {/* Navegación de vistas */}
          <div className="mt-6 flex space-x-1 bg-slate-100 rounded-lg p-1">
            {navegaciones.map((nav) => {
              const Icon = nav.icon;
              return (
                <button
                  key={nav.id}
                  onClick={() => setVistaActiva(nav.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    vistaActiva === nav.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{nav.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mensajes */}
          {mensaje && (
            <div className={`mt-4 p-4 rounded-lg ${
              mensaje.tipo === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                {mensaje.tipo === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  mensaje.tipo === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {mensaje.texto}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(guardarConfiguracion)} className="space-y-8">

          {/* Configuración General */}
          {vistaActiva === 'general' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="w-5 h-5 text-slate-500" />
                <h2 className="text-lg font-semibold text-slate-900">Configuración General</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre de la Clínica *
                  </label>
                  <input
                    {...register('general.nombreClinica')}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.general?.nombreClinica ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="Nombre de tu clínica"
                  />
                  {errors.general?.nombreClinica && (
                    <p className="mt-1 text-sm text-red-600">{errors.general.nombreClinica.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Zona Horaria *
                  </label>
                  <select
                    {...register('general.zonaHoraria')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.general?.zonaHoraria ? 'border-red-300' : 'border-slate-300'
                    }`}
                  >
                    <option value="America/Santiago">Chile (America/Santiago)</option>
                    <option value="America/Argentina/Buenos_Aires">Argentina</option>
                    <option value="America/Bogota">Colombia</option>
                    <option value="America/Lima">Perú</option>
                  </select>
                  {errors.general?.zonaHoraria && (
                    <p className="mt-1 text-sm text-red-600">{errors.general.zonaHoraria.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Color Primario *
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      {...register('general.colorPrimario')}
                      type="color"
                      className="w-12 h-10 border border-slate-300 rounded cursor-pointer"
                    />
                    <input
                      {...register('general.colorPrimario')}
                      type="text"
                      className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.general?.colorPrimario ? 'border-red-300' : 'border-slate-300'
                      }`}
                      placeholder="#2563eb"
                    />
                  </div>
                  {errors.general?.colorPrimario && (
                    <p className="mt-1 text-sm text-red-600">{errors.general.colorPrimario.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Color Secundario *
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      {...register('general.colorSecundario')}
                      type="color"
                      className="w-12 h-10 border border-slate-300 rounded cursor-pointer"
                    />
                    <input
                      {...register('general.colorSecundario')}
                      type="text"
                      className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.general?.colorSecundario ? 'border-red-300' : 'border-slate-300'
                      }`}
                      placeholder="#10b981"
                    />
                  </div>
                  {errors.general?.colorSecundario && (
                    <p className="mt-1 text-sm text-red-600">{errors.general.colorSecundario.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Idioma *
                  </label>
                  <select
                    {...register('general.idioma')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.general?.idioma ? 'border-red-300' : 'border-slate-300'
                    }`}
                  >
                    <option value="es-CL">Español (Chile)</option>
                    <option value="es-ES">Español (España)</option>
                    <option value="es-AR">Español (Argentina)</option>
                    <option value="en-US">English (US)</option>
                  </select>
                  {errors.general?.idioma && (
                    <p className="mt-1 text-sm text-red-600">{errors.general.idioma.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Configuración de Reservas */}
          {vistaActiva === 'reservas' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Calendar className="w-5 h-5 text-slate-500" />
                <h2 className="text-lg font-semibold text-slate-900">Configuración de Reservas</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Anticipación Mínima (horas) *
                    </label>
                    <input
                      {...register('reservas.anticipacionMinima', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="168"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.reservas?.anticipacionMinima ? 'border-red-300' : 'border-slate-300'
                      }`}
                    />
                    {errors.reservas?.anticipacionMinima && (
                      <p className="mt-1 text-sm text-red-600">{errors.reservas.anticipacionMinima.message}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">Tiempo mínimo antes de la cita para reservar</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Anticipación Máxima (días) *
                    </label>
                    <input
                      {...register('reservas.anticipacionMaxima', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="365"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.reservas?.anticipacionMaxima ? 'border-red-300' : 'border-slate-300'
                      }`}
                    />
                    {errors.reservas?.anticipacionMaxima && (
                      <p className="mt-1 text-sm text-red-600">{errors.reservas.anticipacionMaxima.message}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">Máximo de días en el futuro para reservar</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-md font-medium text-slate-900 mb-4">Políticas de Modificación</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Permitir Reprogramación</label>
                        <p className="text-xs text-slate-500">Los pacientes pueden reprogramar sus citas</p>
                      </div>
                      <input
                        {...register('reservas.permitirReprogramacion')}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    {watchedValues.reservas?.permitirReprogramacion && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Límite para Reprogramar (horas) *
                        </label>
                        <input
                          {...register('reservas.horasLimiteReprogramacion', { valueAsNumber: true })}
                          type="number"
                          min="1"
                          max="168"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.reservas?.horasLimiteReprogramacion ? 'border-red-300' : 'border-slate-300'
                          }`}
                        />
                        {errors.reservas?.horasLimiteReprogramacion && (
                          <p className="mt-1 text-sm text-red-600">{errors.reservas.horasLimiteReprogramacion.message}</p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Permitir Cancelación</label>
                        <p className="text-xs text-slate-500">Los pacientes pueden cancelar sus citas</p>
                      </div>
                      <input
                        {...register('reservas.permitirCancelacion')}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    {watchedValues.reservas?.permitirCancelacion && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Límite para Cancelar (horas) *
                        </label>
                        <input
                          {...register('reservas.horasLimiteCancelacion', { valueAsNumber: true })}
                          type="number"
                          min="1"
                          max="168"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.reservas?.horasLimiteCancelacion ? 'border-red-300' : 'border-slate-300'
                          }`}
                        />
                        {errors.reservas?.horasLimiteCancelacion && (
                          <p className="mt-1 text-sm text-red-600">{errors.reservas.horasLimiteCancelacion.message}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-md font-medium text-slate-900 mb-4">Configuraciones Avanzadas</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Requiere Pago Anticipado</label>
                        <p className="text-xs text-slate-500">Las citas requieren pago antes de confirmar</p>
                      </div>
                      <input
                        {...register('reservas.requierePagoAnticipado')}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Permitir Overbooking</label>
                        <p className="text-xs text-slate-500">Permite reservar más citas de las disponibles</p>
                      </div>
                      <input
                        {...register('reservas.overbookingPermitido')}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    {watchedValues.reservas?.overbookingPermitido && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Porcentaje de Overbooking (%) *
                        </label>
                        <input
                          {...register('reservas.porcentajeOverbooking', { valueAsNumber: true })}
                          type="number"
                          min="0"
                          max="50"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.reservas?.porcentajeOverbooking ? 'border-red-300' : 'border-slate-300'
                          }`}
                        />
                        {errors.reservas?.porcentajeOverbooking && (
                          <p className="mt-1 text-sm text-red-600">{errors.reservas.porcentajeOverbooking.message}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Configuración de Notificaciones */}
          {vistaActiva === 'notificaciones' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Bell className="w-5 h-5 text-slate-500" />
                <h2 className="text-lg font-semibold text-slate-900">Configuración de Notificaciones</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-slate-900 mb-4">Notificaciones de Confirmación</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Email de Confirmación</label>
                        <p className="text-xs text-slate-500">Enviar email cuando se confirme una cita</p>
                      </div>
                      <input
                        {...register('notificaciones.emailConfirmacion')}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">SMS de Confirmación</label>
                        <p className="text-xs text-slate-500">Enviar SMS cuando se confirme una cita</p>
                      </div>
                      <input
                        {...register('notificaciones.smsConfirmacion')}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-md font-medium text-slate-900 mb-4">Recordatorios</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Recordatorio por Email</label>
                        <p className="text-xs text-slate-500">Enviar recordatorio antes de la cita</p>
                      </div>
                      <input
                        {...register('notificaciones.recordatorioEmail')}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Recordatorio por SMS</label>
                        <p className="text-xs text-slate-500">Enviar recordatorio antes de la cita</p>
                      </div>
                      <input
                        {...register('notificaciones.recordatorioSMS')}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    {(watchedValues.notificaciones?.recordatorioEmail || watchedValues.notificaciones?.recordatorioSMS) && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Horas Antes del Recordatorio *
                        </label>
                        <input
                          {...register('notificaciones.horasAnteriorRecordatorio', { valueAsNumber: true })}
                          type="number"
                          min="1"
                          max="168"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.notificaciones?.horasAnteriorRecordatorio ? 'border-red-300' : 'border-slate-300'
                          }`}
                        />
                        {errors.notificaciones?.horasAnteriorRecordatorio && (
                          <p className="mt-1 text-sm text-red-600">{errors.notificaciones.horasAnteriorRecordatorio.message}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-md font-medium text-slate-900 mb-4">Notificaciones de Cancelación</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Email de Cancelación</label>
                        <p className="text-xs text-slate-500">Enviar email cuando se cancele una cita</p>
                      </div>
                      <input
                        {...register('notificaciones.emailCancelacion')}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">SMS de Cancelación</label>
                        <p className="text-xs text-slate-500">Enviar SMS cuando se cancele una cita</p>
                      </div>
                      <input
                        {...register('notificaciones.smsCancelacion')}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Configuración de Horarios */}
          {vistaActiva === 'horarios' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="w-5 h-5 text-slate-500" />
                <h2 className="text-lg font-semibold text-slate-900">Configuración de Horarios</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Hora de Apertura por Defecto *
                    </label>
                    <input
                      {...register('horarios.horaAperturaDefault')}
                      type="time"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.horarios?.horaAperturaDefault ? 'border-red-300' : 'border-slate-300'
                      }`}
                    />
                    {errors.horarios?.horaAperturaDefault && (
                      <p className="mt-1 text-sm text-red-600">{errors.horarios.horaAperturaDefault.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Hora de Cierre por Defecto *
                    </label>
                    <input
                      {...register('horarios.horaCierreDefault')}
                      type="time"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.horarios?.horaCierreDefault ? 'border-red-300' : 'border-slate-300'
                      }`}
                    />
                    {errors.horarios?.horaCierreDefault && (
                      <p className="mt-1 text-sm text-red-600">{errors.horarios.horaCierreDefault.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Duración de Slot por Defecto (minutos) *
                    </label>
                    <select
                      {...register('horarios.duracionSlotDefault', { valueAsNumber: true })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.horarios?.duracionSlotDefault ? 'border-red-300' : 'border-slate-300'
                      }`}
                    >
                      <option value={5}>5 minutos</option>
                      <option value={10}>10 minutos</option>
                      <option value={15}>15 minutos</option>
                      <option value={20}>20 minutos</option>
                      <option value={30}>30 minutos</option>
                      <option value={60}>60 minutos</option>
                    </select>
                    {errors.horarios?.duracionSlotDefault && (
                      <p className="mt-1 text-sm text-red-600">{errors.horarios.duracionSlotDefault.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tiempo Buffer por Defecto (minutos) *
                    </label>
                    <input
                      {...register('horarios.tiempoBufferDefault', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      max="60"
                      step="5"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.horarios?.tiempoBufferDefault ? 'border-red-300' : 'border-slate-300'
                      }`}
                    />
                    {errors.horarios?.tiempoBufferDefault && (
                      <p className="mt-1 text-sm text-red-600">{errors.horarios.tiempoBufferDefault.message}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">Tiempo extra entre citas</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Días Laborales por Defecto *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {diasSemana.map((dia) => (
                      <label key={dia.value} className="flex items-center space-x-2">
                        <input
                          {...register('horarios.diasLaboralesDefault')}
                          type="checkbox"
                          value={dia.value}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">{dia.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.horarios?.diasLaboralesDefault && (
                    <p className="mt-1 text-sm text-red-600">{errors.horarios.diasLaboralesDefault.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Botón de guardar */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-2 text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
            >
              Descartar Cambios
            </button>

            <button
              type="submit"
              disabled={!isDirty || isSaving}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Configuración</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
