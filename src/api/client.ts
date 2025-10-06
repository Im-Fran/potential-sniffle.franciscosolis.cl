import type {
  Sucursal,
  Profesional,
  Servicio,
  Cita,
  DisponibilidadSlot,
  Usuario,
  ID
} from '../types/domain';

// Configuración base del cliente
const BASE_URL = '/api';
const MOCK_DELAY = 300; // ms para simular latencia de red

// Función helper para simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Función helper para simular errores ocasionales
const shouldSimulateError = () => Math.random() < 0.05; // 5% de probabilidad

class ApiError extends Error {
  constructor(status: number, message: string) {
    super(`[${status}] ${message}`);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    await delay(MOCK_DELAY);

    if (shouldSimulateError()) {
      throw new ApiError(500, 'Error de servidor simulado');
    }

    // Por ahora simulamos las respuestas, luego MSW tomará control
    const url = `${BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new ApiError(response.status, `Error HTTP: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      // Para desarrollo, devolvemos datos mock
      return this.getMockData(endpoint, options) as T;
    }
  }

  private getMockData(endpoint: string, options: RequestInit): any {
    // Simulador de datos basado en el endpoint
    if (endpoint.includes('/sucursales')) {
      return this.getMockSucursales();
    }
    if (endpoint.includes('/servicios')) {
      return this.getMockServicios();
    }
    if (endpoint.includes('/profesionales')) {
      return this.getMockProfesionales();
    }
    if (endpoint.includes('/disponibilidad')) {
      return this.getMockDisponibilidad();
    }
    if (endpoint.includes('/citas')) {
      if (options.method === 'POST') {
        return this.getMockNuevaCita(JSON.parse(options.body as string));
      }
      return this.getMockCita();
    }

    return null;
  }

  // Métodos para Sucursales
  async getSucursales(): Promise<Sucursal[]> {
    return this.request<Sucursal[]>('/sucursales');
  }

  async getSucursal(id: ID): Promise<Sucursal> {
    return this.request<Sucursal>(`/sucursales/${id}`);
  }

  // Métodos para Servicios
  async getServicios(filters?: { sucursalId?: ID; especialidad?: string }): Promise<Servicio[]> {
    const params = new URLSearchParams();
    if (filters?.sucursalId) params.append('sucursalId', filters.sucursalId);
    if (filters?.especialidad) params.append('especialidad', filters.especialidad);

    const query = params.toString() ? `?${params}` : '';
    return this.request<Servicio[]>(`/servicios${query}`);
  }

  // Métodos para Profesionales
  async getProfesionales(filters?: { sucursalId?: ID; especialidad?: string }): Promise<Profesional[]> {
    const params = new URLSearchParams();
    if (filters?.sucursalId) params.append('sucursalId', filters.sucursalId);
    if (filters?.especialidad) params.append('especialidad', filters.especialidad);

    const query = params.toString() ? `?${params}` : '';
    return this.request<Profesional[]>(`/profesionales${query}`);
  }

  async getProfesional(id: ID): Promise<Profesional> {
    return this.request<Profesional>(`/profesionales/${id}`);
  }

  // Métodos para Disponibilidad
  async getDisponibilidad(params: {
    profesionalId: ID;
    fecha: string;
    servicioId: ID;
  }): Promise<DisponibilidadSlot[]> {
    const { profesionalId, fecha, servicioId } = params;
    return this.request<DisponibilidadSlot[]>(
      `/disponibilidad?profesionalId=${profesionalId}&fecha=${fecha}&servicioId=${servicioId}`
    );
  }

  // Métodos para Citas
  async getCita(id: ID): Promise<Cita> {
    return this.request<Cita>(`/citas/${id}`);
  }

  async getCitaPorCodigo(codigo: string): Promise<Cita> {
    return this.request<Cita>(`/citas/codigo/${codigo}`);
  }

  async crearCita(data: Omit<Cita, 'id' | 'codigo' | 'audit'>): Promise<Cita> {
    return this.request<Cita>('/citas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async reprogramarCita(id: ID, data: { fecha: string; horaInicio: string }): Promise<Cita> {
    return this.request<Cita>(`/citas/${id}/reprogramar`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelarCita(id: ID): Promise<void> {
    return this.request<void>(`/citas/${id}/cancelar`, {
      method: 'PUT',
    });
  }

  async actualizarEstadoCita(id: ID, estado: string): Promise<Cita> {
    return this.request<Cita>(`/citas/${id}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado }),
    });
  }

  // Métodos para Notificaciones
  async enviarNotificacionEmail(params: {
    destinatario: string;
    asunto: string;
    contenido: string;
    adjuntos?: Array<{ nombre: string; contenido: string }>;
  }): Promise<void> {
    return this.request<void>('/notificaciones/email', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async enviarNotificacionSMS(params: {
    telefono: string;
    mensaje: string;
  }): Promise<void> {
    return this.request<void>('/notificaciones/sms', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Métodos Mock para desarrollo
  private getMockSucursales(): Sucursal[] {
    return [
      {
        id: 'suc-1',
        nombre: 'Clínica Providencia',
        direccion: 'Av. Providencia 1234, Providencia',
        telefono: '+56 2 2345 6789',
        horarioAtencion: {
          lunes: { abre: '08:00', cierra: '20:00' },
          martes: { abre: '08:00', cierra: '20:00' },
          miercoles: { abre: '08:00', cierra: '20:00' },
          jueves: { abre: '08:00', cierra: '20:00' },
          viernes: { abre: '08:00', cierra: '18:00' },
          sabado: { abre: '09:00', cierra: '14:00' },
          domingo: null,
        },
      },
      {
        id: 'suc-2',
        nombre: 'Clínica Maipú',
        direccion: 'Av. Américo Vespucio 456, Maipú',
        telefono: '+56 2 3456 7890',
        horarioAtencion: {
          lunes: { abre: '08:30', cierra: '19:30' },
          martes: { abre: '08:30', cierra: '19:30' },
          miercoles: { abre: '08:30', cierra: '19:30' },
          jueves: { abre: '08:30', cierra: '19:30' },
          viernes: { abre: '08:30', cierra: '17:30' },
          sabado: { abre: '09:00', cierra: '13:00' },
          domingo: null,
        },
      },
    ];
  }

  private getMockServicios(): Servicio[] {
    return [
      {
        id: 'serv-1',
        nombre: 'Control',
        especialidad: 'Odontología General',
        duracionMinutos: 15,
        bufferPrevioMin: 5,
        bufferPosteriorMin: 5,
      },
      {
        id: 'serv-2',
        nombre: 'Limpieza',
        especialidad: 'Odontología General',
        duracionMinutos: 30,
        bufferPrevioMin: 5,
        bufferPosteriorMin: 10,
      },
      {
        id: 'serv-3',
        nombre: 'Endodoncia',
        especialidad: 'Endodoncia',
        duracionMinutos: 60,
        bufferPrevioMin: 10,
        bufferPosteriorMin: 15,
      },
      {
        id: 'serv-4',
        nombre: 'Urgencia',
        especialidad: 'Odontología General',
        duracionMinutos: 30,
        bufferPrevioMin: 0,
        bufferPosteriorMin: 5,
      },
    ];
  }

  private getMockProfesionales(): Profesional[] {
    return [
      {
        id: 'prof-1',
        nombre: 'Dra. Ana Pérez',
        especialidades: ['Odontología General', 'Endodoncia'],
        sucursalIds: ['suc-1'],
        turnos: [
          { diaSemana: 1, desde: '09:00', hasta: '18:00', sucursalId: 'suc-1' },
          { diaSemana: 2, desde: '09:00', hasta: '18:00', sucursalId: 'suc-1' },
          { diaSemana: 3, desde: '09:00', hasta: '18:00', sucursalId: 'suc-1' },
          { diaSemana: 4, desde: '09:00', hasta: '18:00', sucursalId: 'suc-1' },
          { diaSemana: 5, desde: '09:00', hasta: '17:00', sucursalId: 'suc-1' },
        ],
      },
      {
        id: 'prof-2',
        nombre: 'Dr. Luis Soto',
        especialidades: ['Odontología General', 'Cirugía'],
        sucursalIds: ['suc-1', 'suc-2'],
        turnos: [
          { diaSemana: 1, desde: '08:00', hasta: '16:00', sucursalId: 'suc-1' },
          { diaSemana: 2, desde: '08:00', hasta: '16:00', sucursalId: 'suc-1' },
          { diaSemana: 3, desde: '08:00', hasta: '16:00', sucursalId: 'suc-2' },
          { diaSemana: 4, desde: '08:00', hasta: '16:00', sucursalId: 'suc-2' },
          { diaSemana: 5, desde: '08:00', hasta: '15:00', sucursalId: 'suc-1' },
        ],
      },
    ];
  }

  private getMockDisponibilidad(): DisponibilidadSlot[] {
    const slots: DisponibilidadSlot[] = [];

    // Generar slots cada 15 minutos desde las 9:00 hasta las 17:00
    for (let hora = 9; hora < 17; hora++) {
      for (const minuto of [0, 15, 30, 45]) {
        const horaInicio = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        const horaFin = minuto === 45
          ? `${(hora + 1).toString().padStart(2, '0')}:00`
          : `${hora.toString().padStart(2, '0')}:${(minuto + 15).toString().padStart(2, '0')}`;

        // Simular algunos slots ocupados aleatoriamente
        const ocupado = Math.random() < 0.3;

        slots.push({
          horaInicio,
          horaFin,
          disponible: !ocupado,
          motivoNoDisponible: ocupado ? 'OCUPADO' : undefined,
        });
      }
    }

    return slots;
  }

  private getMockCita(): Cita {
    return {
      id: 'cita-mock-1',
      codigo: 'DEN-2025-001234',
      sucursalId: 'suc-1',
      profesionalId: 'prof-1',
      servicioId: 'serv-1',
      fecha: '2025-10-15',
      horaInicio: '10:00',
      horaFin: '10:15',
      estado: 'PROGRAMADA',
      paciente: {
        nombre: 'Juan Pérez',
        rut: '12.345.678-9',
        telefono: '+56 9 8765 4321',
        email: 'juan@ejemplo.com',
        prevision: 'Fonasa',
      },
      creadaPor: 'PACIENTE',
      audit: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }

  private getMockNuevaCita(data: any): Cita {
    return {
      ...this.getMockCita(),
      ...data,
      id: `cita-${Date.now()}`,
      codigo: `DEN-2025-${Math.random().toString().slice(2, 8).padStart(6, '0')}`,
      audit: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }
}

export const apiClient = new ApiClient();
