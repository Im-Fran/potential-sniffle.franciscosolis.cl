import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type {
  Cita,
  ID
} from '../types/domain';

// Query Keys
export const queryKeys = {
  sucursales: ['sucursales'] as const,
  sucursal: (id: ID) => ['sucursal', id] as const,
  servicios: (filters?: { sucursalId?: ID; especialidad?: string }) =>
    ['servicios', filters] as const,
  profesionales: (filters?: { sucursalId?: ID; especialidad?: string }) =>
    ['profesionales', filters] as const,
  profesional: (id: ID) => ['profesional', id] as const,
  disponibilidad: (profesionalId: ID, fecha: string, servicioId: ID) =>
    ['disponibilidad', profesionalId, fecha, servicioId] as const,
  cita: (id: ID) => ['cita', id] as const,
  citaCodigo: (codigo: string) => ['cita', 'codigo', codigo] as const,
};

// Hooks para Sucursales
export function useSucursales() {
  return useQuery({
    queryKey: queryKeys.sucursales,
    queryFn: () => apiClient.getSucursales(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useSucursal(id: ID) {
  return useQuery({
    queryKey: queryKeys.sucursal(id),
    queryFn: () => apiClient.getSucursal(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hooks para Servicios
export function useServicios(filters?: { sucursalId?: ID; especialidad?: string }) {
  return useQuery({
    queryKey: queryKeys.servicios(filters),
    queryFn: () => apiClient.getServicios(filters),
    staleTime: 5 * 60 * 1000,
  });
}

// Hooks para Profesionales
export function useProfesionales(filters?: { sucursalId?: ID; especialidad?: string }) {
  return useQuery({
    queryKey: queryKeys.profesionales(filters),
    queryFn: () => apiClient.getProfesionales(filters),
    enabled: !filters?.sucursalId || !!filters.sucursalId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProfesional(id: ID) {
  return useQuery({
    queryKey: queryKeys.profesional(id),
    queryFn: () => apiClient.getProfesional(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para Disponibilidad
export function useDisponibilidad(
  profesionalId: ID,
  fecha: string,
  servicioId: ID,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys.disponibilidad(profesionalId, fecha, servicioId),
    queryFn: () => apiClient.getDisponibilidad({ profesionalId, fecha, servicioId }),
    enabled: enabled && !!profesionalId && !!fecha && !!servicioId,
    staleTime: 1 * 60 * 1000, // 1 minuto (más frecuente para disponibilidad)
  });
}

// Hooks para Citas
export function useCitaPorCodigo(codigo: string) {
  return useQuery({
    queryKey: queryKeys.citaCodigo(codigo),
    queryFn: () => apiClient.getCitaPorCodigo(codigo),
    enabled: !!codigo && codigo.length >= 6,
    retry: false, // No reintentar si no encuentra la cita
  });
}

export function useCita(id: ID) {
  return useQuery({
    queryKey: queryKeys.cita(id),
    queryFn: () => apiClient.getCita(id),
    enabled: !!id,
  });
}

// Mutaciones para Citas
export function useCrearCita() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.crearCita(data),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['citas'] });
      queryClient.invalidateQueries({ queryKey: ['disponibilidad'] });
    },
  });
}

export function useReprogramarCita() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ citaId, data }: { citaId: ID; data: any }) =>
      apiClient.reprogramarCita(citaId, data),
    onSuccess: (_, { citaId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cita(citaId) });
      queryClient.invalidateQueries({ queryKey: ['disponibilidad'] });
    },
  });
}

export function useCancelarCita() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (citaId: ID) => apiClient.cancelarCita(citaId),
    onSuccess: (_, citaId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cita(citaId) });
      queryClient.invalidateQueries({ queryKey: ['disponibilidad'] });
    },
  });
}

export function useActualizarEstadoCita() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ citaId, estado }: { citaId: ID; estado: string }) =>
      apiClient.actualizarEstadoCita(citaId, estado),
    onSuccess: (_, { citaId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cita(citaId) });
    },
  });
}

// Mutaciones para Notificaciones
export function useEnviarEmail() {
  return useMutation({
    mutationFn: (params: {
      destinatario: string;
      asunto: string;
      contenido: string;
      adjuntos?: Array<{ nombre: string; contenido: string }>;
    }) => apiClient.enviarNotificacionEmail(params),
  });
}

export function useEnviarSMS() {
  return useMutation({
    mutationFn: (params: {
      telefono: string;
      mensaje: string;
    }) => apiClient.enviarNotificacionSMS(params),
  });
}

// Hook personalizado para gestión de reservas
export function useGestionReserva() {
  const crearCita = useCrearCita();
  const enviarEmail = useEnviarEmail();
  const enviarSMS = useEnviarSMS();

  const confirmarReserva = async (datosReserva: Omit<Cita, 'id' | 'codigo' | 'audit'>) => {
    try {
      // Crear la cita
      const nuevaCita = await crearCita.mutateAsync(datosReserva);

      // Enviar notificaciones en paralelo (mock)
      const promesasNotificacion = [];

      if (nuevaCita.paciente.email) {
        promesasNotificacion.push(
          enviarEmail.mutateAsync({
            destinatario: nuevaCita.paciente.email,
            asunto: 'Confirmación de Cita Dental',
            contenido: `Tu cita ha sido confirmada para el ${nuevaCita.fecha} a las ${nuevaCita.horaInicio}. Código: ${nuevaCita.codigo}`,
          })
        );
      }

      if (nuevaCita.paciente.telefono) {
        promesasNotificacion.push(
          enviarSMS.mutateAsync({
            telefono: nuevaCita.paciente.telefono,
            mensaje: `Cita confirmada ${nuevaCita.fecha} ${nuevaCita.horaInicio}. Código: ${nuevaCita.codigo}`,
          })
        );
      }

      // Esperar notificaciones (opcional, no bloquear el flujo principal)
      Promise.allSettled(promesasNotificacion).catch(console.error);

      return nuevaCita;
    } catch (error) {
      console.error('Error al confirmar reserva:', error);
      throw error;
    }
  };

  return {
    confirmarReserva,
    isLoading: crearCita.isPending,
    error: crearCita.error,
  };
}
