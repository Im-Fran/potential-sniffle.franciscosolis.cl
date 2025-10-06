import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Eye, EyeOff, Shield, User, Heart } from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { validarRut, aplicarMascaraRut } from '@/lib/rut';

const registroSchema = z.object({
  // Información básica
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),

  rut: z.string()
    .min(1, 'El RUT es obligatorio')
    .refine(validarRut, 'RUT inválido'),

  email: z.string()
    .min(1, 'El email es obligatorio')
    .email('Email inválido')
    .max(255, 'El email no puede exceder 255 caracteres'),

  telefono: z.string()
    .min(1, 'El teléfono es obligatorio')
    .regex(/^\+56\s9\s\d{4}\s\d{4}$/, 'Formato: +56 9 1234 5678'),

  fechaNacimiento: z.string()
    .min(1, 'La fecha de nacimiento es obligatoria')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 0 && age <= 120;
    }, 'Fecha de nacimiento inválida'),

  prevision: z.string()
    .min(1, 'Selecciona tu previsión')
    .refine((val) => ['Fonasa', 'Isapre', 'Particular'].includes(val), 'Previsión inválida'),

  // Contraseña
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Debe contener al menos una mayúscula, una minúscula y un número'),

  confirmPassword: z.string()
    .min(1, 'Confirma tu contraseña'),

  // Información opcional
  direccion: z.string().optional(),

  // Contacto de emergencia
  contactoEmergencia: z.object({
    nombre: z.string().min(1, 'Nombre del contacto es obligatorio'),
    telefono: z.string().regex(/^\+56\s9\s\d{4}\s\d{4}$/, 'Formato: +56 9 1234 5678'),
    relacion: z.string().min(1, 'Relación es obligatoria'),
  }).optional(),

  // Historial médico
  historialMedico: z.object({
    alergias: z.string().optional(),
    medicamentos: z.string().optional(),
    condicionesMedicas: z.string().optional(),
    observaciones: z.string().optional(),
  }).optional(),

  // Términos y condiciones
  aceptaTerminos: z.boolean()
    .refine((val) => val === true, 'Debes aceptar los términos y condiciones'),

  aceptaPrivacidad: z.boolean()
    .refine((val) => val === true, 'Debes aceptar la política de privacidad'),

  recibirNotificaciones: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegistroFormData = z.infer<typeof registroSchema>;

