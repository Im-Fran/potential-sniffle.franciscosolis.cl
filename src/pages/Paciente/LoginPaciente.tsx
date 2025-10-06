import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Eye, EyeOff, User, Lock, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { validarRut, aplicarMascaraRut } from '@/lib/rut.ts';

const loginSchema = z.object({
  rut: z.string()
    .min(1, 'El RUT es obligatorio')
    .refine(validarRut, 'RUT inválido'),
  password: z.string()
    .min(1, 'La contraseña es obligatoria'),
  recordarme: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPaciente() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  const watchedRut = watch('rut');

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      // Usar la mockapi para autenticar al paciente
      const response = await fetch('/api/pacientes/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rut: data.rut,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error de autenticación');
      }

      // Guardar sesión (en producción usar httpOnly cookies)
      const sessionData = {
        id: result.data.paciente.id,
        rut: result.data.paciente.rut,
        nombre: result.data.paciente.nombre,
        email: result.data.paciente.email,
        telefono: result.data.paciente.telefono,
        prevision: result.data.paciente.prevision,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem('paciente_token', result.data.token);
      localStorage.setItem('paciente_data', JSON.stringify(sessionData));

      // Si el usuario eligió "recordarme", establecer una expiración más larga
      if (data.recordarme) {
        localStorage.setItem('paciente_remember', 'true');
      }

      navigate('/paciente/dashboard', {
        state: { mensaje: result.message }
      });

    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rutFormateado = aplicarMascaraRut(e.target.value);
    setValue('rut', rutFormateado);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            Portal del Paciente
          </h2>
          <p className="mt-2 text-slate-600">
            Accede a tu cuenta para gestionar tus citas
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* RUT */}
            <div>
              <label htmlFor="rut" className="block text-sm font-medium text-slate-700 mb-2">
                RUT
              </label>
              <div className="relative">
                <input
                  {...register('rut')}
                  type="text"
                  id="rut"
                  onChange={handleRutChange}
                  value={watchedRut || ''}
                  className={`w-full pl-10 pr-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.rut ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="12.345.678-9"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
              {errors.rut && (
                <p className="mt-1 text-sm text-red-600">{errors.rut.message}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="Tu contraseña"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Opciones adicionales */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register('recordarme')}
                  id="recordarme"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="recordarme" className="ml-2 text-sm text-slate-700">
                  Recordar mi sesión
                </label>
              </div>
              <button type="button" className="text-sm text-blue-600 hover:text-blue-800">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Error de login */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-red-700">{loginError}</p>
                </div>
              </div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </form>

          {/* Links adicionales */}
          <div className="mt-6 space-y-3">
            <div className="text-center">
              <Link
                to="/paciente/registro"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ¿No tienes cuenta? Regístrate aquí
              </Link>
            </div>
          </div>
        </div>

        {/* Información de demo */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-medium text-amber-900 mb-2">Cuentas de demostración:</h3>
          <div className="text-sm text-amber-800 space-y-1">
            <p><strong>María González:</strong> 12.345.678-9 / demo123</p>
            <p><strong>Carlos Silva:</strong> 23.456.789-0 / demo123</p>
            <p><strong>Ana Martínez:</strong> 34.567.890-1 / demo123</p>
          </div>
        </div>

        {/* Volver al sitio público */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            ← Volver al sitio principal
          </Link>
        </div>
      </div>
    </div>
  );
}
