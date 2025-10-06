import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar, Search, Plus, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner.tsx';
import { validarRut, aplicarMascaraRut } from '../../lib/rut.ts';
import { formatearFechaChile, obtenerFechaHoyChile } from '../../lib/time.ts';
import { format, addDays, subDays } from 'date-fns';

const citaAdminSchema = z.object({
  sucursalId: z.string().min(1, 'Selecciona una sucursal'),
  profesionalId: z.string().min(1, 'Selecciona un profesional'),
  servicioId: z.string().min(1, 'Selecciona un servicio'),
  fecha: z.string().min(1, 'Selecciona una fecha'),
  horaInicio: z.string().min(1, 'Selecciona un horario'),
  paciente: z.object({
    nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
    rut: z.string().min(1, 'RUT es obligatorio').refine(validarRut, 'RUT inválido'),
    telefono: z.string().min(1, 'Teléfono es obligatorio'),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    prevision: z.enum(['Fonasa', 'Isapre', 'Particular']),
    notas: z.string().optional(),
  }),
});

type CitaAdminFormData = z.infer<typeof citaAdminSchema>;

interface CrearCitaAdminProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (cita: any) => void;
}

export function CrearCitaAdmin({ isOpen, onClose, onSuccess }: CrearCitaAdminProps) {
  const [step, setStep] = useState<'form' | 'horarios'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [buscarPaciente, setBuscarPaciente] = useState('');
  const [pacienteEncontrado, setPacienteEncontrado] = useState<any>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(obtenerFechaHoyChile());
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  // Datos mock
  const sucursales = [
    { id: 'suc-1', nombre: 'Providencia', direccion: 'Av. Providencia 1234' },
    { id: 'suc-2', nombre: 'Maipú', direccion: 'Av. Pajaritos 5678' },
  ];

  const profesionales = [
    { id: 'prof-1', nombre: 'Dra. Ana Pérez', especialidad: 'Odontología General' },
    { id: 'prof-2', nombre: 'Dr. Luis Soto', especialidad: 'Endodoncia' },
    { id: 'prof-3', nombre: 'Dra. Carmen López', especialidad: 'Ortodoncia' },
  ];

  const servicios = [
    { id: 'serv-1', nombre: 'Limpieza', duracion: 30, precio: 25000 },
    { id: 'serv-2', nombre: 'Control', duracion: 15, precio: 15000 },
    { id: 'serv-3', nombre: 'Endodoncia', duracion: 60, precio: 80000 },
    { id: 'serv-4', nombre: 'Ortodoncia', duracion: 45, precio: 60000 },
    { id: 'serv-5', nombre: 'Urgencia', duracion: 30, precio: 35000 },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CitaAdminFormData>({
    resolver: zodResolver(citaAdminSchema),
    defaultValues: {
      fecha: obtenerFechaHoyChile(),
      paciente: {
        prevision: 'Fonasa',
      },
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (!isOpen) {
      reset();
      setStep('form');
      setBuscarPaciente('');
      setPacienteEncontrado(null);
      setFechaSeleccionada(obtenerFechaHoyChile());
    }
  }, [isOpen, reset]);

  // Cargar horarios disponibles cuando cambie la selección
  useEffect(() => {
    if (watchedValues.sucursalId && watchedValues.profesionalId && watchedValues.fecha) {
      cargarHorariosDisponibles();
    }
  }, [watchedValues.sucursalId, watchedValues.profesionalId, watchedValues.fecha]);

  const cargarHorariosDisponibles = async () => {
    setLoadingHorarios(true);
    
    // Simular carga de horarios
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generar horarios mock
    const horarios = [];
    for (let i = 8; i <= 18; i++) {
      horarios.push(`${i.toString().padStart(2, '0')}:00`);
      if (i < 18) {
        horarios.push(`${i.toString().padStart(2, '0')}:30`);
      }
    }
    
    // Filtrar algunos horarios como ocupados
    const disponibles = horarios.filter(() => Math.random() > 0.3);
    
    setHorariosDisponibles(disponibles);
    setLoadingHorarios(false);
  };

  const buscarPacienteExistente = async () => {
    if (!buscarPaciente.trim()) return;

    setIsLoading(true);
    
    // Simular búsqueda
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock de paciente encontrado
    if (buscarPaciente.includes('12345678') || buscarPaciente.toLowerCase().includes('maría')) {
      const paciente = {
        nombre: 'María González',
        rut: '12.345.678-9',
        telefono: '+56 9 1234 5678',
        email: 'maria@email.com',
        prevision: 'Fonasa' as const,
      };
      
      setPacienteEncontrado(paciente);
      setValue('paciente.nombre', paciente.nombre);
      setValue('paciente.rut', paciente.rut);
      setValue('paciente.telefono', paciente.telefono);
      setValue('paciente.email', paciente.email);
      setValue('paciente.prevision', paciente.prevision);
    } else {
      setPacienteEncontrado(null);
    }
    
    setIsLoading(false);
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rutFormateado = aplicarMascaraRut(e.target.value);
    setValue('paciente.rut', rutFormateado);
  };

  const cambiarFecha = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = direccion === 'anterior'
      ? format(subDays(new Date(fechaSeleccionada), 1), 'yyyy-MM-dd')
      : format(addDays(new Date(fechaSeleccionada), 1), 'yyyy-MM-dd');
    
    setFechaSeleccionada(nuevaFecha);
    setValue('fecha', nuevaFecha);
  };

  const seleccionarHorario = (hora: string) => {
    setValue('horaInicio', hora);
    setStep('form');
  };

  const onSubmit = async (data: CitaAdminFormData) => {
    setIsLoading(true);
    
    try {
      // Simular creación de cita
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const nuevaCita = {
        id: `cita-${Date.now()}`,
        codigo: `2501${Math.random().toString().slice(2, 8)}`,
        ...data,
        estado: 'PROGRAMADA' as const,
        createdAt: new Date().toISOString(),
      };
      
      console.log('Cita creada:', nuevaCita);
      
      if (onSuccess) {
        onSuccess(nuevaCita);
      }
      
      onClose();
    } catch (error) {
      console.error('Error al crear cita:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {step === 'form' ? 'Crear Nueva Cita' : 'Seleccionar Horario'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          {step === 'form' ? (
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Búsqueda de paciente existente */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-3">Buscar Paciente Existente</h3>
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Buscar por RUT, nombre o teléfono..."
                      value={buscarPaciente}
                      onChange={(e) => setBuscarPaciente(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={buscarPacienteExistente}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
                
                {pacienteEncontrado && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">
                      ✓ Paciente encontrado: <strong>{pacienteEncontrado.nombre}</strong> - {pacienteEncontrado.rut}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Información del paciente */}
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900">Información del Paciente</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      {...register('paciente.nombre')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nombre del paciente"
                    />
                    {errors.paciente?.nombre && (
                      <p className="mt-1 text-sm text-red-600">{errors.paciente.nombre.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      RUT *
                    </label>
                    <input
                      {...register('paciente.rut')}
                      onChange={handleRutChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="12.345.678-9"
                    />
                    {errors.paciente?.rut && (
                      <p className="mt-1 text-sm text-red-600">{errors.paciente.rut.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      {...register('paciente.telefono')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+56 9 1234 5678"
                    />
                    {errors.paciente?.telefono && (
                      <p className="mt-1 text-sm text-red-600">{errors.paciente.telefono.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      {...register('paciente.email')}
                      type="email"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@ejemplo.com"
                    />
                    {errors.paciente?.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.paciente.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Previsión *
                    </label>
                    <select
                      {...register('paciente.prevision')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Fonasa">Fonasa</option>
                      <option value="Isapre">Isapre</option>
                      <option value="Particular">Particular</option>
                    </select>
                    {errors.paciente?.prevision && (
                      <p className="mt-1 text-sm text-red-600">{errors.paciente.prevision.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Notas
                    </label>
                    <textarea
                      {...register('paciente.notas')}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Observaciones adicionales..."
                    />
                  </div>
                </div>

                {/* Información de la cita */}
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900">Información de la Cita</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Sucursal *
                    </label>
                    <select
                      {...register('sucursalId')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecciona una sucursal</option>
                      {sucursales.map(sucursal => (
                        <option key={sucursal.id} value={sucursal.id}>
                          {sucursal.nombre} - {sucursal.direccion}
                        </option>
                      ))}
                    </select>
                    {errors.sucursalId && (
                      <p className="mt-1 text-sm text-red-600">{errors.sucursalId.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Profesional *
                    </label>
                    <select
                      {...register('profesionalId')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecciona un profesional</option>
                      {profesionales.map(profesional => (
                        <option key={profesional.id} value={profesional.id}>
                          {profesional.nombre} - {profesional.especialidad}
                        </option>
                      ))}
                    </select>
                    {errors.profesionalId && (
                      <p className="mt-1 text-sm text-red-600">{errors.profesionalId.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Servicio *
                    </label>
                    <select
                      {...register('servicioId')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecciona un servicio</option>
                      {servicios.map(servicio => (
                        <option key={servicio.id} value={servicio.id}>
                          {servicio.nombre} - {servicio.duracion}min - ${servicio.precio.toLocaleString('es-CL')}
                        </option>
                      ))}
                    </select>
                    {errors.servicioId && (
                      <p className="mt-1 text-sm text-red-600">{errors.servicioId.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Fecha *
                    </label>
                    <input
                      {...register('fecha')}
                      type="date"
                      min={obtenerFechaHoyChile()}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.fecha && (
                      <p className="mt-1 text-sm text-red-600">{errors.fecha.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Horario *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        {...register('horaInicio')}
                        readOnly
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Selecciona un horario"
                      />
                      <button
                        type="button"
                        onClick={() => setStep('horarios')}
                        disabled={!watchedValues.sucursalId || !watchedValues.profesionalId || !watchedValues.fecha}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    </div>
                    {errors.horaInicio && (
                      <p className="mt-1 text-sm text-red-600">{errors.horaInicio.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Creando...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Crear Cita</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            // Vista de selección de horarios
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setStep('form')}
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Volver al formulario</span>
                </button>

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
                      {formatearFechaChile(fechaSeleccionada)}
                    </span>
                  </div>

                  <button
                    onClick={() => cambiarFecha('siguiente')}
                    className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Información de la cita */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Sucursal:</span>
                    <p className="font-medium">
                      {sucursales.find(s => s.id === watchedValues.sucursalId)?.nombre}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600">Profesional:</span>
                    <p className="font-medium">
                      {profesionales.find(p => p.id === watchedValues.profesionalId)?.nombre}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600">Servicio:</span>
                    <p className="font-medium">
                      {servicios.find(s => s.id === watchedValues.servicioId)?.nombre}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid de horarios */}
              {loadingHorarios ? (
                <div className="text-center py-12">
                  <LoadingSpinner />
                  <p className="mt-4 text-slate-600">Cargando horarios disponibles...</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {horariosDisponibles.map((hora) => (
                    <button
                      key={hora}
                      onClick={() => seleccionarHorario(hora)}
                      className="p-3 text-center border border-slate-200 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      <Clock className="w-4 h-4 mx-auto mb-1 text-slate-500" />
                      <span className="text-sm font-medium">{hora}</span>
                    </button>
                  ))}
                </div>
              )}

              {horariosDisponibles.length === 0 && !loadingHorarios && (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-600">No hay horarios disponibles para esta fecha</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Intenta seleccionar otra fecha o profesional
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}