export function RegistroPaciente() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showContactoEmergencia, setShowContactoEmergencia] = useState(false);
  const [showHistorialMedico, setShowHistorialMedico] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
  } = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema),
    mode: 'onChange',
  });

  const watchedRut = watch('rut');

  // Aplicar máscara de RUT
  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rutConMascara = aplicarMascaraRut(e.target.value);
    setValue('rut', rutConMascara);
    trigger('rut');
  };

  // Aplicar máscara de teléfono
  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'telefono' | 'contactoEmergencia.telefono') => {
    let value = e.target.value.replace(/\D/g, ''); // Solo números

    if (value.startsWith('56')) {
      value = value.slice(2);
    }

    if (value.startsWith('9') && value.length >= 9) {
      const formatted = `+56 9 ${value.slice(1, 5)} ${value.slice(5, 9)}`;
      setValue(field, formatted);
    } else if (value.length === 0) {
      setValue(field, '');
    }
    trigger(field);
  };

  const onSubmit = async (data: RegistroFormData) => {
    setIsLoading(true);

    try {
      // Preparar los datos para enviar a la API
      const datosRegistro = {
        nombre: data.nombre,
        rut: data.rut,
        email: data.email,
        telefono: data.telefono,
        fechaNacimiento: data.fechaNacimiento,
        prevision: data.prevision,
        direccion: data.direccion,
        contactoEmergencia: data.contactoEmergencia,
        historialMedico: data.historialMedico ? {
          alergias: data.historialMedico.alergias ? data.historialMedico.alergias.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
          medicamentos: data.historialMedico.medicamentos ? data.historialMedico.medicamentos.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
          condicionesMedicas: data.historialMedico.condicionesMedicas ? data.historialMedico.condicionesMedicas.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
          observaciones: data.historialMedico.observaciones
        } : undefined,
        password: data.password
      };

      // Enviar datos a la mockapi
      const response = await fetch('/api/pacientes/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosRegistro),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al registrar el paciente');
      }

      // Registro exitoso, redirigir al login
      navigate('/paciente/login', {
        state: {
          mensaje: result.message,
          tipo: 'exito',
          email: data.email,
        },
      });

    } catch (error) {
      console.error('Error al registrar:', error);
      // En una implementación real, mostrarías este error en la UI
      alert(error instanceof Error ? error.message : 'Error al registrar el paciente');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = currentStep === 1
      ? ['nombre', 'rut', 'email', 'telefono', 'fechaNacimiento', 'prevision'] as const
      : currentStep === 2
      ? ['password', 'confirmPassword'] as const
      : [];

    const isStepValid = await trigger(fieldsToValidate as any);
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Información Personal';
      case 2: return 'Crear Contraseña';
      case 3: return 'Información Adicional';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Crear Cuenta de Paciente</h1>
            <p className="text-slate-600 mt-2">
              Registra tus datos para agendar y gestionar tus citas médicas
            </p>
          </div>

          {/* Indicador de pasos */}
          <div className="mt-8 flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step < currentStep 
                    ? 'bg-green-100 text-green-700'
                    : step === currentStep
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-green-300' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <h2 className="text-lg font-semibold text-slate-900">{getStepTitle()}</h2>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Paso 1: Información Personal */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-blue-600 mb-4">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Datos Personales</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      {...register('nombre')}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.nombre ? 'border-red-300' : 'border-slate-300'
                      }`}
                      placeholder="Juan Pérez González"
                    />
                    {errors.nombre && (
                      <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      RUT *
                    </label>
                    <input
                      value={watchedRut || ''}
                      onChange={handleRutChange}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.rut ? 'border-red-300' : 'border-slate-300'
                      }`}
                      placeholder="12.345.678-9"
                    />
                    {errors.rut && (
                      <p className="mt-1 text-sm text-red-600">{errors.rut.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-300' : 'border-slate-300'
                      }`}
                      placeholder="juan@ejemplo.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      {...register('telefono')}
                      onChange={(e) => handleTelefonoChange(e, 'telefono')}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.telefono ? 'border-red-300' : 'border-slate-300'
                      }`}
                      placeholder="+56 9 1234 5678"
                    />
                    {errors.telefono && (
                      <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fecha de Nacimiento *
                    </label>
                    <input
                      {...register('fechaNacimiento')}
                      type="date"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.fechaNacimiento ? 'border-red-300' : 'border-slate-300'
                      }`}
                    />
                    {errors.fechaNacimiento && (
                      <p className="mt-1 text-sm text-red-600">{errors.fechaNacimiento.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Previsión *
                    </label>
                    <select
                      {...register('prevision')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.prevision ? 'border-red-300' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Selecciona tu previsión</option>
                      <option value="Fonasa">FONASA</option>
                      <option value="Isapre">ISAPRE</option>
                      <option value="Particular">Particular</option>
                    </select>
                    {errors.prevision && (
                      <p className="mt-1 text-sm text-red-600">{errors.prevision.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Dirección (Opcional)
                  </label>
                  <input
                    {...register('direccion')}
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Av. Providencia 1234, Providencia"
                  />
                </div>
              </div>
            )}

            {/* Paso 2: Crear Contraseña */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-blue-600 mb-4">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Seguridad de la Cuenta</span>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Requisitos de contraseña:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Mínimo 8 caracteres</li>
                    <li>• Al menos una letra mayúscula</li>
                    <li>• Al menos una letra minúscula</li>
                    <li>• Al menos un número</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.password ? 'border-red-300' : 'border-slate-300'
                        }`}
                        placeholder="Ingresa tu contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirmar Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        {...register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.confirmPassword ? 'border-red-300' : 'border-slate-300'
                        }`}
                        placeholder="Confirma tu contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Paso 3: Información Adicional */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-blue-600 mb-4">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Información Adicional (Opcional)</span>
                </div>

                {/* Contacto de Emergencia */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-700">Contacto de Emergencia</h3>
                    <button
                      type="button"
                      onClick={() => setShowContactoEmergencia(!showContactoEmergencia)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {showContactoEmergencia ? 'Ocultar' : 'Agregar'}
                    </button>
                  </div>

                  {showContactoEmergencia && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Nombre
                        </label>
                        <input
                          {...register('contactoEmergencia.nombre')}
                          type="text"
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="María González"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Teléfono
                        </label>
                        <input
                          {...register('contactoEmergencia.telefono')}
                          onChange={(e) => handleTelefonoChange(e, 'contactoEmergencia.telefono')}
                          type="text"
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+56 9 8765 4321"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Relación
                        </label>
                        <select
                          {...register('contactoEmergencia.relacion')}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Seleccionar</option>
                          <option value="Madre">Madre</option>
                          <option value="Padre">Padre</option>
                          <option value="Cónyuge">Cónyuge</option>
                          <option value="Hermano/a">Hermano/a</option>
                          <option value="Hijo/a">Hijo/a</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Historial Médico */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-700">Historial Médico</h3>
                    <button
                      type="button"
                      onClick={() => setShowHistorialMedico(!showHistorialMedico)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {showHistorialMedico ? 'Ocultar' : 'Agregar'}
                    </button>
                  </div>

                  {showHistorialMedico && (
                    <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Alergias
                        </label>
                        <textarea
                          {...register('historialMedico.alergias')}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={2}
                          placeholder="Ej: Penicilina, mariscos..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Medicamentos actuales
                        </label>
                        <textarea
                          {...register('historialMedico.medicamentos')}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={2}
                          placeholder="Ej: Atorvastatina 20mg..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Condiciones médicas
                        </label>
                        <textarea
                          {...register('historialMedico.condicionesMedicas')}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={2}
                          placeholder="Ej: Diabetes tipo 2, hipertensión..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Observaciones adicionales
                        </label>
                        <textarea
                          {...register('historialMedico.observaciones')}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="Cualquier información adicional relevante..."
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Términos y condiciones */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input
                      {...register('aceptaTerminos')}
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm text-slate-700">
                      Acepto los{' '}
                      <Link to="/terminos" className="text-blue-600 hover:text-blue-700 underline">
                        Términos y Condiciones
                      </Link>{' '}
                      del servicio *
                    </label>
                  </div>
                  {errors.aceptaTerminos && (
                    <p className="text-sm text-red-600">{errors.aceptaTerminos.message}</p>
                  )}

                  <div className="flex items-start space-x-3">
                    <input
                      {...register('aceptaPrivacidad')}
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm text-slate-700">
                      Acepto la{' '}
                      <Link to="/privacidad" className="text-blue-600 hover:text-blue-700 underline">
                        Política de Privacidad
                      </Link>{' '}
                      *
                    </label>
                  </div>
                  {errors.aceptaPrivacidad && (
                    <p className="text-sm text-red-600">{errors.aceptaPrivacidad.message}</p>
                  )}

                  <div className="flex items-start space-x-3">
                    <input
                      {...register('recibirNotificaciones')}
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm text-slate-700">
                      Deseo recibir notificaciones por email y SMS sobre mis citas
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Botones de navegación */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Anterior
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !isValid}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Registrando...</span>
                    </>
                  ) : (
                    <span>Crear Cuenta</span>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/paciente/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
