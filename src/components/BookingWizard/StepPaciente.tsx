import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, FileText } from 'lucide-react';
import { validarRut, aplicarMascaraRut } from '@/lib/rut.ts';
import type { ReservaStep } from '@/types/domain.ts';

const pacienteSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),

  rut: z.string()
    .min(1, 'El RUT es obligatorio')
    .refine(validarRut, 'RUT inválido'),

  telefono: z.string()
    .min(1, 'El teléfono es obligatorio')
    .regex(/^\+56\s9\s\d{4}\s\d{4}$/, 'Formato: +56 9 1234 5678'),

  email: z.string()
    .min(1, 'El email es obligatorio')
    .email('Email inválido')
    .max(255, 'El email no puede exceder 255 caracteres'),

  prevision: z.enum(['Fonasa', 'Isapre', 'Particular'], {
    required_error: 'Selecciona tu previsión'
  }),

  notas: z.string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .optional(),

  aceptaTerminos: z.boolean()
    .refine(val => val === true, 'Debes aceptar los términos y condiciones'),

  aceptaPoliticaCancelacion: z.boolean()
    .refine(val => val === true, 'Debes aceptar la política de cancelación')
});

type PacienteFormData = z.infer<typeof pacienteSchema>;

interface StepPacienteProps {
  reservaData: ReservaStep;
  updateReservaData: (data: Partial<ReservaStep>) => void;
  nextStep: () => void;
}

export function StepPaciente({ reservaData, updateReservaData, nextStep }: StepPacienteProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      nombre: reservaData.paciente?.nombre || '',
      rut: reservaData.paciente?.rut || '',
      telefono: reservaData.paciente?.telefono || '',
      email: reservaData.paciente?.email || '',
      prevision: reservaData.paciente?.prevision || undefined,
      notas: reservaData.paciente?.notas || '',
      aceptaTerminos: false,
      aceptaPoliticaCancelacion: false,
    },
    mode: 'onChange'
  });

  const watchedRut = watch('rut');

  const onSubmit = (data: PacienteFormData) => {
    const { aceptaTerminos, aceptaPoliticaCancelacion, ...pacienteData } = data;

    updateReservaData({
      paciente: pacienteData
    });

    nextStep();
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rutFormateado = aplicarMascaraRut(e.target.value);
    setValue('rut', rutFormateado);
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, ''); // Solo números

    // Aplicar formato +56 9 #### ####
    if (valor.startsWith('569')) {
      valor = valor.slice(2); // Remover 56 si ya está
    }
    if (valor.startsWith('9')) {
      valor = valor.slice(1); // Remover 9 si ya está
    }

    // Limitar a 8 dígitos
    valor = valor.slice(0, 8);

    if (valor.length >= 4) {
      valor = `+56 9 ${valor.slice(0, 4)} ${valor.slice(4)}`;
    } else if (valor.length > 0) {
      valor = `+56 9 ${valor}`;
    }

    setValue('telefono', valor);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Datos del paciente
        </h2>
        <p className="text-slate-600">
          Completa tu información personal para confirmar la cita.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información personal */}
        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Información personal
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre completo */}
            <div className="md:col-span-2">
              <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-1">
                Nombre completo *
              </label>
              <input
                {...register('nombre')}
                type="text"
                id="nombre"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.nombre ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="Ingresa tu nombre completo"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
              )}
            </div>

            {/* RUT */}
            <div>
              <label htmlFor="rut" className="block text-sm font-medium text-slate-700 mb-1">
                RUT *
              </label>
              <input
                {...register('rut')}
                type="text"
                id="rut"
                onChange={handleRutChange}
                value={watchedRut}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.rut ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="12.345.678-9"
              />
              {errors.rut && (
                <p className="mt-1 text-sm text-red-600">{errors.rut.message}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-slate-700 mb-1">
                Teléfono móvil *
              </label>
              <input
                {...register('telefono')}
                type="tel"
                id="telefono"
                onChange={handleTelefonoChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.telefono ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="+56 9 1234 5678"
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Contacto y previsión
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email *
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="tu.email@ejemplo.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Previsión */}
            <div>
              <label htmlFor="prevision" className="block text-sm font-medium text-slate-700 mb-1">
                Previsión *
              </label>
              <select
                {...register('prevision')}
                id="prevision"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.prevision ? 'border-red-300' : 'border-slate-300'
                }`}
              >
                <option value="">Selecciona tu previsión</option>
                <option value="Fonasa">Fonasa</option>
                <option value="Isapre">Isapre</option>
                <option value="Particular">Particular</option>
              </select>
              {errors.prevision && (
                <p className="mt-1 text-sm text-red-600">{errors.prevision.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Notas adicionales */}
        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Información adicional
          </h3>

          <div>
            <label htmlFor="notas" className="block text-sm font-medium text-slate-700 mb-1">
              Motivo de la consulta o notas (opcional)
            </label>
            <textarea
              {...register('notas')}
              id="notas"
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.notas ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="Describe brevemente el motivo de tu consulta o cualquier información relevante..."
            />
            {errors.notas && (
              <p className="mt-1 text-sm text-red-600">{errors.notas.message}</p>
            )}
          </div>
        </div>

        {/* Términos y condiciones */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">
            Términos y políticas
          </h3>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <input
                {...register('aceptaTerminos')}
                type="checkbox"
                id="aceptaTerminos"
                className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="aceptaTerminos" className="text-sm text-slate-700">
                Acepto los <button type="button" className="text-blue-600 hover:underline">términos y condiciones</button> del servicio y autorizo el tratamiento de mis datos personales.
              </label>
            </div>
            {errors.aceptaTerminos && (
              <p className="text-sm text-red-600 ml-7">{errors.aceptaTerminos.message}</p>
            )}

            <div className="flex items-start space-x-3">
              <input
                {...register('aceptaPoliticaCancelacion')}
                type="checkbox"
                id="aceptaPoliticaCancelacion"
                className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="aceptaPoliticaCancelacion" className="text-sm text-slate-700">
                He leído y acepto la <button type="button" className="text-blue-600 hover:underline">política de cancelación</button>.
                Entiendo que puedo modificar o cancelar mi cita hasta 24 horas antes.
              </label>
            </div>
            {errors.aceptaPoliticaCancelacion && (
              <p className="text-sm text-red-600 ml-7">{errors.aceptaPoliticaCancelacion.message}</p>
            )}
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isValid}
            className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Continuar al resumen
          </button>
        </div>
      </form>
    </div>
  );
}
