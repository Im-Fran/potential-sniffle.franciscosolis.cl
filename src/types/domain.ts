export type ID = string;

export type EstadoCita = 'PROGRAMADA' | 'CONFIRMADA' | 'ATENDIDA' | 'REPROGRAMADA' | 'CANCELADA' | 'NO_SHOW';

export interface Sucursal {
  id: ID;
  nombre: string;
  direccion: string;
  telefono?: string;
  horarioAtencion: {
    // por día de la semana, para UI informativa
    lunes: { abre: string; cierra: string } | null;
    martes: { abre: string; cierra: string } | null;
    miercoles: { abre: string; cierra: string } | null;
    jueves: { abre: string; cierra: string } | null;
    viernes: { abre: string; cierra: string } | null;
    sabado: { abre: string; cierra: string } | null;
    domingo: { abre: string; cierra: string } | null;
  };
}

export interface Profesional {
  id: ID;
  nombre: string;
  especialidades: string[]; // Ej: ["Odontología General","Endodoncia"]
  sucursalIds: ID[];
  turnos: TurnoSemanal[];   // disponibilidad recurrente
  pausas?: Bloqueo[];       // colaciones/pausas recurrentes
}

export interface Servicio {
  id: ID;
  nombre: string;           // Limpieza, Control, Urgencia, etc.
  especialidad?: string;
  duracionMinutos: number;  // 15, 30, 45, 60...
  bufferPrevioMin?: number; // opcional
  bufferPosteriorMin?: number;
}

export interface Cita {
  id: ID;
  codigo: string;           // para lookup público
  sucursalId: ID;
  profesionalId: ID;
  servicioId: ID;
  fecha: string;            // ISO date (Y-M-D) interpretada en America/Santiago
  horaInicio: string;       // "HH:mm"
  horaFin: string;          // calculado por duración+buffers
  estado: EstadoCita;
  paciente: {
    nombre: string;
    rut: string;
    telefono?: string;
    email?: string;
    prevision?: 'Fonasa' | 'Isapre' | 'Particular';
    notas?: string;
  };
  creadaPor: 'PACIENTE' | 'RECEPCIONISTA' | 'ADMIN';
  audit: { createdAt: string; updatedAt: string };
}

export interface TurnoSemanal {
  diaSemana: 1|2|3|4|5|6|0; // Lunes=1 ... Domingo=0
  desde: string;            // "HH:mm"
  hasta: string;            // "HH:mm"
  sucursalId: ID;
}

export interface Bloqueo {
  fecha: string;            // YYYY-MM-DD
  desde: string;            // "HH:mm"
  hasta: string;            // "HH:mm"
  motivo?: string;
  profesionalId?: ID;       // si null => bloqueo de sucursal
  sucursalId: ID;
}

export interface DisponibilidadSlot {
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
  motivoNoDisponible?: 'OCUPADO'|'FUERA_TURNO'|'BLOQUEO'|'FUERA_HORARIO'|'BUFFER';
}

export interface Usuario {
  id: ID;
  nombre: string;
  email: string;
  rol: 'RECEPCIONISTA' | 'PROFESIONAL' | 'ADMIN';
  sucursalIds?: ID[];
  profesionalId?: ID;
}

// Nuevo: Paciente registrado
export interface PacienteRegistrado {
  id: ID;
  rut: string;
  nombre: string;
  email: string;
  telefono: string;
  fechaNacimiento?: string;
  prevision: 'Fonasa' | 'Isapre' | 'Particular';
  direccion?: string;
  contactoEmergencia?: {
    nombre: string;
    telefono: string;
    relacion: string;
  };
  historialMedico?: {
    alergias?: string[];
    medicamentos?: string[];
    condicionesMedicas?: string[];
    observaciones?: string;
  };
  fechaRegistro: string;
  ultimaActualizacion: string;
  activo: boolean;
}

// Nuevo: Configuración del sistema
export interface ConfiguracionSistema {
  id: ID;
  general: {
    nombreClinica: string;
    logo?: string;
    colorPrimario: string;
    colorSecundario: string;
    idioma: string;
    zonaHoraria: string;
  };
  reservas: {
    anticipacionMinima: number; // horas
    anticipacionMaxima: number; // días
    permitirReprogramacion: boolean;
    horasLimiteReprogramacion: number;
    permitirCancelacion: boolean;
    horasLimiteCancelacion: number;
    requierePagoAnticipado: boolean;
    overbookingPermitido: boolean;
    porcentajeOverbooking: number;
  };
  notificaciones: {
    emailConfirmacion: boolean;
    smsConfirmacion: boolean;
    recordatorioEmail: boolean;
    recordatorioSMS: boolean;
    horasAnteriorRecordatorio: number;
    emailCancelacion: boolean;
    smsCancelacion: boolean;
  };
  horarios: {
    horaAperturaDefault: string;
    horaCierreDefault: string;
    duracionSlotDefault: number; // minutos
    tiempoBufferDefault: number; // minutos
    diasLaboralesDefault: number[]; // 1=lunes, 7=domingo
  };
}

// Nuevo: Reportes
export interface ReporteEstadisticas {
  periodo: {
    fechaInicio: string;
    fechaFin: string;
  };
  resumenGeneral: {
    totalCitas: number;
    citasAtendidas: number;
    citasCanceladas: number;
    citasNoShow: number;
    tasaOcupacion: number;
    ingresosTotales: number;
    pacientesNuevos: number;
    pacientesRecurrentes: number;
  };
  citasPorDia: Array<{
    fecha: string;
    total: number;
    atendidas: number;
    canceladas: number;
    noShow: number;
  }>;
  serviciosMasPopulares: Array<{
    nombre: string;
    cantidad: number;
    porcentaje: number;
    ingresos: number;
  }>;
  profesionalRanking: Array<{
    nombre: string;
    citasAtendidas: number;
    ingresos: number;
    satisfaccion: number;
  }>;
  horariosPico: Array<{
    hora: string;
    cantidad: number;
  }>;
  ingresosPorMes: Array<{
    mes: string;
    ingresos: number;
  }>;
}

export interface ReservaStep {
  sucursal?: Sucursal;
  servicio?: Servicio;
  profesional?: Profesional;
  fecha?: string;
  hora?: string;
  paciente?: {
    nombre: string;
    rut: string;
    telefono: string;
    email: string;
    prevision: 'Fonasa' | 'Isapre' | 'Particular';
    notas?: string;
  };
}
