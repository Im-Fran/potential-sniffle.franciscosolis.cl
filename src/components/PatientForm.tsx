import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Phone, Mail, CreditCard } from 'lucide-react';
import { validarRut, aplicarMascaraRut } from '../lib/rut';

const pacienteFormSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  rut: z.string()
    .min(1, 'El RUT es obligatorio')
    .refine(validarRut, 'RUT inválido'),

  telefono: z.string()
    .min(1, 'El teléfono es obligatorio')
    .regex(/^\+56\s9\s\d{4}\s\d{4}$/, 'Formato: +56 9 1234 5678'),

  email: z.string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),

  prevision: z.enum(['Fonasa', 'Isapre', 'Particular'], {
    required_error: 'Selecciona tu previsión'
  }),

  notas: z.string().optional(),
});

type PacienteFormData = z.infer<typeof pacienteFormSchema>;

interface PatientFormProps {
  onSubmit: (data: PacienteFormData) => void;
  defaultValues?: Partial<PacienteFormData>;
  isLoading?: boolean;
  submitLabel?: string;
}

export function PatientForm({
  onSubmit,
  defaultValues,
  isLoading = false,
  submitLabel = "Guardar"
}: PatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteFormSchema),
    defaultValues,
    mode: 'onChange'
  });

  const watchedRut = watch('rut');
  const watchedTelefono = watch('telefono');

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rutFormateado = aplicarMascaraRut(e.target.value);
    setValue('rut', rutFormateado);
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, '');

    if (valor.startsWith('569')) {
      valor = valor.slice(2);
    }
    if (valor.startsWith('9')) {
      valor = valor.slice(1);
    }

    valor = valor.slice(0, 8);

    if (valor.length >= 4) {
      valor = `+56 9 ${valor.slice(0, 4)} ${valor.slice(4)}`;
    } else if (valor.length > 0) {
      valor = `+56 9 ${valor}`;
    }

    setValue('telefono', valor);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Información personal */}
      <div className="bg-slate-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Información del Paciente
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
              placeholder="Nombre completo del paciente"
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
              value={watchedRut || ''}
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
              Teléfono *
            </label>
            <input
              {...register('telefono')}
              type="tel"
              id="telefono"
              onChange={handleTelefonoChange}
              value={watchedTelefono || ''}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.telefono ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="+56 9 1234 5678"
            />
            {errors.telefono && (
              <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="email@ejemplo.com"
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
              <option value="">Seleccionar previsión</option>
              <option value="Fonasa">Fonasa</option>
              <option value="Isapre">Isapre</option>
              <option value="Particular">Particular</option>
            </select>
            {errors.prevision && (
              <p className="mt-1 text-sm text-red-600">{errors.prevision.message}</p>
            )}
          </div>

          {/* Notas */}
          <div className="md:col-span-2">
            <label htmlFor="notas" className="block text-sm font-medium text-slate-700 mb-1">
              Notas adicionales
            </label>
            <textarea
              {...register('notas')}
              id="notas"
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Información adicional o motivo de la consulta..."
            />
            {errors.notas && (
              <p className="mt-1 text-sm text-red-600">{errors.notas.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Botón de envío */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
